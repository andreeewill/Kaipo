import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OpenAI } from 'openai';

import openaiConfig from 'src/config/openai.config';
import { OpenaiPrompterProvider } from './openai-prompter.provider';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { GetDiagnosisRecommendation } from '../interfaces/get-diagnosis-recommendation.interface';

@Injectable()
export class OpenAiService implements OnModuleInit {
  private openAiClient: OpenAI;

  constructor(
    @Inject(openaiConfig.KEY)
    private readonly openAiConf: ConfigType<typeof openaiConfig>,

    private readonly logger: AppLogger,

    private readonly opneaiPrompterProvider: OpenaiPrompterProvider,
  ) {}

  public onModuleInit() {
    this.openAiClient = new OpenAI({ apiKey: this.openAiConf.apiKey });
  }

  /**
   * Get diagnosis recommendation + ICD10 code
   * @param diagnostic
   * @param examination
   */
  public async getDiagnosisRecommendation(
    diagnostic: string,
    examination: string,
  ): Promise<GetDiagnosisRecommendation> {
    const start = Date.now();
    const prompt = this.opneaiPrompterProvider.getPromptTemplateForRMEDiagnosis(
      diagnostic,
      examination,
    );

    this.logger.log(
      'Sending request to OpenAI API for diagnosis recommendation',
    );

    const response = await this.openAiClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Kamu adalah asisten medis gigi yang sangat akurat dalam menganalisis keluhan pasien dan mencocokkan dengan ICD-10.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'diagnosis_recommendations',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              recommendations: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    diagnosis: { type: 'string' },
                    icd10: { type: 'string' },
                    reasoning: { type: 'string' },
                  },
                  required: ['diagnosis', 'icd10', 'reasoning'],
                },
              },
              summary: { type: 'string' },
            },
            required: ['recommendations', 'summary'],
          },
          strict: true,
        },
      },
    });

    this.logger.log(
      `Token usage: ${response.usage?.prompt_tokens} prompt + ${response.usage?.completion_tokens} completion = ${response.usage?.total_tokens} total`,
    );
    this.logger.log(`Response time: ${Date.now() - start} ms`);

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}
