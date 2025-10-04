import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Branch } from './branch.entity';
import { Patient } from './patient.entity';

export enum Status {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

@Entity()
export class Organization {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @ManyToMany(() => User, (user) => user.organizations)
  @JoinTable({
    name: 'organization_users',
  })
  users: User[];

  @OneToMany(() => Branch, (branch) => branch.organization)
  branches: Branch[];

  @OneToMany(() => Patient, (patient) => patient.organization)
  patients: Patient[];
}
