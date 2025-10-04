import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
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

  @Column()
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  pictureUrl: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Joins
  @ManyToMany(() => Organization, (organization) => organization.users, {
    nullable: false,
  })
  organizations: Organization[];

  @OneToOne(() => UserMetadata, (userMetadata) => userMetadata.user)
  userMetadata: UserMetadata;
}
