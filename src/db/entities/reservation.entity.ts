import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Branch } from './branch.entity';
import { OfficeHours } from './office-hours.entity';

@Entity({ schema: 'public' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false, type: 'text' })
  complaint: string;

  // Joins
  @ManyToOne(() => OfficeHours, { nullable: false })
  timeslot: OfficeHours;
}
