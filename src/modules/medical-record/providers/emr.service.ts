import { Injectable } from '@nestjs/common';

import { OpenAiService } from 'src/api/openai/providers/openai.service';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { GetDiagnosisRecommendationDto } from '../dtos/get-diagnosis-reccomendation.dto';

@Injectable()
export class EmrService {
  constructor(
    private readonly logger: AppLogger,

    private readonly openAiService: OpenAiService,
  ) {}

  public async getDiagnosisRecommendation(
    getDiagnosticRecommendation: GetDiagnosisRecommendationDto,
  ) {
    const result = await this.openAiService.getDiagnosisRecommendation(
      getDiagnosticRecommendation.anamnesis,
      getDiagnosticRecommendation.examination,
    );

    return result;
  }
}
