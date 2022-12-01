import { BaseModel } from "src/controller/core/base/BaseModel";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GuideChild extends BaseModel {
  @PrimaryGeneratedColumn()
  _id: number | undefined;

  @Column()
  parent_guide_id: string = '';

  @Column()
  guide_id: string = '';

  @Column()
  order_number: string = '';

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
