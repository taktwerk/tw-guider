import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Events, ModalController, Platform} from '@ionic/angular';
import {UserDb} from '../../models/db/user-db';
import {ApiSync} from '../../providers/api-sync';
import {DownloadService} from '../../services/download-service';
import {HttpClient} from '../../services/http-client';
import {AuthService} from '../../services/auth-service';
import {DbProvider} from '../../providers/db-provider';
import {SyncService} from '../../services/sync-service';
import {Network} from '@ionic-native/network/ngx';
import {debounceTime} from 'rxjs/operators';
import {DatePipe} from '../../pipes/date-pipe/date-pipe';
import {UserService} from '../../services/user-service';
import {SyncMode} from '../synchronization-component/synchronization-component';
import {AppSetting} from '../../services/app-setting';
import {Insomnia} from '@ionic-native/insomnia/ngx';

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
    private isAvailableForPushData: boolean;

    constructor(private modalController: ModalController,
                public apiSync: ApiSync,
                private downloadService: DownloadService,
                public changeDetectorRef: ChangeDetectorRef,
                public http: HttpClient,
                public authService: AuthService,
                private platform: Platform,
                private db: DbProvider,
                private events: Events,
                private syncService: SyncService,
                public network: Network,
                public datepipe: DatePipe,
                private userService: UserService,
                private appSetting: AppSetting,
                private insomnia: Insomnia) {
        this.isNetwork = (this.network.type !== 'none');
        this.initUser().then(() => {
            this.syncProgressStatus = this.userService.userDb.userSetting.syncStatus;
        });
    }

    dismiss() {
        this.modalController.dismiss().then(() => {
            this.insomnia.allowSleepAgain()
                .then(
                    () => console.log('insomnia.allowSleepAgain success'),
                    () => console.log('insomnia.allowSleepAgain error')
                );
        });
    }

    syncData() {
        if (!this.appSetting.isMigratedDatabase()) {
            this.appSetting.showIsNotMigratedDbPopup();

            return;
        }
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
        return this.userService.getUser().then(result => {
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
        this.insomnia.keepAwake()
            .then(
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
        this.apiSync.isStartSyncBehaviorSubject.subscribe(isSync => {
            this.isStartSync = isSync;
            this.detectChanges();
        });
        this.apiSync.syncProgressStatus
            .pipe(debounceTime(200))
            .subscribe(syncProgressStatus => {
                if (syncProgressStatus) {
                    this.syncProgressStatus = syncProgressStatus;
                }
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
        this.apiSync.isAvailableForPushData.subscribe(isAvailableForPushData => {
            this.isAvailableForPushData = isAvailableForPushData;
        });
        this.apiSync.pushProgressStatus.subscribe(pushProgressStatus => {
            console.log('pushProgressStatus subscribe', pushProgressStatus);
            this.pushProgressStatus = pushProgressStatus;
        });
        this.events.subscribe('UserDb:update', (userDb) => {
            this.userService.userDb = userDb;
        });
        this.events.subscribe('network:offline', (isNetwork) => {
            this.isNetwork = false;
            this.detectChanges();
        });
        this.events.subscribe('network:online', (isNetwork) => {
            this.isNetwork = true;
            this.detectChanges();
        });
        this.events.subscribe('user:logout', () => {
            this.dismiss();
        });
    }
}
