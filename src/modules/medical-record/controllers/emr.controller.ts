import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { GetDiagnosisRecommendationDto } from '../dtos/get-diagnosis-reccomendation.dto';
import { EmrService } from '../providers/emr.service';

@Controller('emr')
export class EmrController {
  constructor(private readonly emrService: EmrService) {}

  @Post('recommendation/diagnosis')
  @HttpCode(200)
  public getDiagnosisRecommendation(
    @Body() getDiagnosticRecommendation: GetDiagnosisRecommendationDto,
  ) {
    const res = this.emrService.getDiagnosisRecommendation(
      getDiagnosticRecommendation,
    );

    return res;
  }
}
