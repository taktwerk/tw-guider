import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Guide extends BaseEntity {


  @Column()
  _id: string

  @Column()
  client_id: string

  @Column()
  short_name: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  preview_file: string

  @Column()
  preview_file_path: string

  @Column()
  local_preview_file: string

  @Column()
  revision_term: string

  @Column()
  revision_counter: string

  @Column()
  duration: string

  @Column()
  template_id: string

  @Column()
  protocol_template_id: string

  @Column()
  revision: string

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
