import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface ExtendedUserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
}

export const extendedUserRepository = {
  findByEmail(this: Repository<User>, email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  },
};
