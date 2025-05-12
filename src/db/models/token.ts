import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { User } from "./user";

@Entity({ name: "token" })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public token: string = '';

  @Column()
  public refreshToken: string = '';

  @Column()
  public expiresAt!: Date;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: "CASCADE" })
  public user!: User;

  @CreateDateColumn({ type: "timestamptz" })
  public createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  public updatedAt!: Date;

//   constructor(
//     id: number,
//     token: string,
//     refreshToken: string,
//     expiresAt: Date,
//     user: User,
//     createdAt: Date,
//     updatedAt: Date
//   ) {
//     super();
//     this.id = id;
//     this.token = token;
//     this.refreshToken = refreshToken;
//     this.expiresAt = expiresAt;
//     this.user = user;
//     this.createdAt = createdAt;
//     this.updatedAt = updatedAt;
//   }
}