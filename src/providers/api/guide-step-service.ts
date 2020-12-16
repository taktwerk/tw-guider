import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform, Events } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { GuiderModel } from '../../models/db/api/guider-model';
import { DownloadService } from '../../services/download-service';
import { GuideStepModel } from '../../models/db/api/guide-step-model';
import { DomSanitizer } from '@angular/platform-browser';
import { AppSetting } from '../../services/app-setting';

@Injectable()
export class GuideStepService extends ApiService {
    data: GuideStepModel[] = [];
    loadUrl = '/guide-step';
    dbModelApi: GuideStepModel = new GuideStepModel(this.p, this.db, this.events, this.downloadService);

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
        console.debug('GuideStepService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideStepModel}
     */
    public newModel() {
        return new GuideStepModel(this.p, this.db, this.events, this.downloadService);
    }

    public getDescriptionHtml(descriptionHtml) {
        return this.sanitized.bypassSecurityTrustHtml(descriptionHtml);
    }
}
