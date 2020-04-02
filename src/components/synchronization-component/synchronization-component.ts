import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, Events, Platform} from '@ionic/angular';

import {ApiSync} from '../../providers/api-sync';
import {DownloadService} from '../../services/download-service';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {UserDb} from '../../models/db/user-db';
import {DbProvider} from '../../providers/db-provider';
import {SyncService} from '../../services/sync-service';
import {DatePipe} from '@angular/common';
import {TranslateConfigService} from '../../services/translate-config.service';
import {UserService} from '../../services/user-service';
import {AppSetting} from '../../services/app-setting';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export enum SyncMode {
  Manual,
  NetworkConnect,
  Periodic
}

@Component({
  selector: 'synchronization-component',
  templateUrl: 'synchronization-component.html',
})
export class SynchronizationComponent implements OnInit {

    public isStartSync = false;
    public isStartPush = false;
    public syncedItemsCount = 0;
    public syncedItemsPercent = 0;
    public syncProgressStatus = 'not_sync';
    public isPrepareSynData = false;
    public modeSync;
    public userDb: UserDb;
    public syncAllItemsCount = 0;

    constructor(public apiSync: ApiSync,
                private downloadService: DownloadService,
                public changeDetectorRef: ChangeDetectorRef,
                public http: HttpClient,
                public authService: AuthService,
                private platform: Platform,
                private db: DbProvider,
                private events: Events,
                private syncService: SyncService,
                public alertController: AlertController,
                public datepipe: DatePipe,
                private translateConfigService: TranslateConfigService,
                private userService: UserService,
                private appSetting: AppSetting) {
      this.initUser().then(() => {
          if ([0, 1, 2].includes(this.userDb.userSetting.syncMode)) {
              this.modeSync = this.userDb.userSetting.syncMode;
          } else {
              this.modeSync = SyncMode.Manual;
          }
          this.syncProgressStatus = this.userDb.userSetting.syncStatus;
      });
    }

  cancelSyncData() {
    return this.apiSync.unsetSyncProgressData().then((isCanceled) => {
        if (isCanceled) {
            this.http.showToast('synchronization-component.Sync was canceled.');
        }
    });
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  changeSyncMode(mode) {
      if (this.modeSync === +mode) {
          return;
      }
      this.modeSync = +mode;
      if (this.modeSync === SyncMode.Manual) {
          this.http.showToast('synchronization-component.Now is manually mode.');
      }
      if (this.modeSync === SyncMode.NetworkConnect) {
          this.http.showToast('synchronization-component.Now is network connection mode.');
      }
      if (this.modeSync === SyncMode.Periodic) {
          this.http.showToast('synchronization-component.Now is periodic mode (every 15 seconds)');
      }
      this.initUser().then(() => {
          this.userDb.userSetting.syncMode = this.modeSync;
          this.userDb.save();
      });
      this.syncService.syncMode.next(this.modeSync);
  }

  async showRefreshDataAlert() {
      if (!this.appSetting.isMigratedDatabase()) {
          await this.appSetting.showIsNotMigratedDbPopup();

          return;
      }
      const alert = await this.alertController.create({
          message: this.translateConfigService.translateWord('synchronization-component.Are you sure you want to overwrite the data?'),
          buttons: [
              {
                  text: 'Yes',
                  cssClass: 'primary',
                  handler: (blah) => this.refreshAppData()
              }, {
                  text: 'No'
              }
          ]
      });
      await alert.present();
  }

   protected initUser() {
       return this.userService.getUser().then(result => {
           this.userDb = result;
       });
    }

  refreshAppData() {
      return new Promise(async resolve => {
        if (this.apiSync.isStartSyncBehaviorSubject.getValue()) {
            await this.cancelSyncData();
        }
        const isRemovedAllApiFiles = await this.downloadService.removeAllAppFiles();
        if (!isRemovedAllApiFiles) {
            this.http.showToast('synchronization-component.Failed to remove data');
            resolve(false);
            return;
        }
        this.http.showToast('synchronization-component.All files was deleted');

        await this.apiSync.resetSyncedData();
        this.initUser().then(() => {
          this.userDb.userSetting.lastSyncedDiff = 0;
          this.userDb.userSetting.syncStatus = 'success';
          this.userDb.userSetting.syncLastElementNumber = 0;
          this.userDb.userSetting.syncAllItemsCount = 0;
          this.userDb.userSetting.syncPercent = 0;
          this.userDb.userSetting.lastSyncedAt = null;
          this.userDb.userSetting.lastSyncProcessId = null;
          this.userDb.userSetting.appDataVersion = null;
          this.userDb.save().then(() => {
              this.apiSync.syncedItemsPercent.next(this.userDb.userSetting.syncPercent);
              this.apiSync.syncProgressStatus.next('success');
              this.apiSync.isStartSyncBehaviorSubject.next(false);
              this.http.showToast('synchronization-component.The database is cleared.');
              this.apiSync.makeSyncProcess();

              resolve(true);
          });
        });
      }).then((res) => {
        this.http.showToast('synchronization-component.All data was cleared');
      });
  }

  ngOnInit() {
    this.initUser().then(() => {
        this.apiSync.syncedItemsCount.next(this.userDb.userSetting.syncLastElementNumber);
        this.apiSync.syncAllItemsCount.next(this.userDb.userSetting.syncAllItemsCount);
        this.apiSync.syncedItemsPercent.next(this.userDb.userSetting.syncPercent);
    });
    this.syncService.syncMode.subscribe((result) => {
      if (result === null) {
          return;
      }
      this.modeSync = result;
    });
    this.apiSync.isStartSyncBehaviorSubject.subscribe(isSync => {
      this.isStartSync = isSync;
      this.detectChanges();
    });
    this.apiSync.syncProgressStatus.subscribe(syncProgressStatus => {
      this.syncProgressStatus = syncProgressStatus;
      this.detectChanges();
    });
    this.apiSync.syncedItemsPercent.subscribe(syncedItemsPercent => {
      this.syncedItemsPercent = syncedItemsPercent;
      this.detectChanges();
    });
    this.apiSync.isPrepareSynData.subscribe(isPrepareSynData => {
      this.isPrepareSynData = isPrepareSynData;
      this.detectChanges();
    });
    this.apiSync.syncedItemsCount.subscribe(syncedItemsCount => {
        this.syncedItemsCount = syncedItemsCount;
        this.detectChanges();
    });
    this.apiSync.syncAllItemsCount.subscribe(syncAllItemsCount => {
        this.syncAllItemsCount = syncAllItemsCount;
        this.detectChanges();
    });
    this.events.subscribe('UserDb:update', (userDb) => {
        this.userDb = userDb;
    });
    this.apiSync.isStartPushBehaviorSubject.subscribe(isPush => {
      this.isStartPush = isPush;
      this.detectChanges();
    });
  }
}
