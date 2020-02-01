import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, Events, ModalController, NavController} from '@ionic/angular';

import {ApiSync} from '../../providers/api-sync';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {Network} from '@ionic-native/network/ngx';
import {SyncModalComponent} from '../sync-modal-component/sync-modal-component';
import {debounceTime} from 'rxjs/operators';
import {ApiPush} from '../../providers/api-push';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'sync-spinner-component',
  templateUrl: 'sync-spinner-component.html',
})
export class SyncSpinnerComponent implements OnInit {

    public isStartSync = false;
    public syncedItemsPercent = 0;
    public isNetwork = false;
    public iconStatus: string = 'unsynced';
    public isAvailableForSyncData: boolean = false;
    public isAvailableForPushData: boolean = false;

    constructor(private apiSync: ApiSync,
                private apiPush: ApiPush,
                private modalController: ModalController,
                private changeDetectorRef: ChangeDetectorRef,
                private http: HttpClient,
                private authService: AuthService,
                private network: Network,
                private events: Events
    ) {
        this.isNetwork = (this.network.type !== 'none');
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
        this.apiSync.isStartSyncBehaviorSubject.subscribe(isSync => {
            this.isStartSync = isSync;
            this.detectChanges();
        });
        this.apiSync.syncedItemsPercent.subscribe(syncedItemsPercent => {
            this.syncedItemsPercent = syncedItemsPercent;
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
