import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class LoginBasicDto {
  @MaxLength(50, {
    message: '$property tidak boleh lebih dari 50 karakter',
  })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  email: string;

  @MaxLength(50, {
    message: '$property tidak boleh lebih dari 50 karakter',
  })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  password: string;
}
