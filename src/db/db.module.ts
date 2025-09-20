import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { Branch } from './entities/branch.entity';

// Repositories
import { OrganizationRepository } from './repositories/organization.repository';
import { UserRepository } from './repositories/user.repository';
import { UserMetadata } from './entities/user-metadata.entity';
import { UserMetadataRepository } from './repositories/user-metadata.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization, Branch, UserMetadata]),
  ],
  controllers: [],
  exports: [OrganizationRepository, UserRepository, UserMetadataRepository],
  providers: [OrganizationRepository, UserRepository, UserMetadataRepository],
})
export class DbModule {}
