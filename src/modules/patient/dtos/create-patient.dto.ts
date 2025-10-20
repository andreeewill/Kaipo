import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsValidDate } from '../../../common/validations/decorators/IsValidDate.decorator';
import { Citizenship } from 'src/db/enums/citizenship.enum';

import { Gender } from 'src/db/enums/gender.enum';
import { MaritalStatus } from 'src/db/enums/marital-status.enum';

export class CreatePatientDto {
  @Length(16, 16, { message: '$property harus terdiri dari 16 karakter' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  NIK: string;

  @IsString({ message: '$property harus berupa string' })
  @IsOptional()
  kkNumber?: string;

  @MaxLength(50, { message: '$property tidak boleh lebih dari 50 karakter' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  name: string;

  @IsValidDate({
    message:
      '$property harus dalam format YYYY-MM-DD dan merupakan tanggal yang valid',
  })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  dob: string;

  @MaxLength(20, { message: '$property tidak boleh lebih dari 20 karakter' })
  @IsString({ message: '$property harus berupa string' })
  @IsOptional()
  birthPlace?: string;

  @IsEnum(Gender, { message: '$property hanya boleh male atau female' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  gender: Gender;

  @IsEnum(MaritalStatus, {
    message: '$property hanya boleh single, married, widowed, atau divorced',
  })
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @MinLength(10, { message: '$property minimal 10 karakter' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  addressLine: string;

  @IsString({ message: '$property harus berupa string' })
  @IsOptional()
  addressUse?: string;

  @IsString({ message: '$property harus berupa string' })
  @IsOptional()
  extensionCode?: string;

  @IsNumberString(
    { no_symbols: true },
    { message: '$property harus berupa string angka' },
  )
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  provinceCode: string;

  @MaxLength(50, { message: '$property tidak boleh lebih dari 50 karakter' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  provinceName: string;

  @IsNumberString(
    { no_symbols: true },
    { message: '$property harus berupa string angka' },
  )
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  cityCode: string;

  @IsString({ message: '$property harus berupa string' })
  @MaxLength(50, { message: '$property tidak boleh lebih dari 50 karakter' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  cityName: string;

  @IsNumberString(
    { no_symbols: true },
    { message: '$property harus berupa string angka' },
  )
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  districtCode: string;

  @MaxLength(50, { message: '$property tidak boleh lebih dari 50 karakter' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  districtName: string;

  @IsNumberString(
    { no_symbols: true },
    { message: '$property harus berupa string angka' },
  )
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  subDistrictCode: string;

  @MaxLength(50, { message: '$property tidak boleh lebih dari 50 karakter' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  subDistrictName: string;

  @IsNumberString(
    { no_symbols: true },
    { message: '$property harus berupa string angka' },
  )
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  rt: string;

  @IsNumberString(
    { no_symbols: true },
    { message: '$property harus berupa string angka' },
  )
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  rw: string;

  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  postalCode: string;

  @IsString({ message: '$property harus berupa string' })
  @IsOptional()
  country?: string;

  @IsMobilePhone(
    'id-ID',
    { strictMode: true },
    { message: '$property tidak valid' },
  )
  @IsOptional()
  phone?: string;

  @IsEmail({}, { message: '$property format tidak valid' })
  @IsOptional()
  email?: string;

  @IsEnum(Citizenship, { message: '$property hanya boleh WNI atau WNA' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  citizenshipStatus: Citizenship;
}
