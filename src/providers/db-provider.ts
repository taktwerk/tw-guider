import { Injectable } from '@angular/core';
import { AppSetting } from '../services/app-setting';

declare var window: any;

@Injectable()
export class DbProvider {

  public db: any;
  constructor() { }

  /**
   * Init - init database etc. PS! Have to wait for Platform.ready
   */
  init(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof window.sqlitePlugin !== 'undefined') {
        this.db = window.sqlitePlugin.openDatabase({ name: AppSetting.DB_NAME, location: 'default' });
      } else {
        this.db = window.openDatabase(AppSetting.DB_NAME, '1.0', 'Test DB', -1);
      }
      resolve(true);
    });
  }

  removeDb(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof window.sqlitePlugin !== 'undefined') {
        this.db = window.sqlitePlugin.deleteDatabase({ name: AppSetting.DB_NAME, location: 'default' });
      } else {
        this.db = window.deleteDatabase(AppSetting.DB_NAME, '1.0', 'Test DB', -1);
      }
      resolve(true);
    });
  }

  /**
   * query - executes sql
   */
  query(q: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      params = params || [];
      this.db.transaction((tx) => {
        tx.executeSql(q, params, (tx, res) => {
          resolve(res);
        }, (tx, err) => {
          reject(err);
        });
      });
    });
  }
}
