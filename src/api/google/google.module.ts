import { Inject, Module } from '@nestjs/common';
import { GoogleService } from './providers/google.service';

@Module({
  imports: [],
  exports: [GoogleService],
  providers: [GoogleService],
})
export class GoogleModule {}
