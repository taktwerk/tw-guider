import { BaseModel } from "src/controller/core/base/BaseModel";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WorkflowTransition extends BaseModel {

  @PrimaryGeneratedColumn()
  _id: number | undefined;

  @Column()
  workflow_step_id: string = '';

  @Column()
  next_workflow_step_id: string = '';

  @Column()
  action_key: string = '';

  @Column()
  default_order: string = '';

  @Column()
  _is_synced: string = '';

  @Column()
  created_at: string = '';

  @Column()
  local_created_at: string = '';

  @Column()
  created_by: string = '';

  @Column()
  updated_at: string = '';

  @Column()
  local_updated_at: string = '';

  @Column()
  updated_by: string = '';

  @Column()
  created_term: string = '';

  @Column()
  updated_term: string = '';

  @Column()
  deleted_at: string = '';

  @Column()
  local_deleted_at: string = '';

  @Column()
  deleted_by: string = '';

  @Column()
  id: string = '';
}
