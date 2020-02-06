import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Events, IonSelect, ModalController, Platform} from '@ionic/angular';

import {ApiSync} from '../../providers/api-sync';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {Network} from '@ionic-native/network/ngx';
import {SyncModalComponent} from '../sync-modal-component/sync-modal-component';
import {debounceTime} from 'rxjs/operators';
import {ApiPush} from '../../providers/api-push';
import {UserDb} from '../../models/db/user-db';
import {DownloadService} from '../../services/download-service';
import {DbProvider} from '../../providers/db-provider';
import {TranslateConfigService} from '../../services/translate-config.service';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'language-selector-component',
  templateUrl: 'language-selector-component.html',
})
export class LanguageSelectorComponent implements OnInit {
    @ViewChild('languageSelector', {static: true}) languageSelector: IonSelect;

    public userDb: UserDb;
    public isStartSync = false;
    public syncedItemsPercent = 0;
    public isNetwork = false;
    public iconStatus: string = 'unsynced';
    public isAvailableForSyncData: boolean = false;
    public isAvailableForPushData: boolean = false;
    public isLoggedUser: boolean = false;

    selectedLanguage:string;

    constructor(private platform: Platform,
                private downloadService: DownloadService,
                private db: DbProvider,
                private apiSync: ApiSync,
                private apiPush: ApiPush,
                private modalController: ModalController,
                private changeDetectorRef: ChangeDetectorRef,
                private http: HttpClient,
                private authService: AuthService,
                private network: Network,
                private events: Events,
                private translateConfigService: TranslateConfigService
    ) {
        this.isNetwork = (this.network.type !== 'none');
        this.initUserDB().then((isExist) => {
            if (this.userDb && isExist) {
                if (this.userDb.userSetting &&
                    this.userDb.userSetting.language &&
                    this.translateConfigService.isLanguageAvailable(this.userDb.userSetting.language)
                ) {
                    this.selectedLanguage = this.userDb.userSetting.language;
                    this.translateConfigService.setLanguage(this.selectedLanguage);

                    return;
                }
            }

            this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
        });
    }

    languageChanged() {
        this.translateConfigService.setLanguage(this.selectedLanguage);
        this.initUserDB().then((isExist) => {
            if (isExist) {
                this.userDb.userSetting.language = this.selectedLanguage;
                this.userDb.save();
            }
        });
    }

    openLanguageSelector() {
        this.languageSelector.open();
    }

    detectChanges() {
        if (!this.changeDetectorRef['destroyed']) {
            this.changeDetectorRef.detectChanges();
        }
    }

    async openSyncModal() {
        const modal = await this.modalController.create({
            component: SyncModalComponent,
        });
        return await modal.present();
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
                    this.userDb = userDb;

                    resolve(true);
                }

                resolve(false);
            });
        });
    }

    ngOnInit() {
        this.initUserDB().then((isLogged) => {
            if (isLogged) {
                this.isLoggedUser = true;
                this.detectChanges();
            }
        });
        this.apiSync.isStartSyncBehaviorSubject.subscribe(isSync => {
            this.isStartSync = isSync;
            this.detectChanges();
        });
        this.apiSync.syncedItemsPercent.subscribe(syncedItemsPercent => {
            this.syncedItemsPercent = syncedItemsPercent;
            this.detectChanges();
        });
        this.events.subscribe('user:login', (isNetwork) => {
            this.isLoggedUser = true;
            this.detectChanges();
        });
        this.events.subscribe('user:logout', (isNetwork) => {
            this.isLoggedUser = false;
            this.detectChanges();
        });
        this.events.subscribe('network:offline', (isNetwork) => {
            this.isNetwork = false;
            this.detectChanges();
        });
        this.events.subscribe('network:online', (isNetwork) => {
            this.isNetwork = true;
            this.detectChanges();
        });
        this.apiSync.isAvailableForSyncData.subscribe(isAvailableForSyncData => {
           this.isAvailableForSyncData = isAvailableForSyncData;
        });
        this.apiPush.isAvailableForPushData.subscribe(isAvailableForPushData => {
            this.isAvailableForPushData = isAvailableForPushData;
        });
        this.apiSync.syncProgressStatus
            .pipe(debounceTime(500))
            .subscribe(syncProgressStatus => {
                switch (syncProgressStatus) {
                    case ('initial') :
                        this.iconStatus = 'unsynced';
                        break;
                    case ('success') :
                        this.iconStatus = 'synced';
                        break;
                    case ('resume') :
                    case ('progress') :
                        this.iconStatus = 'progress';
                        break;
                    case ('pause') :
                        this.iconStatus = 'pause';
                        break;
                    case ('failed') :
                        this.iconStatus = 'failed';
                        break;
                    default:
                        this.iconStatus = null;
                }
                this.detectChanges();
            });
     }
}
