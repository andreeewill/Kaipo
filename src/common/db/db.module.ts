import { Global, Module } from '@nestjs/common';
import { OrganizationRepository } from './repositories/organization.repository';
import { Organization } from './entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  controllers: [],
  exports: [OrganizationRepository],
  providers: [OrganizationRepository],
})
export class DbModule {}
