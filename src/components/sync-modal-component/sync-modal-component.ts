import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Events, ModalController, Platform} from '@ionic/angular';
import {UserDb} from '../../models/db/user-db';
import {ApiSync} from '../../providers/api-sync';
import {ApiPush} from '../../providers/api-push';
import {DownloadService} from '../../services/download-service';
import {HttpClient} from '../../services/http-client';
import {AuthService} from '../../services/auth-service';
import {DbProvider} from '../../providers/db-provider';
import {SyncService} from '../../services/sync-service';
import {DatePipe} from '@angular/common';
import {Network} from '@ionic-native/network/ngx';
import {debounceTime} from 'rxjs/operators';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'sync-modal-component',
  templateUrl: 'sync-modal-component.html',
  styleUrls: ['sync-modal-component.scss']
})

export class SyncModalComponent implements OnInit {
    public isStartSync = false;
    public noDataForSync = false;
    public syncedItemsCount = 0;
    public syncedItemsPercent = 0;
    public syncProgressStatus = 'not_sync';
    public isPrepareSynData = false;
    public modeSync;
    public userDb: UserDb;
    public syncAllItemsCount = 0;
    public isNetwork = false;
    public isAvailableForSyncData: boolean = false;
    public isAvailableForPushData: boolean = false;

    constructor(private modalController: ModalController,
                public apiSync: ApiSync,
                public apiPush: ApiPush,
                private downloadService: DownloadService,
                public changeDetectorRef: ChangeDetectorRef,
                public http: HttpClient,
                public authService: AuthService,
                private platform: Platform,
                private db: DbProvider,
                private events: Events,
                private syncService: SyncService,
                public network: Network,
                public datepipe: DatePipe) {
        this.isNetwork = (this.network.type !== 'none');
        this.initUser().then(() => {
            this.syncProgressStatus = this.userDb.userSetting.syncStatus;
        });
    }

    dismiss() {
        this.modalController.dismiss();
    }

    syncData() {
        this.apiSync.makeSyncProcess();
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
        if (this.userDb) {
            return new Promise(resolve => {
                resolve(true);
            });
        }

        return new Promise(resolve => {
            new UserDb(this.platform, this.db, this.events, this.downloadService).getCurrent().then((userDb) => {
                if (userDb) {
                    this.userDb = userDb;

                    resolve(true);
                }
            });
        });
    }

    getLastSyncDate() {
        if (this.userDb && this.userDb.userSetting && this.userDb.userSetting.lastSyncedAt) {
            const date = this.userDb.userSetting.lastSyncedAt;
            return this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
        }

        return '-';
    }

    ngOnInit() {
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
        this.apiSync.syncProgressStatus
            .pipe(debounceTime(200))
            .subscribe(syncProgressStatus => {
                this.syncProgressStatus = syncProgressStatus;
                this.detectChanges();
            });
        this.apiSync.isPrepareSynData.subscribe(isPrepareSynData => {
            this.isPrepareSynData = isPrepareSynData;
            this.detectChanges();
        });
        this.apiSync.syncedItemsCount.subscribe(syncedItemsCount => {
            this.syncedItemsCount = syncedItemsCount ? syncedItemsCount : 0;
            this.detectChanges();
        });
        this.apiSync.syncAllItemsCount.subscribe(syncAllItemsCount => {
            this.syncAllItemsCount = syncAllItemsCount ? syncAllItemsCount : 0;
            this.detectChanges();
        });
        this.apiSync.syncedItemsPercent.subscribe(syncedItemsPercent => {
            this.syncedItemsPercent = syncedItemsPercent ? syncedItemsPercent : 0;
            this.detectChanges();
        });
        this.apiSync.noDataForSync.subscribe(noDataForSync => {
            this.noDataForSync = noDataForSync;
            if (noDataForSync) {
                setTimeout(() => {
                    this.noDataForSync = false;
                }, 3000);
            }
            this.detectChanges();
        });
        this.apiSync.isAvailableForSyncData.subscribe(isAvailableForSyncData => {
            this.isAvailableForSyncData = isAvailableForSyncData;
        });
        this.apiPush.isAvailableForPushData.subscribe(isAvailableForPushData => {
            this.isAvailableForPushData = isAvailableForPushData;
        });
        this.events.subscribe('UserDb:update', (userDb) => {
            this.userDb = userDb;
        });
        this.events.subscribe('network:offline', (isNetwork) => {
            this.isNetwork = false;
            this.detectChanges();
        });
        this.events.subscribe('network:online', (isNetwork) => {
            this.isNetwork = true;
            this.detectChanges();
        });
    }
}
