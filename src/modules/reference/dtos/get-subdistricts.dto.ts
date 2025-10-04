import { IsNumberString } from 'class-validator';

export class GetSubDistrictsDto {
  @IsNumberString()
  districtCode: string;
}
