import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class GetAvailableTimeslotsDto {
  @IsUUID('4', { message: '$property harus berupa UUID yang valid' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  doctorId: string;

  @IsUUID('4', { message: '$property harus berupa UUID yang valid' })
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  branchId: string;
}
