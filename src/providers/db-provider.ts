import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AppSetting } from '../services/app-setting';
import { Plugins, Capacitor } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { CapacitorSQLitePlugin } from '@capacitor-community/sqlite';
const { CapacitorSQLite, Device, Storage } = Plugins;

declare var window: any;

@Injectable()
export class DbProvider {

  public db = CapacitorSQLite as any;

  /**
   * Init - init database etc. PS! Have to wait for Platform.ready
   */
  init(): Promise<any> {
    return new Promise(async (resolve) => {
      const info = await Device.getInfo();

      if (info.platform === 'android') {
        try {
          // TODO: change to  public db = CapacitorSQLite as any;
          // await this.db.requestPermissions();
          this.initDatabase();
        } catch (e) { console.log('db issue >> ', e) }
      }
      else { this.initDatabase(); }
      resolve(true);
    });
  }

  async initDatabase() {
    // if (typeof window.sqlitePlugin !== 'undefined') {
    //   this.db = window.sqlitePlugin.openDatabase({ name: AppSetting.DB_NAME, location: 'default' });
    // } else {
    //   this.db = window.openDatabase(AppSetting.DB_NAME, '1.0', 'Test DB', -1);
    // }
    await this.db.open({ database: AppSetting.DB_NAME })
  }

  removeDb(): Promise<any> {
    return new Promise((resolve) => {
      // if (typeof window.sqlitePlugin !== 'undefined') {
      //   this.db = window.sqlitePlugin.deleteDatabase({ name: AppSetting.DB_NAME, location: 'default' });
      // } else {
      //   this.db = window.deleteDatabase(AppSetting.DB_NAME, '1.0', 'Test DB', -1);
      // }
      this.db.deleteDatabase({ database: AppSetting.DB_NAME })
      resolve(true);
    });
  }

  /**
   * query - executes sql
   */
  query(q: string, params?: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      params = params || [];

      // this.db.transaction((tx) => {
      //   tx.executeSql(q, params, (tx, res) => {
      //     resolve(res);
      //   }, (tx, err) => {
      //     reject(err);
      //   });
      // });

      if (q.length > 0) {
        const res = await this.db.run({ statement: q, values: params });
        console.log(">>>>>>>>>")
        console.log(res)
        console.log(">>>>>>>>>")
        resolve(res)
      }
      else {
        return reject({ changes: -1, message: "Service not started" });
      }
    });
  }
}
