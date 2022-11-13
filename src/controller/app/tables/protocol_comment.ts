import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class protocol_comments extends BaseEntity {

  @Column()
  _id: string

  @Column()
  creator: string

  @Column()
  protocol_id: string

  @Column()
  local_protocol_id: string

  @Column()
  comment: string

  @Column()
  event: string

  @Column()
  name: string

  @Column()
  old_workflow_step_id: string

  @Column()
  new_workflow_step_id: string

  @Column()
  _is_synced: string

  @Column()
  created_at: string

  @Column()
  local_created_at: string

  @Column()
  created_by: string

  @Column()
  updated_at: string

  @Column()
  local_updated_at: string

  @Column()
  updated_by: string

  @Column()
  created_term: string

  @Column()
  updated_term: string

  @Column()
  deleted_at: string

  @Column()
  local_deleted_at: string

  @Column()
  deleted_by: string

  @Column()
  id: string
}
