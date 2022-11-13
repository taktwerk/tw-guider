import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class user extends BaseEntity {

  @Column()
  id: string

  @Column()
  user_setting: string

  @Column()
  user_id: string
}
