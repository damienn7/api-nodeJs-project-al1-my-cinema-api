import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Movie } from './movie';
import { Cinema } from './cinema';

@Entity({name: "session"})
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  movie!: Movie;

  @ManyToOne(() => Cinema, { onDelete: 'CASCADE' })
  cinema!: Cinema;

  @Column({ type: 'timestamptz' })
  startsAt!: Date;

  @Column({ type: 'timestamptz' })
  endsAt!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
