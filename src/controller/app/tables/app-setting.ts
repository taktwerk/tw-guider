import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class AppSetting extends BaseEntity {


  @Column()
    _id: string

  @Column()
    settings: string

}
