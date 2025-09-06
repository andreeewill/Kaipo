import { IsDate, IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateStaffDto {
  @MaxLength(20, {
    message: '$property tidak boleh lebih dari 20 karakter',
  })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty()
  name: string;

  @MaxLength(50, {
    message: '$property tidak boleh lebih dari 50 karakter',
  })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty()
  email: string;

  @IsDate({ message: '$property harus berupa tanggal yang valid' })
  dob: Date;

  @MaxLength(20, {
    message: '$property tidak boleh lebih dari 20 karakter',
  })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty()
  contactInfo: string;
}
