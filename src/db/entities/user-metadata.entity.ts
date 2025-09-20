import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'public' })
export class UserMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isEmailVerified: boolean; // Email must be verified active first before able to access the system

  @Column({ default: false })
  isGoogleLogin: boolean;

  @Column({ nullable: true })
  googleAccessToken: string;

  @Column({ nullable: true })
  googleRefreshToken: string;

  @OneToOne(() => User, (user) => user.userMetadata)
  @JoinColumn()
  user: User;
}
