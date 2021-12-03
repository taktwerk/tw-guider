import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { GuideChildModel } from '../../models/db/api/guide-child-model';
import { DomSanitizer } from '@angular/platform-browser';
import { AppSetting } from '../../services/app-setting';
import { LoggerService } from '../../services/logger-service';
import { MiscService } from '../../services/misc-service';

@Injectable()
export class GuideChildService extends ApiService {
    data: GuideChildModel[] = [];
    loadUrl = '/guide-child';
    dbModelApi: GuideChildModel = new GuideChildModel();


    /**
     * Constructor
     * @param http
     * @param appSetting
     */
    constructor(http: HttpClient,
        public appSetting: AppSetting,
    ) {
        super(http, appSetting);
        console.debug('GuideChildService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideChildModel}
     */
    public newModel() {
        return new GuideChildModel();
    }
}
