import {Injectable} from '@angular/core';
import {HttpClient} from '../services/http-client';
import {Platform, LoadingController} from '@ionic/angular';
import {DbProvider} from '../providers/db-provider';
import { Events, NavController } from '@ionic/angular';
import {ApiSync} from '../providers/api-sync';
import {BehaviorSubject} from 'rxjs';
import {SyncMode} from '../components/synchronization-component/synchronization-component';

@Injectable()
export class SyncService {

    syncMode = new BehaviorSubject<number>(null);

    constructor(public platform: Platform,
                public dbProvider: DbProvider,
                public loadingController: LoadingController,
                public events: Events,
                public apiSync: ApiSync
    ) {
    }
}

