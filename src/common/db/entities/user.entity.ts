import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
}

@Entity({ schema: 'public' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'user_name', unique: true })
  userName: string;

  @Column()
  email: string;

  @Column()
  dob: Date;

  @Column({ name: 'contact_info' })
  contactInfo: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  role: UserRole;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
