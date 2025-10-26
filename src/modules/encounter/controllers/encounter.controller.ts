import { Controller, Post } from '@nestjs/common';

import { PERMISSION } from 'src/common/constants/permission.constant';
import { Permissions } from 'src/decorators/permissions.decorator';

import { EncounterService } from '../providers/apppoitment.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('encounter')
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new encounter (appointment). After reservation is created, admin will rectify the input and ',
  })
  public createEncounter() {
    console.log('Creating encounter...');
  }
}
