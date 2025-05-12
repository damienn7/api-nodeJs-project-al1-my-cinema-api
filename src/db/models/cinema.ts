import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';

import { CinemaStatus, CinemaType } from '../../types/cinema';

@Entity({name: "cinema"})
export class Cinema extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  image!: string;

  @Column({ type: 'enum', enum: ['2D', '3D', 'IMAX'] })
  type!: CinemaType;

  @Column({ type: 'int' })
  capacity!: number;

  @Column()
  isAccessible!: boolean;

  @Column({ type: 'enum', enum: ['AVAILABLE', 'MAINTENANCE'], default: 'AVAILABLE' })
  status!: CinemaStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
