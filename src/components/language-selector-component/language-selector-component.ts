import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, Platform } from '@ionic/angular';

import { ApiSync } from '../../providers/api-sync';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { Network } from '@ionic-native/network/ngx';
import { SyncModalComponent } from '../sync-modal-component/sync-modal-component';
import { UserDb } from '../../models/db/user-db';
import { DownloadService } from '../../services/download-service';
import { DbProvider } from '../../providers/db-provider';
import { TranslateConfigService } from '../../services/translate-config.service';
import { UserService } from '../../services/user-service';
import { MiscService } from 'src/services/misc-service';
import { Subscription } from 'rxjs';

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
    @ViewChild('languageSelector', { static: true }) languageSelector: IonSelect;

    public userDb: UserDb;
    public isStartSync = false;
    public syncedItemsPercent = 0;
    public isNetwork = false;
    public iconStatus: string = 'unsynced';
    public isAvailableForSyncData: boolean = false;
    public isAvailableForPushData: boolean = false;
    public isLoggedUser: boolean = false;
    public params;

    selectedLanguage: string;
    eventSubscription: Subscription;

    constructor(private platform: Platform,
        private downloadService: DownloadService,
        private db: DbProvider,
        private apiSync: ApiSync,
        private modalController: ModalController,
        private changeDetectorRef: ChangeDetectorRef,
        private http: HttpClient,
        private authService: AuthService,
        private network: Network,
        private translateConfigService: TranslateConfigService,
        private userService: UserService,
        private miscService: MiscService,
    ) {
        this.init();
    }

    init() {
        this.isNetwork = (this.network.type !== 'none');
        this.userService.getUser().then((isExist) => {
            if (isExist) {
                if (this.userService.userDb.userSetting &&
                    this.userService.userDb.userSetting.language &&
                    this.translateConfigService.isLanguageAvailable(this.userService.userDb.userSetting.language)
                ) {
                    this.selectedLanguage = this.userService.userDb.userSetting.language;
                    this.translateConfigService.setLanguage(this.selectedLanguage);

                    return;
                }
            }

            this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
        });
    }

    languageChanged() {
        this.translateConfigService.setLanguage(this.selectedLanguage);
        this.userService.getUser().then((isExist) => {
            if (isExist) {
                this.userService.userDb.userSetting.language = this.selectedLanguage;
                this.userService.userDb.save();
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

    ngOnInit() {
        // this.events.subscribe('user:login', (isNetwork) => {
        //     this.init();
        //     this.detectChanges();
        // });

        this.eventSubscription = this.miscService.events.subscribe(async (event) => {
            switch (event.TAG) {
                case 'user:login':
                    this.init();
                    this.detectChanges();
                    break;
                default:
            }
        })

        // this.events.subscribe('user:logout', (isNetwork) => {
        //     this.isLoggedUser = false;
        //     this.detectChanges();
        // });
    }
}
