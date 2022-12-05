import { BaseModel } from "src/controller/core/base/BaseModel";
import { UserSettingKey } from "src/controller/state/interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserSetting extends BaseModel {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  key: string = '';

  @Column()
  value: string = '';

  static async get(key: UserSettingKey, defaultValue: any = null)
  {
    let result  = await this.findOneBy({key});
    if(result) {
      return result.value;
    }

    if(defaultValue) {
      const setting = new UserSetting();
      setting.key = key;
      setting.value = defaultValue as string;
      setting.save();
    }
    return defaultValue;
  }

  static async set(key: UserSettingKey, value: any) {
    let result  = await this.findOneBy({key});
    if(result) {
      (result as UserSetting).value = value;
      result.save();
    }
  }

}
