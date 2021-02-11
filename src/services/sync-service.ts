import { Injectable } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { DbProvider } from '../providers/db-provider';
import { Events } from '@ionic/angular';
import { ApiSync } from '../providers/api-sync';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SyncService {

    syncMode = new BehaviorSubject<number>(null);
    resumeMode = new BehaviorSubject<boolean>(null);

    constructor(
        // public platform: Platform,
        // public dbProvider: DbProvider,
        // public loadingController: LoadingController,
        // public events: Events,
        // public apiSync: ApiSync
    ) {
    }
}
