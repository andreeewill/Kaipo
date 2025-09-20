import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppLogger } from 'src/common/logger/app-logger.service';
import {
  extendedUserMetadataRepository,
  ExtendedUserMetadataRepository,
} from '../entities-extender/user-metadata.extend';
import { UserMetadata } from '../entities/user-metadata.entity';

@Injectable()
export class UserMetadataRepository {
  private userMetadataRepository: ExtendedUserMetadataRepository;

  constructor(
    @InjectRepository(UserMetadata)
    private readonly repository: Repository<UserMetadata>,

    private readonly logger: AppLogger,
  ) {
    this.userMetadataRepository = this.repository.extend(
      extendedUserMetadataRepository,
    );
  }

  /**
   * Saves google token and all necessary infot to DB (access token, id token, refresh token, etc )
   */
  public async saveGoogleTokenInfo(
    userId: string,
    updatedValues: Partial<
      Pick<
        UserMetadata,
        'isGoogleLogin' | 'googleAccessToken' | 'googleRefreshToken'
      >
    >,
  ) {
    await this.userMetadataRepository.upsert(updatedValues, ['id']);

    this.logger.log(`Google token info has been saved to user id : ${userId}`);
  }
}
