import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './user';
import { Session } from './session';

import { TicketType } from '../../types/ticket';

@Entity({name: "ticket"})
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: ['NORMAL', 'SUPER'] })
  type!: TicketType;

  @Column({ type: 'timestamp', nullable: true })
  usedAt!: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Session, { onDelete: 'CASCADE' })
  session!: Session;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
