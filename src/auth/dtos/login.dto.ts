import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @MaxLength(50, {
    message: '$property tidak boleh lebih dari 50 karakter',
  })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  organization: string;

  @IsBoolean({ message: '$property harus berupa boolean' })
  @IsOptional()
  redirect: boolean;
}
