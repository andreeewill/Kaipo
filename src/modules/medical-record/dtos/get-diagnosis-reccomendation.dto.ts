import { MaxLength, IsString, IsNotEmpty } from 'class-validator';

export class GetDiagnosisRecommendationDto {
  @MaxLength(1000, {
    message: '$property tidak boleh lebih dari 1000 karakter',
  })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  anamnesis: string;

  @MaxLength(1000, {
    message: '$property tidak boleh lebih dari 1000 karakter',
  })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  examination: string;
}
