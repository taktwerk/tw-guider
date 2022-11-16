/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { UserDb } from 'app/database/models/db/user-db';
import { ApiSync } from 'app/library/providers/api-sync';
import { AppSetting } from 'app/library/services/app-setting';
import { AuthService } from 'app/library/services/auth-service';
import { DownloadService } from 'app/library/services/download-service';
import { HttpClient } from 'app/library/services/http-client';
import { MiscService } from 'app/library/services/misc-service';
import { SyncService } from 'app/library/services/sync-service';
import { TranslateConfigService } from 'app/library/services/translate-config.service';
import { UserService } from 'app/library/services/user-service';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';

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
  public isPrepareSynData = true;
  public modeSync: any;
  public resumeMode: boolean = false;
  public userDb!: UserDb;
  public syncAllItemsCount = 0;
  public params: any;
  eventSubscription!: Subscription;

  constructor(public apiSync: ApiSync,
    private downloadService: DownloadService,
    public changeDetectorRef: ChangeDetectorRef,
    public http: HttpClient,
    public authService: AuthService,
    private platform: Platform,
    private miscService: MiscService,
    private syncService: SyncService,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    private userService: UserService,
    public appSetting: AppSetting,
  ) {
    this.initUser().then(() => {
      if (this.userService.userDb) {
        if ([0, 1, 2].includes(this.userService.userDb.userSetting.syncMode)) {
          this.modeSync = this.userService.userDb.userSetting.syncMode;
        } else {
          this.modeSync = environment.syncMode;
        }
        this.resumeMode = this.userService.userDb.userSetting.resumeMode;
        // console.log(this.resumeMode)
        this.syncProgressStatus = this.userService.userDb.userSetting.syncStatus;
      }
    });
  }

  cancelSyncData() {
    return this.apiSync.unsetSyncProgressData().then((isCanceled: any) => {
      if (isCanceled) {
        this.http.showToast('synchronization-component.Sync was canceled.');
      }
    });
  }

  detectChanges() {
    this.changeDetectorRef.detectChanges();
  }

  changeSyncMode(e: any) {
    const mode = e.detail.value;
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
      if (this.userService.userDb) {
        this.userService.userDb.userSetting.syncMode = this.modeSync;
        this.userService.userDb.save();
      }
    });
    this.syncService.syncMode.next(this.modeSync);
  }

  changeResumeMode() {
    this.resumeMode === false ? this.resumeMode = true : this.resumeMode = false;
    console.log(this.resumeMode);
    this.initUser().then(() => {
      if (this.userService.userDb) {
        this.userService.userDb.userSetting.resumeMode = this.resumeMode;
        this.userService.userDb.save().then(() => {
          this.syncService.resumeMode.next(this.resumeMode);
        });
      }

    });
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
    return this.userService.getUser().then((result: any) => {
      this.userDb = result;
    });
  }

  refreshAppData() {
    return new Promise(async resolve => {
      if (this.apiSync.isStartSyncBehaviorSubject.getValue()) {
        await this.cancelSyncData();
      }

      if (this.platform.is('capacitor')) {
        const isRemovedAllApiFiles = await this.downloadService.removeAllAppFiles();
        if (!isRemovedAllApiFiles) {
          this.http.showToast('synchronization-component.Failed to remove data');
          resolve(false);
          return;
        }
        this.http.showToast('synchronization-component.All files was deleted');
      }


      await this.apiSync.resetSyncedData();
      this.initUser().then(() => {
        if (this.userService.userDb) {
          this.userService.userDb.userSetting.lastSyncedDiff = 0;
          this.userService.userDb.userSetting.syncStatus = 'success';
          this.userService.userDb.userSetting.syncLastElementNumber = 0;
          this.userService.userDb.userSetting.syncAllItemsCount = 0;
          this.userService.userDb.userSetting.syncPercent = 0;
          this.userService.userDb.userSetting.lastSyncedAt = null;
          this.userService.userDb.userSetting.lastModelUpdatedAt = null;
          this.userService.userDb.userSetting.lastSyncProcessId = null;
          this.userService.userDb.userSetting.appDataVersion = null;
          this.apiSync.isAvailableForSyncData.next(true);
          this.userService.userDb.userSetting.isSyncAvailableData = true;
          this.apiSync.isAvailableForPushData.next(false);
          this.userService.userDb.userSetting.isPushAvailableData = false;
          this.userService.userDb.save().then(() => {
            if (this.userService.userDb) {
              this.apiSync.syncedItemsPercent.next(this.userService.userDb.userSetting.syncPercent);
              this.apiSync.syncProgressStatus.next('success');
              this.apiSync.isStartSyncBehaviorSubject.next(false);
              this.http.showToast('synchronization-component.The database is cleared.');
              this.apiSync.makeSyncProcess();

              resolve(true);
            }
          });
        }

      });
    }).then((res) => {
      this.http.showToast('synchronization-component.All data was cleared');
    });
  }

  ngOnInit() {
    this.initUser().then(() => {
      if (this.userService.userDb) {
        this.apiSync.syncedItemsCount.next(this.userService.userDb.userSetting.syncLastElementNumber);
        this.apiSync.syncAllItemsCount.next(this.userService.userDb.userSetting.syncAllItemsCount);
        this.apiSync.syncedItemsPercent.next(this.userService.userDb.userSetting.syncPercent);

        // this.resumeMode = this.userService.userDb.userSetting.resumeMode;
        // console.log("this.resumeMode", this.resumeMode)
      }
    });

    this.syncService.syncMode.subscribe((result: any) => {
      if (result === null) { return; }
      this.modeSync = result;
    });

    this.apiSync.isStartSyncBehaviorSubject.subscribe((isSync: any) => {
      this.isStartSync = isSync;
      this.detectChanges();
    });
    this.apiSync.syncProgressStatus.subscribe((syncProgressStatus: any) => {
      this.syncProgressStatus = syncProgressStatus;
      this.detectChanges();
    });
    this.apiSync.syncedItemsPercent.subscribe((syncedItemsPercent: any) => {
      this.syncedItemsPercent = syncedItemsPercent;
      this.detectChanges();
    });
    this.apiSync.isPrepareSynData.subscribe((isPrepareSynData: any) => {
      this.isPrepareSynData = isPrepareSynData;
      this.detectChanges();
    });
    this.apiSync.syncedItemsCount.subscribe((syncedItemsCount: any) => {
      this.syncedItemsCount = syncedItemsCount;
      this.detectChanges();
    });
    this.apiSync.syncAllItemsCount.subscribe((syncAllItemsCount: any) => {
      this.syncAllItemsCount = syncAllItemsCount;
      this.detectChanges();
    });
    // this.events.subscribe('UserDb:update', (userDb) => {
    //   this.userService.userDb = userDb;
    // });
    this.apiSync.isStartPushBehaviorSubject.subscribe((isPush: any) => {
      this.isStartPush = isPush;
      this.detectChanges();
    });
    // this.events.subscribe(this.appSetting.appSetting.TAG + ':update', (model) => {
    //   if (model.settings.isEnabledUsb && this.modeSync === SyncMode.NetworkConnect) {
    //     this.changeSyncMode(SyncMode.Manual);
    //   }
    // });

    this.eventSubscription = this.miscService.events.subscribe(async (event: any) => {
      switch (event.TAG) {
        case 'UserDb:update':
          this.userService.userDb = event.data;
          break;
        case this.appSetting.appSetting.TAG + ':update':
          if (event.data.settings.isEnabledUsb && this.modeSync === SyncMode.NetworkConnect) {
            this.changeSyncMode(SyncMode.Manual);
          }
          break;
        default:
      }
    });
  }
}
