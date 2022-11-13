import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class workflow_step extends BaseEntity {

  // @Column()
  // _id: string

  // @Column()
  // workflow_step_id: string

  // @Column()
  // next_workflow_step_id: string
}
