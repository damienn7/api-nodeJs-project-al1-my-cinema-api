import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user';

@Entity({name: "movie"})
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  poster!: string;

  @Column({ type: 'int' })
  duration!: number;

  @Column({ type: 'date' })
  releasedAt!: Date;

  @ManyToOne(() => User, { nullable: true })
  createdBy!: User | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
