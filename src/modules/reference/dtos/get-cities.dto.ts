import { IsNumberString } from 'class-validator';

export class GetCitiesDto {
  @IsNumberString()
  provinceCode: string;
}
