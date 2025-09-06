import { IsNotEmpty, IsString } from 'class-validator';

export class ClinicBaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
