import { BaseModel } from "src/controller/core/base/BaseModel";
import { AfterLoad, BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth extends BaseModel {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id: string = '';

  @Column({nullable: true})
  client_id: string = '';

  @Column({nullable: true})
  is_authority: boolean = false;

  @Column({nullable: true})
  username: string = '';

  @Column({nullable: true})
  password: string = '';

  @Column({nullable: true})
  auth_token: string = '';

  @Column({nullable: true})
  login_at: string = '';

  @Column({nullable: true})
  last_auth_item_changed_at: string = '';

  @Column({nullable: true})
  groups_col: string = '';

  // additional Info
  @Column({nullable: true})
  clientName: string = '';

  @Column({nullable: true})
  email: string = '';

  @Column({nullable: true})
  fullname: string = '';

  @Column({nullable: true})
  last_login_at: string = '';

  @Column({nullable: true})
  roles_col: string = '';

  @Column({nullable: true})
  permissions_col: string = '';

  roles: Array<any> = [];
  permissions: Array<any> = [];
  groups: Array<any> = [];

  @BeforeInsert()
  @BeforeUpdate()
  beforeUpdate() {
    this.roles_col       = JSON.stringify(this.roles);
    this.permissions_col = JSON.stringify(this.permissions);
    this.groups_col = JSON.stringify(this.groups);
  }

  @AfterLoad()
  afterLoad(){
    this.roles       = JSON.parse(this.roles_col) ?? [];
    this.permissions = JSON.parse(this.permissions_col) ?? [];
    this.groups = JSON.parse(this.groups_col) ?? [];
  }
}
