import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { OfficeHours } from './office-hours.entity';

@Entity({ schema: 'public' })
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ name: 'open_time', type: 'date' })
  openTime: Date;

  @Column({ name: 'close_time', type: 'date' })
  closeTime: Date;

  @Column({ name: 'is_default' })
  isDefault: boolean;

  @ManyToOne(() => Organization, (org) => org.branches)
  organization: Organization;

  @OneToMany(() => OfficeHours, (officeHours) => officeHours.branch)
  officeHours: OfficeHours[];
}
