import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { FeedbackModel } from '../../models/db/api/feedback-model';
import { AppSetting } from '../../services/app-setting';
import { LoggerService } from '../../services/logger-service';
import { MiscService } from '../../services/misc-service';

@Injectable()
export class FeedbackService extends ApiService {
    data: FeedbackModel[] = [];
    loadUrl: string = '/feedback';
    dbModelApi: FeedbackModel = new FeedbackModel();

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
        public appSetting: AppSetting
    ) {
        super(http, appSetting);
        console.debug('FeedbackService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {FeedbackModel}
     */
    public newModel() {
        return new FeedbackModel();
    }
}
