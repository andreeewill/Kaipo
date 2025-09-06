import { Controller, Post } from '@nestjs/common';
import { CasbinService } from 'src/api/casbin/providers/casbin.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly casbinService: CasbinService) {}

  @Post('clinic/base')
  async seedNewBaseClinic(clinicName: string) {}
}
