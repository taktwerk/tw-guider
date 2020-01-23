import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, Events, ModalController, Platform} from '@ionic/angular';

import {ApiSync} from '../../providers/api-sync';
import {DownloadService} from '../../services/download-service';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {UserDb} from '../../models/db/user-db';
import {DbProvider} from '../../providers/db-provider';
import {SyncService} from '../../services/sync-service';
import {ApiService} from '../../providers/api/base/api-service';

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
  selector: 'sync-spinner-component',
  templateUrl: 'sync-spinner-component.html',
})
export class SyncSpinnerComponent implements OnInit {

    public isStartSync = false;

    constructor(public apiSync: ApiSync,
                public modalCtrl: ModalController,
                public changeDetectorRef: ChangeDetectorRef,
                public http: HttpClient,
                public authService: AuthService,
                public alertController: AlertController) {
    }


    detectChanges() {
        if (!this.changeDetectorRef['destroyed']) {
            this.changeDetectorRef.detectChanges();
        }
    }

    ngOnInit() {
        this.apiSync.isStartSyncBehaviorSubject.subscribe(isSync => {
            this.isStartSync = isSync;
            this.detectChanges();
        });
     }
}
