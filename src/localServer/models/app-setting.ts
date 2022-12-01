import { BaseModel } from "src/controller/core/base/BaseModel";
import { AppSettingKey } from "src/controller/state/interface";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AppSetting extends BaseModel {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  key: string = '';

  @Column()
  value: string = '';

  static async get(key: AppSettingKey, defaultValue: any = null)
  {
    let result  = await this.findOneBy({key});
    if(result) {
      return result.value;
    }

    const appSetting = new AppSetting();
    appSetting.key = key;
    appSetting.value = defaultValue as string;
    appSetting.save();
    return defaultValue;
  }

  static async set(key: AppSettingKey, value: any) {
    let result  = await this.findOneBy({key});
    if(result) {
      (result as AppSetting).value = value;
      result.save();
    }
  }

}
