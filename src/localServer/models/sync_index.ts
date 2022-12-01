import { BaseModel } from "src/controller/core/base/BaseModel";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SyncIndex extends BaseModel {

  @PrimaryGeneratedColumn()
  _id: number | undefined;

  @Column()
  model: string = '';

  @Column()
  model_id: string = '';

  @Column()
  user_id: string = '';

  // @Column()
  // protocol_id: string = '';

  // @Column()
  // protocol_file_path: string = '';

  // @Column()
  // local_protocol_file: string = '';

  // @Column()
  // thumb_protocol_file: string = '';

  // @Column()
  // thumb_protocol_file_path: string = '';

  // @Column()
  // local_thumb_protocol_file: string = '';

  // @Column()
  // pdf_image: string = '';

  // @Column()
  // pdf_image_path: string = '';

  // @Column()
  // local_pdf_image: string = '';

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
