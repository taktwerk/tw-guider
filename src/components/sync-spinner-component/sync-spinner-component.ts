import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, Events, ModalController, NavController} from '@ionic/angular';

import {ApiSync} from '../../providers/api-sync';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {Network} from '@ionic-native/network/ngx';

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

    constructor(public apiSync: ApiSync,
                public modalCtrl: ModalController,
                public changeDetectorRef: ChangeDetectorRef,
                public http: HttpClient,
                public authService: AuthService,
                public alertController: AlertController,
                public navCtrl: NavController,
                public network: Network,
                public events: Events) {
        if (this.network.type === 'none') {
            this.isNetwork = false;
        } else {
            this.isNetwork = true;
        }
    }

    detectChanges() {
        if (!this.changeDetectorRef['destroyed']) {
            this.changeDetectorRef.detectChanges();
        }
    }

    clickOnSpinner() {
        this.navCtrl.navigateRoot('profile');
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
     }
}
