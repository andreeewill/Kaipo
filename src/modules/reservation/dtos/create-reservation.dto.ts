import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsMobilePhone,
  IsUUID,
} from 'class-validator';

export class CreateReservationDto {
  @MaxLength(50, { message: '$property tidak boleh lebih dari 50 karakter' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  name: string;

  @IsMobilePhone(
    'id-ID',
    { strictMode: true },
    { message: '$property tidak valid' },
  )
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  phone: string;

  @MaxLength(1000, {
    message: '$property tidak boleh lebih dari 1000 karakter',
  })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  complaint: string;

  @IsUUID('4', { message: '$property harus berupa UUID yang valid' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  timeslotId: string;
}
