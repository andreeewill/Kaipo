import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { UserMetadata } from './user-metadata.entity';

@Entity({ schema: 'public' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  email: string;

  @Column()
  dob: Date;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ nullable: true })
  password: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Joins
  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn()
  organization: Organization;

  @OneToOne(() => UserMetadata, (userMetadata) => userMetadata.user)
  userMetadata: UserMetadata;
}
