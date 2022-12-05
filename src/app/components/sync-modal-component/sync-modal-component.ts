import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavCtrlService } from 'src/controller/core/ui/nav-ctrl.service';
import { SyncService } from 'src/controller/services/sync.service';
import { TranslateConfigService } from 'src/controller/services/translate-config.service';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { StateService } from 'src/controller/state/state.service';
import { SyncMode } from 'src/controller/state/interface';
import { AppSettingService } from 'src/controller/services/app-setting.service';
import { UserSettingService } from 'src/controller/services/user-setting.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'sync-modal-component',
  templateUrl: 'sync-modal-component.html',
  styleUrls: ['sync-modal-component.scss'],
  providers:[DatePipe]
})
export class SyncModalComponent implements OnInit {

  isStartSync = false;
  noDataForSync = false;

  syncedItemsCount = 0;
  syncedItemsPercent = 0;
  syncAllItemsCount = 0;

  pulledItemsCount = 0;
  pulledItemsPercent = 0;
  pullAllItemsCount = 0;

  pushedItemsCount = 0;
  pushedItemsPercent = 0;
  pushAllItemsCount = 0;

  modeSync = SyncMode.Manual;
  pushProgressStatus!: string;

  constructor(
    private platform: Platform,
    private datepipe: DatePipe,
    private userSettingService: UserSettingService,
    private navCtrl: NavCtrlService,
    private insomnia: Insomnia,
    private translateConfigService: TranslateConfigService,
    public syncService: SyncService,
    public stateService: StateService,
    public appSettingService: AppSettingService,
  ) {

  }

  ngOnInit() {

    if (this.platform.is('capacitor')) {
      this.insomnia.keepAwake().then(
        () => console.log('insomnia.keepAwake success'),
        () => console.log('insomnia.keepAwake error')
      );
    }

    // this.syncService.syncMode.subscribe((result) => {
    //   if (![SyncMode.Manual, SyncMode.Periodic, SyncMode.NetworkConnect].includes(result)) {
    //     return;
    //   }
    //   this.modeSync = result;
    // });
    // this.apiSync.isStartSyncBehaviorSubject.subscribe((isSync) => {
    //   this.isStartSync = isSync;
    // });
    // this.apiSync.syncProgressStatus.subscribe((syncProgressStatus) => {
    //   this.syncProgressStatus = syncProgressStatus;
    // });
    // this.apiSync.isPrepareSynData.subscribe((isPrepareSynData) => {
    //   this.isPrepareSynData = isPrepareSynData;
    // });
    // this.apiSync.syncedItemsCount.subscribe((syncedItemsCount) => {
    //   this.syncedItemsCount = syncedItemsCount ? syncedItemsCount : 0;
    // });
    // this.apiSync.syncAllItemsCount.subscribe((syncAllItemsCount) => {
    //   this.syncAllItemsCount = syncAllItemsCount ? syncAllItemsCount : 0;
    // });
    // this.apiSync.syncedItemsPercent.subscribe((syncedItemsPercent) => {
    //   this.syncedItemsPercent = syncedItemsPercent ? syncedItemsPercent : 0;
    // });
    // this.apiSync.noDataForSync.pipe(take(1)).subscribe((noDataForSync) => {
    //   this.noDataForSync = noDataForSync;
    //   if (noDataForSync) {
    //     setTimeout(() => {
    //       this.noDataForSync = false;
    //     }, 3000);
    //   }
    // });
    // this.apiSync.isAvailableForSyncData.subscribe((isAvailableForSyncData) => {
    //   this.isAvailableForSyncData = isAvailableForSyncData;
    // });
    // this.apiSync.isAvailableForPushData.subscribe((isAvailableForPushData) => {
    //   this.isAvailableForPushData = isAvailableForPushData;
    // });
    // this.apiSync.pushProgressStatus.pipe(take(1)).subscribe((pushProgressStatus) => {
    //   this.pushProgressStatus = pushProgressStatus;
    // });


    // this.eventSubscription = this.miscService.events.subscribe(async (event) => {
    //   switch (event.TAG) {
    //     case 'UserDb:update':
    //       this.userService.userDb = event.data;
    //       this.loggerService.getLogger().info('userDb', event.data);
    //       break;
    //     case 'network:offline':
    //       this.isNetwork = false;
    //       this.loggerService.getLogger().info('isNetwork', this.isNetwork);
    //       break;
    //     case 'network:online':
    //       this.isNetwork = true;
    //       this.loggerService.getLogger().info('isNetwork', this.isNetwork);
    //       break;
    //     case 'user:logout':
    //       this.loggerService.getLogger().info('user:logout');
    //       this.dismiss();
    //       break;
    //     default:
    //   }
    // });
  }

  dismiss() {
    this.navCtrl.closePopup();
  }

  getLastSyncDate() {
    if (this.userSettingService.lastSyncedAt) {
      return this.datepipe.transform(this.userSettingService.lastSyncedAt, 'yyyy-MM-dd HH:mm:ss');
    }
    return '-';
  }

  getProgressText() {
    switch (this.syncService.syncStatus) {
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

  syncData() {
    throw new Error('Method not implemented.');
  }

  resumeSyncData() {
    throw new Error('Method not implemented.');
  }

  stopSyncData() {
    throw new Error('Method not implemented.');
  }

  cancelSyncData() {
    throw new Error('Method not implemented.');
  }

  // syncData() {
  //   this.apiSync.makeSyncProcess();
  //   this.router.navigate(['/guide-categories']);
  //   // if (!this.appSetting.isMigratedDatabase()) {
  //   //   this.appSetting.showIsNotMigratedDbPopup();
  //   //   return;
  //   // }
  //   // // make sync if local changes
  //   // if (this.isAvailableForPushData) {
  //   //   this.apiSync.makeSyncProcess();
  //   // }
  //   // // force sync when data changes on server
  //   // this.apiSync.checkAvailableChanges().then((res) => {
  //   //   // make sync if changes from server
  //   //   if (res) {
  //   //     this.apiSync.makeSyncProcess();
  //   //   }
  //   // });
  // }

  // stopSyncData() {
  //   this.apiSync.makeSyncPause();
  // }

  // resumeSyncData() {
  //   this.apiSync.makeSyncProcess('resume');
  // }

  // cancelSyncData() {
  //   this.apiSync.sendSyncProgress('', true);
  //   return this.apiSync.unsetSyncProgressData().then((isCanceled) => {
  //     if (isCanceled) {
  //       this.http.showToast('synchronization-component.Sync was canceled.');
  //     }
  //   });
  // }

}
