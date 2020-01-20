import {ChangeDetectorRef, Component} from '@angular/core';
import {Events, ModalController, Platform} from '@ionic/angular';

import {ApiSync} from '../../providers/api-sync';
import {DownloadService} from '../../services/download-service';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {UserDb} from '../../models/db/user-db';
import {DbProvider} from '../../providers/db-provider';
import {SyncService} from '../../services/sync-service';

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
export class SynchronizationComponent {

    public isStartSync = false;
    public isStartPush = false;
    public pushItemsCount = 0;
    public pushedItemsCount = 0;
    public pushedItemsPercent = 0;
    public pushProgressStatus = 'not_push';
    public syncItemsCount = 0;
    public syncedItemsCount = 0;
    public syncedItemsPercent = 0;
    public syncProgressStatus = 'not_sync';
    public isPrepareSynData = false;
    public pushProgressFilesInfo: BehaviorSubject<any>;
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
                private syncService: SyncService) {
      this.authService.checkAccess();
      this.init();
      this.downloadService.pushProgressFilesInfo = new BehaviorSubject<any>({});
    }

  private init(): Promise<any> {
    if (this.userDb) {
      return new Promise(resolve => {
        resolve(true);
      });
    }

    return new Promise(resolve => {
      new UserDb(this.platform, this.db, this.events, this.downloadService).getCurrent().then((userDb) => {
        if (userDb) {
          this.userDb = userDb;
          this.modeSync = this.userDb.userSetting.syncMode;
        }
      });
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

  pushData() {
    this.apiSync.pushOneAtTime().then(() => {})
      .catch((err) => console.error('ApiPush', 'Error', 'Push', err));
  }

  stopPushData() {
    this.apiSync.isStartPushBehaviorSubject.next(false);
  }

  ngOnInit() {
    this.apiSync.isStartSyncBehaviorSubject.subscribe(isSync => {
      this.isStartSync = isSync;
      this.detectChanges();
    });
    this.apiSync.isStartPushBehaviorSubject.subscribe(isPush => {
      this.isStartPush = isPush;
      console.log('isPush isPush', isPush);
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
    this.apiSync.pushProgressStatus.subscribe(pushProgressStatus => {
      this.pushProgressStatus = pushProgressStatus;
      this.detectChanges();

    });
    this.apiSync.pushedItemsPercent.subscribe(pushedItemsPercent => {
      this.pushedItemsPercent = pushedItemsPercent;
      this.detectChanges();
    });
    this.apiSync.isPrepareSynData.subscribe(isPrepareSynData => {
      this.isPrepareSynData = isPrepareSynData;
      this.detectChanges();
    });
    this.downloadService.pushProgressFilesInfo.subscribe(progressInformation => {
      console.log('progressInformation', progressInformation);
      this.progressFileInformations = progressInformation;
      this.detectChanges();
    });
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }


  changeSyncMode(mode) {
      this.modeSync = +mode;
      this.userDb.userSetting.syncMode = this.modeSync;
      this.userDb.save().then(() => {
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
      });
  }
}
