import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {GuiderModel} from '../../models/db/api/guider-model';
import {DownloadService} from '../../services/download-service';
import {GuideCategoryBindingModel} from '../../models/db/api/guide-category-binding-model';
import {AppSetting} from '../../services/app-setting';

@Injectable()
export class GuideCategoryBindingService extends ApiService {
    data: GuideCategoryBindingModel[] = [];
    loadUrl: string = '/guide-category-binding';
    dbModelApi: GuideCategoryBindingModel = new GuideCategoryBindingModel(this.p, this.db, this.events, this.downloadService);

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     * @param appSetting
     */
    constructor(http: HttpClient,
                private p: Platform,
                private db: DbProvider,
                public authService: AuthService,
                public events: Events,
                public downloadService: DownloadService,
                public appSetting: AppSetting) {
        super(http, events, appSetting);
        console.debug('GuideCategoryBindingService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {TimerTrackingModel}
     */
    public newModel() {
        return new GuideCategoryBindingModel(this.p, this.db, this.events, this.downloadService);
    }
}
