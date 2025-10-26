# syntax=docker/dockerfile:1.7
################################################################################
# Kaipo — Production-optimized Dockerfile (NestJS + pnpm)
# - Multi-stage build with cached dependency graph (pnpm fetch)
# - Small Alpine runtime, non-root user, and proper signal handling via tini
# - Copies only runtime artifacts (dist, prod node_modules, public, keystore)
################################################################################

# ---------- Base image with pnpm enabled ----------
FROM node:lts-alpine AS base

ARG BUILDPLATFORM
ARG TARGETPLATFORM
ARG PNPM_VERSION=9.12.0

ENV PNPM_HOME="/pnpm" \
	PATH="/pnpm:$PATH"

# Enable pnpm via Corepack and pin the version for reproducibility
RUN corepack enable \
 	&& corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app


# ---------- Dependencies layer (maximizes build cache) ----------
FROM base AS deps

# Optional: keep pnpm store outside project to leverage layer cache
RUN pnpm config set store-dir /pnpm-store

# Only copy lockfile + manifest first to maximize caching
COPY package.json pnpm-lock.yaml ./

# Pre-fetch all deps (incl. dev) into the store based solely on lockfile
# This avoids re-resolving when app sources change
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store pnpm fetch


# ---------- Build stage ----------
FROM base AS build

# System deps for potential native modules (safe no-op if unused)
RUN apk add --no-cache --virtual .build-deps python3 make g++

# Reuse the fetched store for a fast, offline install
COPY --from=deps /pnpm-store /pnpm-store
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store pnpm install --offline

# Bring in the full application source
COPY . .

# Compile NestJS to dist/
RUN pnpm build

# Produce production-only node_modules to minimize runtime size
RUN pnpm prune --prod


# ---------- Runtime stage ----------
FROM node:lts-alpine AS runner

# Install tini for proper PID 1 signal handling and zombie reaping
RUN apk add --no-cache tini

ENV NODE_ENV=production \
	NODE_OPTIONS=--enable-source-maps

WORKDIR /app

# Create and use a non-root user before copying files so we can chown on copy
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# OCI image labels (filled via build-args in CI)
ARG VERSION="0.0.0"
ARG REVISION="unknown"
ARG BUILD_DATE
LABEL org.opencontainers.image.title="Kaipo" \
	org.opencontainers.image.description="Kaipo backend service" \
	org.opencontainers.image.version="$VERSION" \
	org.opencontainers.image.revision="$REVISION" \
	org.opencontainers.image.created="$BUILD_DATE" \
	org.opencontainers.image.source="https://github.com/andreeewill/Kaipo"

# Copy only what the app needs at runtime
COPY --chown=nodejs:nodejs --from=build /app/package.json ./package.json
COPY --chown=nodejs:nodejs --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --chown=nodejs:nodejs --from=build /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=build /app/dist ./dist

# Static assets and runtime files (adjust as needed)
# COPY --chown=nodejs:nodejs --from=build /app/public ./public
# COPY --chown=nodejs:nodejs --from=build /app/keystore ./keystore

USER nodejs

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/main.js"]

# Optional healthcheck (adjust path/port to your app)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
#   CMD wget -qO- http://127.0.0.1:3000/health || exit 1
