import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteResult, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { DataSource } from 'typeorm';
import { AppSetting } from '../models/app-setting';
import { Auth } from '../models/auth';
import { Feedback } from '../models/feedback';
import { Guide } from '../models/guide';
import { GuideAsset } from '../models/guide_asset';
import { GuideAssetPivot } from '../models/guide_asset_pivot';
import { GuideCategory } from '../models/guide_category';
import { GuideCategoryBinding } from '../models/guide_category_binding';
import { GuideChild } from '../models/guide_child';
import { GuidStep } from '../models/guide_step';
import { GuidViewHistory } from '../models/guide_view_history';
import { Migration } from '../models/migration';
import { Protocol } from '../models/protocol';
import { ProtocolComments } from '../models/protocol_comment';
import { ProtocolDefault } from '../models/protocol_default';
import { ProtocolTemplate } from '../models/protocol_template';
import { Sequence } from '../models/sequence';
import { SyncIndex } from '../models/sync_index';
import { UserSetting } from '../models/user-setting';
import { Workflow } from '../models/workflow';
import { WorkflowStep } from '../models/workflow_step';
import { WorkflowTransition } from '../models/workflow_transition';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  pSqliteConsistent: any;
  sqlite!: SQLiteConnection;

  async init() {

    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    // const sqliteConnection = new SQLiteConnection(CapacitorSQLiteWeb);

    // copy preloaded dbs (optional, not TypeORM related):
    // the preloaded dbs must have the `YOUR_DB_NAME.db` format (i.e. including
    // the `.db` suffix, NOT including the internal `SQLITE` suffix from the plugin)
    await this.sqlite.initWebStore();
    // await sqliteConnection.copyFromAssets();

    // // create the TypeORM connection
    // // For more information see https://typeorm.io/data-source#creating-a-new-datasource
    const AppDataSource = new DataSource({
      type: 'capacitor',
      driver: this.sqlite, // pass the connection wrapper here
      database: 'guider', // database name without the `.db` suffix
      entities: [
        AppSetting, Auth, Feedback,
        Guide, GuideAsset, GuideAssetPivot,
        GuideCategory, GuideCategoryBinding,
        GuideChild, GuidStep, GuidViewHistory,
        Migration,
        Protocol, ProtocolComments, ProtocolDefault, ProtocolTemplate,
        Sequence, SyncIndex, UserSetting,
        Workflow, WorkflowStep, WorkflowTransition
      ],
      migrations: [],
      logging: true,
      synchronize: true,
      migrationsRun: false,
      journalMode: 'MEMORY',
      mode: "no-encryption"
    });

    await AppDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!");

        window.sqlite = this.sqlite;
        window.sqlite.saveToStore('guider');
      })
      .catch((err: any) => {
        console.error("Error during Data Source initialization", err)
      });

    return AppDataSource;
  }

  watch() {
    // when using Capacitor, you might want to close existing connections,
    // otherwise new connections will fail when using dev-live-reload
    // see https://github.com/capacitor-community/sqlite/issues/106
    this.pSqliteConsistent = CapacitorSQLite.checkConnectionsConsistency({
      dbNames: [], // i.e. "i expect no connections to be open"
    }).catch((e) => {
      // the plugin throws an error when closing connections. we can ignore
      // that since it is expected behaviour
      console.log(e);
      return {};
    });
  }

  /**
  * Save a database to store
  * @param database
  */
  async saveToStore(database: string): Promise<void> {
    if (Capacitor.getPlatform() != 'web') {
      return Promise.reject(new Error(`not implemented for this platform: ${Capacitor.getPlatform()}`));
    }
    if (this.sqlite != null) {
      try {
        await this.sqlite.saveToStore(database);
        return Promise.resolve();
      } catch (err: any) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }

  /**
   * Import from a Json Object
   * @param jsonstring
   */
   async importFromJson(jsonstring: string): Promise<capSQLiteChanges> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.importFromJson(jsonstring));
      } catch (err: any) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }

  }

  /**
   * Is Json Object Valid
   * @param jsonstring Check the validity of a given Json Object
   */

  async isJsonValid(jsonstring: string): Promise<capSQLiteResult> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.isJsonValid(jsonstring));
      } catch (err: any) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }

  }

}
