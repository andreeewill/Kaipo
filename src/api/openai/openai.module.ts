import { Module } from '@nestjs/common';
import { OpenAiService } from './providers/openai.service';
import { OpenaiPrompterProvider } from './providers/openai-prompter.provider';

@Module({
  providers: [OpenAiService, OpenaiPrompterProvider],
  exports: [OpenAiService],
})
export class OpenAIModule {}
