import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReservationStatus } from '../enums/reservation-status.enum';

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

  @Column({ nullable: false })
  date: string;

  @Column({ nullable: false })
  startTime: string;

  @Column({ nullable: false })
  endTime: string;

  @Column({
    nullable: false,
    comment:
      'No direct relation to appointment (for reference and easier query)',
  })
  organizationId: string;

  @Column({
    nullable: false,
    comment:
      'No direct relation to appointment (for reference and easier query)',
  })
  branchId: string;

  @Column({
    nullable: false,
    comment:
      'No direct relation to appointment (for reference and easier query)',
  })
  doctorId: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.Pending,
  })
  status: ReservationStatus;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
