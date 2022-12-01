import { BaseModel } from "src/controller/core/base/BaseModel";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sequence extends BaseModel {

  @PrimaryGeneratedColumn()
  _id: number | undefined;

  @Column()
  name: string = '';

  @Column()
  seq: string = '';
}
