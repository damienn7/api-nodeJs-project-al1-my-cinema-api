import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Token } from "./token";

@Entity({name: "user"})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public email: string = '';

    @Column()
    public password: string = '';

    @OneToMany(() => Token, (token) => token.token)
    tokens: Token[] = [];

    @CreateDateColumn({ type: "timestamptz" })
    public createdAt!: Date; // timestamp with timezone -> timestamptz

    @UpdateDateColumn({ type: "timestamptz" })
    public updatedAt!: Date; // timestamp with timezone -> timestamptz

    // constructor(
    //     id: number,
    //     email: string,
    //     password: string,
    //     tokens: Token[],
    //     createdAt: Date,
    //     updatedAt: Date
    // ) {
    //     super();
    //     this.id = id;
    //     this.password = password;
    //     this.email = email;
    //     this.tokens = tokens;
    //     this.createdAt = createdAt;
    //     this.updatedAt = updatedAt;
    // }
}