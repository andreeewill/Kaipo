import { Global, Module } from '@nestjs/common';
import { OrganizationRepository } from './repositories/organization.repository';
import { Organization } from './entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [],
  exports: [OrganizationRepository],
  providers: [OrganizationRepository],
})
export class DbModule {}
