import { Injectable } from '@angular/core';
import { AppSetting } from '../services/app-setting';
import { Plugins } from '@capacitor/core';
import '@capacitor-community/sqlite';
const { CapacitorSQLite, Device } = Plugins;

@Injectable()
export class DbProvider {
  public db = CapacitorSQLite;
  /**
   * Init - init database etc. PS! Have to wait for Platform.ready
   */
  init(): Promise<any> {
    return new Promise(async (resolve) => {
      const info = await Device.getInfo();
      if (info.platform === 'android') {
        try {
          const db = CapacitorSQLite as any;
          await db.requestPermissions();
          this.openDatabase();
        } catch (e) { console.log('db issue >> ', e) }
      }
      else { this.openDatabase(); }
      resolve(true);
    });
  }

  async openDatabase() {
    await this.db.open({ database: AppSetting.DB_NAME });
    console.log(this.db)
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
      if (q.length > 0) {
        console.log(q)
        // this.db.query({ statements: q, values: params }).then((res) => {
        //   console.log(">>>>>>>>> Result >>>>>>>>")
        //   console.log(res)
        //   console.log(">>>>>>>>> Result >>>>>>>>")
        //   resolve(res)
        // })
      }
      else { reject({ changes: -1, message: "Cannot run query" }); }
    });
  }
}
