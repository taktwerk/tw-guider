/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @angular-eslint/component-selector */

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { DatePipe } from '@angular/common';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { SyncMode } from '../synchronization-component/synchronization-component';
import { take } from 'rxjs/operators';
import { AppSetting } from 'local-server/models/app-setting';
import { UserDb } from 'src/app/database/models/db/user-db';
import { ApiSync } from 'src/app/library/providers/api-sync';
import { AuthService } from 'src/app/library/services/auth-service';
import { LoggerService } from 'src/app/library/services/logger-service';
import { MiscService } from 'src/app/library/services/misc-service';
import { SyncService } from 'src/app/library/services/sync-service';
import { TranslateConfigService } from 'src/app/library/services/translate-config.service';
import { UserService } from 'src/app/library/services/user-service';
import { HttpClient } from 'src/app/library/services/http-client';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'sync-modal-component',
  templateUrl: 'sync-modal-component.html',
  styleUrls: ['sync-modal-component.scss'],
  providers: [DatePipe]
})
export class SyncModalComponent implements OnInit, OnDestroy {
  public isStartSync = false;
  public noDataForSync = false;
  public syncedItemsCount = 0;
  public syncedItemsPercent = 0;
  public syncAllItemsCount = 0;
  public pulledItemsCount = 0;
  public pulledItemsPercent = 0;
  public pullAllItemsCount = 0;
  public pushedItemsCount = 0;
  public pushedItemsPercent = 0;
  public pushAllItemsCount = 0;
  public syncProgressStatus = 'not_sync';
  public isPrepareSynData = false;
  public modeSync = SyncMode.Manual;
  public userDb: UserDb;
  public isNetwork = false;
  public isAvailableForSyncData = false;
  public pushProgressStatus: string;
  public isAvailableForPushData: boolean;
  public params;
  eventSubscription: Subscription;

  constructor(
    private storage: Storage,
    public apiSync: ApiSync,
    public changeDetectorRef: ChangeDetectorRef,
    public http: HttpClient,
    public authService: AuthService,
    private translateConfigService: TranslateConfigService,
    private syncService: SyncService,
    public network: Network,
    public datepipe: DatePipe,
    private userService: UserService,
    public appSetting: AppSetting,
    private insomnia: Insomnia,
    private loggerService: LoggerService,
    private miscService: MiscService,
    public platform: Platform,
    private router: Router

  ) {

    this.isNetwork = this.network.type !== 'none';
    this.initUser().then(() => {
      this.syncProgressStatus = this.userService.userDb.userSetting.syncStatus;
    });
  }

  ionViewDidEnter() {
    this.storage.set('SyncModalComponentOpen', true);
  }

  dismiss() {
    this.router.navigate(['/guide-categories']);
    this.storage.set('SyncModalComponentOpen', false);
  }

  syncData() {
    this.apiSync.makeSyncProcess();
    this.router.navigate(['/guide-categories']);
    // if (!this.appSetting.isMigratedDatabase()) {
    //   this.appSetting.showIsNotMigratedDbPopup();
    //   return;
    // }
    // // make sync if local changes
    // if (this.isAvailableForPushData) {
    //   this.apiSync.makeSyncProcess();
    // }
    // // force sync when data changes on server
    // this.apiSync.checkAvailableChanges().then((res) => {
    //   // make sync if changes from server
    //   if (res) {
    //     this.apiSync.makeSyncProcess();
    //   }
    // });
  }

  stopSyncData() {
    this.apiSync.makeSyncPause();
  }

  resumeSyncData() {
    this.apiSync.makeSyncProcess('resume');
  }

  cancelSyncData() {
    this.apiSync.sendSyncProgress('', true);
    return this.apiSync.unsetSyncProgressData().then((isCanceled) => {
      if (isCanceled) {
        this.http.showToast('synchronization-component.Sync was canceled.');
      }
    });
  }

  protected initUser() {
    return this.userService.getUser().then((result) => {
      this.userDb = result;
    });
  }

  getLastSyncDate() {
    if (this.userService.userDb && this.userService.userDb.userSetting && this.userService.userDb.userSetting.lastSyncedAt) {
      const date = this.userService.userDb.userSetting.lastSyncedAt;
      return this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
    }

    return '-';
  }

  ngOnInit() {
    if (this.platform.is('capacitor')) {
      this.insomnia.keepAwake().then(
        () => console.log('insomnia.keepAwake success'),
        () => console.log('insomnia.keepAwake error')
      );
    }
    this.syncService.syncMode.subscribe((result) => {
      if (![SyncMode.Manual, SyncMode.Periodic, SyncMode.NetworkConnect].includes(result)) {
        return;
      }
      this.modeSync = result;
    });
    this.apiSync.isStartSyncBehaviorSubject.subscribe((isSync) => {
      this.isStartSync = isSync;
    });
    this.apiSync.syncProgressStatus.subscribe((syncProgressStatus) => {
      this.syncProgressStatus = syncProgressStatus;
    });
    this.apiSync.isPrepareSynData.subscribe((isPrepareSynData) => {
      this.isPrepareSynData = isPrepareSynData;
    });
    this.apiSync.syncedItemsCount.subscribe((syncedItemsCount) => {
      this.syncedItemsCount = syncedItemsCount ? syncedItemsCount : 0;
    });
    this.apiSync.syncAllItemsCount.subscribe((syncAllItemsCount) => {
      this.syncAllItemsCount = syncAllItemsCount ? syncAllItemsCount : 0;
    });
    this.apiSync.syncedItemsPercent.subscribe((syncedItemsPercent) => {
      this.syncedItemsPercent = syncedItemsPercent ? syncedItemsPercent : 0;
    });
    this.apiSync.noDataForSync.pipe(take(1)).subscribe((noDataForSync) => {
      this.noDataForSync = noDataForSync;
      if (noDataForSync) {
        setTimeout(() => {
          this.noDataForSync = false;
        }, 3000);
      }
    });
    this.apiSync.isAvailableForSyncData.subscribe((isAvailableForSyncData) => {
      this.isAvailableForSyncData = isAvailableForSyncData;
    });
    this.apiSync.isAvailableForPushData.subscribe((isAvailableForPushData) => {
      this.isAvailableForPushData = isAvailableForPushData;
    });
    this.apiSync.pushProgressStatus.pipe(take(1)).subscribe((pushProgressStatus) => {
      this.pushProgressStatus = pushProgressStatus;
    });


    this.eventSubscription = this.miscService.events.subscribe(async (event) => {
      switch (event.TAG) {
        case 'UserDb:update':
          this.userService.userDb = event.data;
          this.loggerService.getLogger().info('userDb', event.data);
          break;
        case 'network:offline':
          this.isNetwork = false;
          this.loggerService.getLogger().info('isNetwork', this.isNetwork);
          break;
        case 'network:online':
          this.isNetwork = true;
          this.loggerService.getLogger().info('isNetwork', this.isNetwork);
          break;
        case 'user:logout':
          this.loggerService.getLogger().info('user:logout');
          this.dismiss();
          break;
        default:
      }
    });
  }

  getProgressText() {
    switch (this.syncProgressStatus) {
      case 'pause':
        return '(' + this.translateConfigService.translateWord('sync-modal.Paused') + ')';
      case 'failed':
        return '(' + this.translateConfigService.translateWord('sync-modal.Failed') + ')';
      case 'success':
        return '(' + this.translateConfigService.translateWord('sync-modal.Success') + ')';
      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
