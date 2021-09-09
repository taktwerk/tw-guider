import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { UserDb } from '../../models/db/user-db';
import { ApiSync } from '../../providers/api-sync';
import { DownloadService } from '../../services/download-service';
import { HttpClient } from '../../services/http-client';
import { AuthService } from '../../services/auth-service';
import { DbProvider } from '../../providers/db-provider';
import { SyncService } from '../../services/sync-service';
import { Network } from '@ionic-native/network/ngx';
import { debounceTime, take } from 'rxjs/operators';
import { DatePipe } from '../../pipes/date-pipe/date-pipe';
import { UserService } from '../../services/user-service';
import { SyncMode } from '../synchronization-component/synchronization-component';
import { AppSetting } from '../../services/app-setting';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { TranslateConfigService } from '../../services/translate-config.service';
import { LoggerService } from '../../services/logger-service';
import { Subscription } from 'rxjs';
import { MiscService } from '../../services/misc-service';
import { Storage } from '@ionic/storage';

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
  public isAvailableForSyncData: boolean = false;
  public pushProgressStatus: string;
  public isAvailableForPushData: boolean;
  public params;
  eventSubscription: Subscription;

  constructor(
    private storage: Storage,
    private modalController: ModalController,
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
    public platform: Platform

  ) {

    this.isNetwork = this.network.type !== 'none';
    this.initUser().then(() => {
      this.syncProgressStatus = this.userService.userDb.userSetting.syncStatus;
    });
  }

  ionViewDidEnter() {
    this.storage.set('SyncModalComponentOpen', true)
  }

  dismiss() {
    this.modalController.dismiss().then(() => {
      this.insomnia.allowSleepAgain().then(
        () => console.log('insomnia.allowSleepAgain success'),
        () => console.log('insomnia.allowSleepAgain error')
      );
    });

    this.storage.set('SyncModalComponentOpen', false)
  }

  syncData() {
    if (!this.appSetting.isMigratedDatabase()) {
      this.appSetting.showIsNotMigratedDbPopup();
      return;
    }
    // make sync if local changes
    if (this.isAvailableForPushData) {
      this.apiSync.makeSyncProcess();
    }
    // force sync when data changes on server
    this.apiSync.checkAvailableChanges().then((res) => {
      // make sync if changes from server
      if (res) {
        this.apiSync.makeSyncProcess()
      }
    })
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

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
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
    this.insomnia.keepAwake().then(
      () => console.log('insomnia.keepAwake success'),
      () => console.log('insomnia.keepAwake error')
    );
    this.syncService.syncMode.subscribe((result) => {
      if (![SyncMode.Manual, SyncMode.Periodic, SyncMode.NetworkConnect].includes(result)) {
        return;
      }
      this.modeSync = result;
      this.detectChanges();
    });
    this.apiSync.isStartSyncBehaviorSubject.subscribe((isSync) => {
      this.isStartSync = isSync;
      this.detectChanges();
    });
    this.apiSync.syncProgressStatus.subscribe((syncProgressStatus) => {
      this.syncProgressStatus = syncProgressStatus;
      this.detectChanges();
    });
    this.apiSync.isPrepareSynData.subscribe((isPrepareSynData) => {
      this.isPrepareSynData = isPrepareSynData;
      this.detectChanges();
    });
    this.apiSync.syncedItemsCount.subscribe((syncedItemsCount) => {
      this.syncedItemsCount = syncedItemsCount ? syncedItemsCount : 0;
      this.detectChanges();
    });
    this.apiSync.syncAllItemsCount.subscribe((syncAllItemsCount) => {
      this.syncAllItemsCount = syncAllItemsCount ? syncAllItemsCount : 0;
      this.detectChanges();
    });
    this.apiSync.syncedItemsPercent.subscribe((syncedItemsPercent) => {
      this.syncedItemsPercent = syncedItemsPercent ? syncedItemsPercent : 0;
      this.detectChanges();
    });
    this.apiSync.noDataForSync.pipe(take(1)).subscribe((noDataForSync) => {
      this.noDataForSync = noDataForSync;
      if (noDataForSync) {
        setTimeout(() => {
          this.noDataForSync = false;
        }, 3000);
      }
      this.detectChanges();
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
    // this.events.subscribe('UserDb:update', (userDb) => {
    //   this.userService.userDb = userDb;
    //   this.loggerService.getLogger().info("userDb", userDb)

    // });
    // this.events.subscribe('network:offline', (isNetwork) => {
    //   this.isNetwork = false;
    //   this.loggerService.getLogger().info("isNetwork", this.isNetwork)

    //   this.detectChanges();
    // });
    // this.events.subscribe('network:online', (isNetwork) => {
    //   this.isNetwork = true;
    //   this.loggerService.getLogger().info("isNetwork", this.isNetwork)

    //   this.detectChanges();
    // });
    // this.events.subscribe('user:logout', () => {
    //   this.loggerService.getLogger().info("user:logout")
    //   this.dismiss();
    // });


    this.eventSubscription = this.miscService.events.subscribe(async (event) => {
      switch (event.TAG) {
        case 'UserDb:update':
          this.userService.userDb = event.data;
          this.loggerService.getLogger().info("userDb", event.data)
          break;
        case 'network:offline':
          this.isNetwork = false;
          this.loggerService.getLogger().info("isNetwork", this.isNetwork)
          break;
        case 'network:online':
          this.isNetwork = true;
          this.loggerService.getLogger().info("isNetwork", this.isNetwork)
          break;
        case 'user:logout':
          this.loggerService.getLogger().info("user:logout")
          this.dismiss();
          break;
        default:
      }
    });
  }

  getProgressText() {
    switch (this.syncProgressStatus) {
      case 'pause':
        //    this.loggerService.getLogger().info("Sync", 'pause')
        return '(' + this.translateConfigService.translateWord('sync-modal.Paused') + ')';
      case 'failed':
        //    this.loggerService.getLogger().debug("Sync", 'failed', new Error().stack)
        return '(' + this.translateConfigService.translateWord('sync-modal.Failed') + ')';
      case 'success':
        //    this.loggerService.getLogger().info("Sync", 'success')
        return '(' + this.translateConfigService.translateWord('sync-modal.Success') + ')';
      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
