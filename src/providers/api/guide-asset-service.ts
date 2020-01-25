import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {DownloadService} from '../../services/download-service';
import {GuideAssetPivotModel} from '../../models/db/api/guide-asset-pivot-model';
import {GuideAssetModel} from '../../models/db/api/guide-asset-model';

@Injectable()
export class GuideAssetService extends ApiService {
    data: GuideAssetModel[] = [];
    loadUrl: string = '/guide-asset';
    dbModelApi: GuideAssetModel = new GuideAssetModel(this.p, this.db, this.events, this.downloadService);

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     */
    constructor(http: HttpClient, private p: Platform, private db: DbProvider,
        public authService: AuthService,
        public events: Events,
        public downloadService: DownloadService) {
        super(http, events);
        console.debug('GuideAssetService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {TimerTrackingModel}
     */
    public newModel() {
        return new GuideAssetModel(this.p, this.db, this.events, this.downloadService);
    }
}
