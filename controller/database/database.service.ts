import { Injectable } from '@angular/core';
import '@capacitor-community/sqlite';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { CapacitorSQLite, JsonSQLite } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { StoreService } from './store.service';


const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME_KEY = 'db_name';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  dbReady = new BehaviorSubject(false);
  dbName = '';

  constructor(private http: HttpClient, private alertCtrl: AlertController) { }

  async init(): Promise<void> {
    const info = await Device.getInfo();

    if (info.platform === 'android') {
      try {
        const sqlite = CapacitorSQLite as any;
        await sqlite.requestPermissions();
        this.setupDatabase();
      } catch (e) {
        const alert = await this.alertCtrl.create({
          header: 'No DB access',
          message: "This app can't work without Database access.",
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      this.setupDatabase();
    }
  }

  private async setupDatabase() {
    const dbSetupDone = await StoreService.get(DB_SETUP_KEY);

    if (!dbSetupDone.value) {
      this.downloadDatabase();
    } else {
      this.dbName = await StoreService.get(DB_NAME_KEY);
      await CapacitorSQLite.open({ database: this.dbName });
      this.dbReady.next(true);
    }
  }

  // Potentially build this out to an update logic:
  // Sync your data on every app start and update the device DB
  private downloadDatabase(update = false) {
    this.http.get('https://devdactic.fra1.digitaloceanspaces.com/tutorial/db.json').subscribe(async (jsonExport: JsonSQLite) => {
      const jsonstring = JSON.stringify(jsonExport);
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

      if (isValid.result) {
        this.dbName = jsonExport.database;
        await StoreService.set(DB_NAME_KEY,  this.dbName);
        await CapacitorSQLite.importFromJson({ jsonstring });
        await StoreService.set(DB_SETUP_KEY, 1);

        // Your potential logic to detect offline changes later
        if (!update) {
          await CapacitorSQLite.createSyncTable({});
        } else {
          await CapacitorSQLite.setSyncDate({ syncdate: '' + new Date().getTime() })
        }
        this.dbReady.next(true);
      }
    });
  }
}
