import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform, Events } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppSetting } from '../../services/app-setting';
import { GuideViewHistoryModel } from 'src/models/db/api/guide-view-history-model';

@Injectable()
export class GuideViewHistoryService extends ApiService {
    data: GuideViewHistoryModel[] = [];
    loadUrl = '/guide-view-history';

    dbModelApi: GuideViewHistoryModel = new GuideViewHistoryModel(this.p, this.db, this.events, this.downloadService);

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     * @param sanitized
     * @param appSetting
     */
    constructor(http: HttpClient,
        private p: Platform,
        private db: DbProvider,
        public authService: AuthService,
        public events: Events,
        public downloadService: DownloadService,
        private sanitized: DomSanitizer,
        public appSetting: AppSetting) {
        super(http, events, appSetting);
        console.debug('GuideViewHistoryService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideViewHistoryModel}
     */
    public newModel() {
        return new GuideViewHistoryModel(this.p, this.db, this.events, this.downloadService);
    }
}
