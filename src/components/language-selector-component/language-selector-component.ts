/* eslint-disable @angular-eslint/component-selector */

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, Platform } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Subscription } from 'rxjs';
import { SyncModalComponent } from '../sync-modal-component/sync-modal-component';
import { UserDb } from 'app/database/models/db/user-db';
import { MiscService } from 'app/library/services/misc-service';
import { TranslateConfigService } from 'app/library/services/translate-config.service';
import { UserService } from 'app/library/services/user-service';

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
    public iconStatus = 'unsynced';
    public isAvailableForSyncData = false;
    public isAvailableForPushData = false;
    public isLoggedUser = false;
    public params;

    selectedLanguage: string;
    eventSubscription: Subscription;

    constructor(
        private modalController: ModalController,
        private changeDetectorRef: ChangeDetectorRef,
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
               // this.storage.set("storedLang", this.selectedLanguage);
            }
        });
    }

    openLanguageSelector() {
        this.languageSelector.open();
    }

    detectChanges() {
            this.changeDetectorRef.detectChanges();
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
        });

        // this.events.subscribe('user:logout', (isNetwork) => {
        //     this.isLoggedUser = false;
        //     this.detectChanges();
        // });
    }
}
