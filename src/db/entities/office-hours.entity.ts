import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Branch } from './branch.entity';

@Entity({ schema: 'public' })
export class OfficeHours {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'numeric',
    nullable: false,
    comment: '0 = Sunday, 1 = Monday, ..., 6 = Saturday',
  })
  dayOfWeek: number;

  @Column({ type: 'time', comment: 'Format HH:MM', nullable: false })
  startTime: string;

  @Column({ type: 'time', comment: 'Format HH:MM', nullable: false })
  endTime: string;

  @Column({ type: 'varchar', length: 50, default: 'Asia/Jakarta' })
  timeZone: string;

  // Joins
  @ManyToOne(() => User, (user) => user.officeHours, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Branch, (branch) => branch.officeHours, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  branch: Branch;
}
