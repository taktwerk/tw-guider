import { Injectable } from '@angular/core';

import { Platform, } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { GuiderModel } from '../../models/db/api/guider-model';
import { DownloadService } from '../../services/download-service';
import { GuideStepModel } from '../../models/db/api/guide-step-model';
import { DomSanitizer } from '@angular/platform-browser';
import { AppSetting } from '../../services/app-setting';
import { LoggerService } from '../../services/logger-service';
import { MiscService } from '../../services/misc-service';

@Injectable()
export class GuideStepService extends ApiService {
    data: GuideStepModel[] = [];
    loadUrl = '/guide-step';
    dbModelApi: GuideStepModel = new GuideStepModel();

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
        private miscService: MiscService,
        private sanitized: DomSanitizer,
        public appSetting: AppSetting) {
        super(http, appSetting);
        console.debug('GuideStepService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideStepModel}
     */
    public newModel() {
        return new GuideStepModel();
    }

    public getDescriptionHtml(descriptionHtml) {
        return this.sanitized.bypassSecurityTrustHtml(descriptionHtml);
    }
}
