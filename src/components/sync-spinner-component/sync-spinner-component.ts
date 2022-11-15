/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @angular-eslint/component-selector */

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';

import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserDb } from 'app/database/models/db/user-db';
import { ApiSync } from 'app/library/providers/api-sync';
import { MiscService } from 'app/library/services/misc-service';
import { AppSetting } from 'app/library/services/app-setting';

@Component({
    selector: 'sync-spinner-component',
    templateUrl: 'sync-spinner-component.html',
})
export class SyncSpinnerComponent implements OnInit {
    @Input() shouldOpenPopup = true;

    public userDb!: UserDb;
    public isStartSync = false;
    public isNetwork = false;
    public iconStatus: any = 'unsynced';
    public isAvailableForSyncData = false;
    public isAvailableForPushData = false;
    public isLoggedUser = false;
    eventSubscription!: Subscription;

    constructor(
        private apiSync: ApiSync,
        private changeDetectorRef: ChangeDetectorRef,
        private network: Network,
        public appSetting: AppSetting,
        private miscService: MiscService,
        private navCtrl: NavController,
        private menu: MenuController

    ) {
        this.isNetwork = (this.network.type !== 'none');
    }

    detectChanges() {
            this.changeDetectorRef.detectChanges();
    }

    async openSyncModal() {
        this.navCtrl.navigateRoot('/sync-model');
        this.menu.close();
        // this.router.navigate(['/sync-model']);
        // if (!this.shouldOpenPopup) {
        //     return false;
        // }
        // const modal = await this.modalController.create({
        //     component: SyncModalComponent,
        //     cssClass: "modal-fullscreen"
        // });
        // return await modal.present();
    }

    protected initUserDB() {
        if (this.userDb) {
            return new Promise(resolve => {
                resolve(true);
            });
        }

        return new Promise(resolve => {
            new UserDb().getCurrent().then((userDb) => {
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
        // this.events.subscribe('user:login', (isNetwork) => {
        //     this.isLoggedUser = true;
        //     this.detectChanges();
        // });
        // this.events.subscribe('user:logout', (isNetwork) => {
        //     this.isLoggedUser = false;
        //     this.detectChanges();
        // });
        // this.events.subscribe('network:offline', (isNetwork) => {
        //     this.isNetwork = false;
        //     this.detectChanges();
        // });
        // this.events.subscribe('network:online', (isNetwork) => {
        //     this.isNetwork = true;
        //     this.detectChanges();
        // });

        this.eventSubscription = this.miscService.events.subscribe(async (event) => {
            switch (event.TAG) {
                case 'user:login':
                    this.isLoggedUser = true;
                    this.detectChanges();
                    break;
                case 'user:logout':
                    this.isLoggedUser = false;
                    this.detectChanges();
                    break;
                case 'network:offline':
                    this.isNetwork = false;
                    this.detectChanges();
                    break;
                case 'network:online':
                    this.isNetwork = true;
                    this.detectChanges();
                    break;
                default:
            }
        });

        this.apiSync.isAvailableForSyncData.subscribe(isAvailableForSyncData => {
            this.isAvailableForSyncData = isAvailableForSyncData;
        });
        this.apiSync.isAvailableForPushData.subscribe(isAvailableForPushData => {
            this.isAvailableForPushData = isAvailableForPushData;
        });

        this.apiSync.syncProgressStatus
            .pipe(debounceTime(500))
            .subscribe(syncProgressStatus => {
                switch (syncProgressStatus) {
                    case ('initial'):
                        this.iconStatus = 'unsynced';
                        break;
                    case ('success'):
                        this.iconStatus = 'synced';
                        break;
                    case ('resume'):
                    case ('progress'):
                        this.iconStatus = 'progress';
                        break;
                    case ('pause'):
                        this.iconStatus = 'pause';
                        break;
                    case ('failed'):
                        this.iconStatus = 'failed';
                        break;
                    default:
                        this.iconStatus = null;
                }
                this.detectChanges();
            });
    }
}
