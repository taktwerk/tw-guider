import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Guidstep extends BaseEntity {

  @Column()
  _id: string

  @Column()
  guide_id: string

  @Column()
  order_number: string

  @Column()
  parent_guide_id: string

  @Column()
  title: string

  @Column()
  description_html: string

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
  local_guide_id: string

  @Column()
  design_canvas_meta: string

  @Column()
  design_canvas_file: string

  @Column()
  _is_synced: string

  // @Column()
  // guide_category_id: string

  // @Column()
  // client_id: string

  // @Column()
  // name: string

  // @Column()
  // asset_html: string

  // @Column()
  // asset_file: string

  // @Column()
  // asset_file_path: string

  // @Column()
  // local_asset_file: string

  // @Column()
  // thumb_asset_file: string

  // @Column()
  // thumb_asset_file_path: string

  // @Column()
  // local_pdf_image: string

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
