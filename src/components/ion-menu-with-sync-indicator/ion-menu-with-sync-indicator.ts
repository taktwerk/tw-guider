/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */

import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ApiSync } from '../../providers/api-sync';
import { AppSetting } from '../../services/app-setting';
import { MiscService } from '../../services/misc-service';
import { ModalController } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Subscription } from 'rxjs';
import { SyncModalComponent } from '../sync-modal-component/sync-modal-component';
import { UserDb } from '../../models/db/user-db';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'ion-menu-with-sync-indicator',
    templateUrl: 'ion-menu-with-sync-indicator.html',
    styleUrls: ['ion-menu-with-sync-indicator.scss']
})
export class ionMenuWithSyncIndicator implements OnInit, OnDestroy {
    @Input() shouldOpenPopup = true;

    public userDb: UserDb;
    public isStartSync = false;
    public isNetwork = false;
    public iconStatus = 'unsynced';
    public isAvailableForSyncData = false;
    public isAvailableForPushData = false;
    public isLoggedUser = false;

    eventSubscription: Subscription;

    constructor(
        private apiSync: ApiSync,
        private modalController: ModalController,
        private changeDetectorRef: ChangeDetectorRef,
        private network: Network,
        public appSetting: AppSetting,
        private miscService: MiscService,
    ) {
        this.isNetwork = (this.network.type !== 'none');
    }

    detectChanges() {
            this.changeDetectorRef.detectChanges();
    }

    async openSyncModal() {
        if (!this.shouldOpenPopup) {
            return false;
        }
        const modal = await this.modalController.create({
            component: SyncModalComponent,
            cssClass: 'modal-fullscreen'
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

        // this.events.subscribe('user:login', () => {
        //     this.isLoggedUser = true;
        //     this.detectChanges();
        // });

        // this.events.subscribe('user:logout', () => {
        //     this.isLoggedUser = false;
        //     this.detectChanges();
        // });

        // this.events.subscribe('network:offline', () => {
        //     this.isNetwork = false;
        //     this.detectChanges();
        // });

        // this.events.subscribe('network:online', () => {
        //     this.isNetwork = true;
        //     this.detectChanges();
        // });

        this.eventSubscription = this.miscService.events.subscribe((event) => {
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

    ngOnDestroy(): void {
        this.eventSubscription.unsubscribe();
    }
}
