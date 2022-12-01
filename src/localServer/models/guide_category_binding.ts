import { BaseModel } from "src/controller/core/base/BaseModel";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GuideCategoryBinding extends BaseModel {

  @PrimaryGeneratedColumn()
  _id: number | undefined;

  @Column()
  guide_id: string = '';

  @Column()
  guide_category_id: string = '';

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
