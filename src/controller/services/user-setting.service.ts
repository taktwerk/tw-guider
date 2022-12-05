import { Injectable } from '@angular/core';
import { UserSetting } from 'src/localServer/models/user-setting';
import { UserSettingKey } from '../state/interface';

@Injectable({
  providedIn: 'root'
})
export class UserSettingService {

  lastSyncedAt = null;

  constructor() {
    this.load();
  }

  load() {
    UserSetting.get(UserSettingKey.lastSyncedAt).then(val => this.lastSyncedAt = val);
  }

  // get(key: UserSettingKey) {
  //   UserSetting.get(UserSettingKey[key]).then(val => this[key] = val);
  // }

  // set(key: UserSettingKey, val: any) {
  //   this[key] = val;
  //   UserSetting.set(key, val);
  // }
}
