import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Gender } from '../enums/gender.enum';
import { MaritalStatus } from '../enums/marital-status.enum';
import { Citizenship } from '../enums/citizenship.enum';
import { Organization } from './organization.entity';

@Entity({ schema: 'public' })
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ comment: 'Nomor Induk Kependudukan' })
  NIK: string;

  @Column({ nullable: true })
  IHS: string;

  @Column({ comment: 'Nomor Kartu Keluarga', nullable: true })
  kkNumber?: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  dob: Date;

  @Column({ nullable: true })
  birthPlace?: string;

  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @Column({ type: 'enum', enum: MaritalStatus, nullable: true })
  maritalStatus?: MaritalStatus;

  @Column({ comment: 'Alamat lengkap sesuai KTP/NIK', nullable: false })
  addressLine: string;

  @Column({ comment: 'Peruntukan alamat', default: 'home' })
  addressUse: string;

  @Column({ comment: 'Kode administratif wilayah' })
  extensionCode: string;

  @Column({ nullable: false })
  provinceCode: string;

  @Column({ nullable: false })
  city: string;

  @Column({ comment: 'Kecamatan', nullable: false })
  district: string;

  @Column({ comment: 'Kelurahan/Desa', nullable: false })
  village: string;

  @Column({ nullable: false })
  rt: string;

  @Column({ nullable: false })
  rw: string;

  @Column({ nullable: false })
  postalCode: string;

  @Column({ default: 'ID' })
  country: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: Citizenship,
    nullable: false,
    default: Citizenship.WNI,
  })
  citizenshipStatus: Citizenship;

  @Column({ nullable: true })
  occupation?: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Join
  @ManyToOne(() => Organization, (org) => org.patients)
  organization: Organization;
}
