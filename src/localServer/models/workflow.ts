import { BaseModel } from "src/controller/core/base/BaseModel";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Workflow extends BaseModel {

  @PrimaryGeneratedColumn()
  _id: number | undefined;

  @Column()
  workflow_step_id: string = '';

  @Column()
  next_workflow_step_id: string = '';
}
