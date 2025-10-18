import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CasbinModule } from 'src/api/casbin/casbin.module';

// Entities
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { Branch } from './entities/branch.entity';
import { OfficeHours } from './entities/office-hours.entity';
import { UserMetadata } from './entities/user-metadata.entity';
import { Patient } from './entities/patient.entity';
import { Reservation } from './entities/reservation.entity';

// Repositories
import { OrganizationRepository } from './repositories/organization.repository';
import { UserRepository } from './repositories/user.repository';
import { UserMetadataRepository } from './repositories/user-metadata.repository';
import { PatientRepository } from './repositories/patient.repository';
import { BranchRepository } from './repositories/branch.repository';
import { OfficeHoursRepository } from './repositories/office-hours.repository';
import { ReservationRepository } from './repositories/reservation.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Organization,
      Branch,
      UserMetadata,
      Patient,
      OfficeHours,
      Reservation,
    ]),
    CasbinModule,
  ],
  controllers: [],
  exports: [
    OrganizationRepository,
    BranchRepository,
    UserRepository,
    UserMetadataRepository,
    PatientRepository,
    OfficeHoursRepository,
    ReservationRepository,
  ],
  providers: [
    OrganizationRepository,
    BranchRepository,
    UserRepository,
    UserMetadataRepository,
    PatientRepository,
    OfficeHoursRepository,
    ReservationRepository,
  ],
})
export class DbModule {}
