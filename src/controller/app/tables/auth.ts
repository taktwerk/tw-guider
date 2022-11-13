import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Auth extends BaseEntity {


  @Column()
  _id: string

  @Column()
  user_id: string

  @Column()
  client_id: string

  @Column()
  is_authority: string

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  auth_token: string

  @Column()
  login_at: string

  @Column()
  last_auth_ite_changed_at: string

  @Column()
  additional_info: string

}
