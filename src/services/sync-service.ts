import {Injectable} from '@angular/core';
import {HttpClient} from '../services/http-client';
import {Platform, LoadingController} from '@ionic/angular';
import {DbProvider} from '../providers/db-provider';
import { Events, NavController } from '@ionic/angular';
import {Network} from '@ionic-native/network/ngx';
import {ApiSync} from '../providers/api-sync';
import {AuthService} from '../services/auth-service';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SyncService {

    syncMode = new BehaviorSubject<number>(0);

    constructor(private http: HttpClient,
                public platform: Platform,
                public dbProvider: DbProvider,
                public loadingController: LoadingController,
                public events: Events,
                private authService: AuthService,
                private network: Network,
                public apiSync: ApiSync
    ) {
        this.syncMode = new BehaviorSubject<number>(1);
    }
}
