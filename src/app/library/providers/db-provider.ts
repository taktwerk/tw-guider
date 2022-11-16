import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

declare let window: any;

@Injectable()
export class DbProvider {

  public db: any;
  constructor() { }

  init(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof window.sqlitePlugin !== 'undefined') {
        this.db = window.sqlitePlugin.openDatabase({ name: environment.dbName, location: 'default' });
      } else {
        this.db = window.openDatabase(environment.dbName, '1.0', 'Test DB', -1);
      }
      resolve(true);
    });
  }

  removeDb(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof window.sqlitePlugin !== 'undefined') {
        this.db = window.sqlitePlugin.deleteDatabase({ name:  environment.dbName, location: 'default' });
      } else {
        this.db = window.deleteDatabase( environment.dbName, '1.0', 'Test DB', -1);
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
      this.db.transaction((tx: any) => {
        tx.executeSql(q, params, (_tx: any, res: any) => {
          resolve(res);
        }, (_tx: any, err: any) => {
          console.log('query execution error', err, q);
          reject(err);
        });
      });
    });
  }
}
