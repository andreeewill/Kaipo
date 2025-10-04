import { IsNumberString } from 'class-validator';

export class GetDistrictsDto {
  @IsNumberString()
  cityCode: string;
}
