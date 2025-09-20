import { Module } from '@nestjs/common';
import { BasicController } from './controllers/basic.controller';

@Module({
  imports: [],
  controllers: [BasicController],
  providers: [],
})
export class BasicModule {}
