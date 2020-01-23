import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, Events, ModalController, Platform} from '@ionic/angular';

import {ApiSync} from '../../providers/api-sync';
import {DownloadService} from '../../services/download-service';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {UserDb} from '../../models/db/user-db';
import {DbProvider} from '../../providers/db-provider';
import {SyncService} from '../../services/sync-service';
import {ApiService} from '../../providers/api/base/api-service';

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
    // public isStartPush = false;
    // public pushItemsCount = 0;
    // public pushedItemsCount = 0;
    // public pushedItemsPercent = 0;
    // public pushProgressStatus = 'not_push';
    // public pushProgressFilesInfo: BehaviorSubject<any>;
    public syncItemsCount = 0;
    public syncedItemsCount = 0;
    public syncedItemsPercent = 0;
    public syncProgressStatus = 'not_sync';
    public isPrepareSynData = false;
    public objectKeys = Object.keys;
    public modeSync = SyncMode.Manual;
    public userDb: UserDb;

    public isNetworkSyncMode: BehaviorSubject<boolean>;

    protected syncWithoutDate = false;

    public progressFileInformations: {};

    constructor(public apiSync: ApiSync,
                private downloadService: DownloadService,
                public modalCtrl: ModalController,
                public changeDetectorRef: ChangeDetectorRef,
                public http: HttpClient,
                public authService: AuthService,
                private platform: Platform,
                private db: DbProvider,
                private events: Events,
                private syncService: SyncService,
                public alertController: AlertController) {
      this.authService.checkAccess();
      this.initUserDB().then(() => {
          console.log('this.userDb.userSetting.syncMode', this.userDb.userSetting.syncMode);
          if ([0, 1, 2].includes(this.userDb.userSetting.syncMode)) {
              this.modeSync = this.userDb.userSetting.syncMode;
          } else {
              this.modeSync = 0;
          }
          this.syncService.syncMode.next(this.modeSync);
      });
    }

  syncData() {
    this.syncWithoutDate = false;
    this.apiSync.startSync(this.syncWithoutDate);
  }

  syncAllData() {
    this.syncWithoutDate = true;
    this.apiSync.startSync(this.syncWithoutDate);
  }

  stopSyncData() {
    this.apiSync.isStartSyncBehaviorSubject.next(false);
  }

  resumeSyncData() {
    this.apiSync.resumeSync(this.syncWithoutDate);
  }

  cancelSyncData() {
    this.apiSync.unsetSyncProgressData();
  }

  // pushData() {
  //   this.apiSync.pushOneAtTime().then(() => {})
  //     .catch((err) => console.error('ApiPush', 'Error', 'Push', err));
  // }
  //
  // stopPushData() {
  //   this.apiSync.isStartPushBehaviorSubject.next(false);
  // }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  changeSyncMode(mode) {
      this.modeSync = +mode;
      if (this.modeSync === SyncMode.Manual) {
          this.http.showToast('Now is manually mode.');
      }
      if (this.modeSync === SyncMode.NetworkConnect) {
          this.http.showToast('Now is network connection mode.');
      }
      if (this.modeSync === SyncMode.Periodic) {
          this.http.showToast('Now is periodic mode (every 15 seconds)');
      }
      this.syncService.syncMode.next(this.modeSync);
  }

  async showRefreshDataAlert() {
    if (!this.apiSync.isStartSyncBehaviorSubject.getValue()) {
      const alert = await this.alertController.create({
        // header: 'Confirm!',
        message: 'Are you sure you want to overwrite the data?',
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
    } else {
      const alert = await this.alertController.create({
        message: 'Now there is a synchronization process.'
      });

      await alert.present();
    }
  }

   protected initUserDB() {
        if (this.userDb) {
            return new Promise(resolve => {
                resolve(true);
            });
        }

        return new Promise(resolve => {
            new UserDb(this.platform, this.db, this.events, this.downloadService).getCurrent().then((userDb) => {
                if (userDb) {
                    console.log('this.userDb', this.userDb);
                    this.userDb = userDb;

                    resolve(true);
                }
            });
        });
    }

  refreshAppData() {
      return new Promise(resolve => {
        this.downloadService.removeAllAppFiles()
            .then((res) => {
              if (res) {
                this.http.showToast('All files was deleted');

                this.apiSync.resetSyncedData().then(() => {
                  this.userDb.userSetting.lastSyncedAt = null;
                  this.userDb.save().then(() => {
                    this.http.showToast('The database is cleared.');

                    resolve(true);
                  });
                });
              } else {
                this.http.showToast('Failed to remove data');
              }
            });
      }).then((res) => {
        this.http.showToast('All data was cleared');
      });
  }

  ngOnInit() {
    this.syncService.syncMode.subscribe((result) => {
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

    // this.apiSync.isStartPushBehaviorSubject.subscribe(isPush => {
    //   this.isStartPush = isPush;
    //   this.detectChanges();
    // });
    /// To work with push
    // this.apiSync.pushProgressStatus.subscribe(pushProgressStatus => {
    //   this.pushProgressStatus = pushProgressStatus;
    //   this.detectChanges();
    //
    // });
    // this.apiSync.pushedItemsPercent.subscribe(pushedItemsPercent => {
    //   this.pushedItemsPercent = pushedItemsPercent;
    //   this.detectChanges();
    // });
    // this.downloadService.pushProgressFilesInfo.subscribe(progressInformation => {
    //   console.log('progressInformation', progressInformation);
    //   this.progressFileInformations = progressInformation;
    //   this.detectChanges();
    // });
  }
}
