import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Token } from "./token";
import { UserRole } from "../../types/user";

@Entity({name: "user"})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public email: string = '';

    @Column()
    public password: string = '';

    @Column({ type: 'varchar', default: 'USER' })
    role!: UserRole;

    @OneToMany(() => Token, (token) => token.user)
    tokens!: Token[];

    @CreateDateColumn({ type: "timestamptz" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    public updatedAt!: Date;

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