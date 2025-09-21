import { Injectable } from '@nestjs/common';
import {
  extendedUserRepository,
  ExtendedUserRepository,
} from '../entities-extender/user.extend';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class UserRepository {
  private userRepository: ExtendedUserRepository;

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,

    private readonly appLogger: AppLogger,
  ) {
    this.userRepository = this.repository.extend(extendedUserRepository);
  }

  /**
   * Get account by email
   * @param email
   * @returns
   */
  public async getByEmail(email: string) {
    this.appLogger.log(`Getting user by email: ${email}`);

    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  /**
   * Get user by ID
   * @param userId
   * @returns
   */
  public async findById(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return user;
  }
}
