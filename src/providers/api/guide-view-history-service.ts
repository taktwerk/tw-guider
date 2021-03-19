import { LoggerService } from './../../services/logger-service';
import { Injectable } from '@angular/core';

import { Platform, } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppSetting } from '../../services/app-setting';
import { GuideViewHistoryModel } from 'src/models/db/api/guide-view-history-model';
import { MiscService } from 'src/services/misc-service';

@Injectable()
export class GuideViewHistoryService extends ApiService {
    data: GuideViewHistoryModel[] = [];
    loadUrl = '/guide-view-history';

    dbModelApi: GuideViewHistoryModel = new GuideViewHistoryModel(this.p, this.db, this.downloadService, this.loggerService, this.miscService);

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

        public downloadService: DownloadService,
        public loggerService: LoggerService,
        private sanitized: DomSanitizer,
        public appSetting: AppSetting,
        private miscService: MiscService,
    ) {
        super(http, appSetting);
        console.debug('GuideViewHistoryService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideViewHistoryModel}
     */
    public newModel() {
        return new GuideViewHistoryModel(this.p, this.db, this.downloadService, this.loggerService, this.miscService);
    }
}
