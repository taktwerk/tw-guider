import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class sqlite_sequences extends BaseEntity {

  @Column()
  rorid: string

  @Column()
  name: string

  @Column()
  seq: string
}
