import { Repository } from 'typeorm';
import { UserMetadata } from '../entities/user-metadata.entity';

export interface ExtendedUserMetadataRepository
  extends Repository<UserMetadata> {}

export const extendedUserMetadataRepository = {};
