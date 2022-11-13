import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Feedback extends BaseEntity {


  @Column()
  _id: string

  @Column()
  client_id: string

  @Column()
  user_id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  reference_model: string

  @Column()
  feedback_url: string

  @Column()
  status: string

  @Column()
  reference_id: string

  @Column()
  attached_file: string

  @Column()
  attached_file_path: string

  @Column()
  local_attached_file: string

  @Column()
  thumb_attached_file: string

  @Column()
  thumb_attached_file_path: string

  @Column()
  local_thumb_attached_file: string

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
  updated_term: string

  @Column()
  deleted_at: string

  @Column()
  local_deleted_at: string

  @Column()
  deleted_by: string

  @Column()
  id: string

  // @Column()
  // is_authority: string

  // @Column()
  // username: string

  // @Column()
  // password: string

  // @Column()
  // auth_token: string

  // @Column()
  // login_at: string

  // @Column()
  // last_auth_ite_changed_at: string

  // @Column()
  // additional_info: string

}
