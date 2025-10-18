import { IsNotEmpty, IsString } from 'class-validator';

export class GetAvailableBranches {
  @IsString({ message: '$property harus berupa string' })
  @IsNotEmpty({ message: '$property tidak boleh kosong' })
  organizationId: string;
}
