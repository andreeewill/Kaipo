import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { Branch } from './entities/branch.entity';

// Repositories
import { OrganizationRepository } from './repositories/organization.repository';
import { UserRepository } from './repositories/user.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Branch])],
  controllers: [],
  exports: [OrganizationRepository, UserRepository],
  providers: [OrganizationRepository, UserRepository],
})
export class DbModule {}
