import { Global, Module } from '@nestjs/common';
import { OrganizationRepository } from './repositories/organization.repository';
import { Organization } from './entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Branch } from './entities/branch.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Branch])],
  controllers: [],
  exports: [OrganizationRepository],
  providers: [OrganizationRepository],
})
export class DbModule {}
