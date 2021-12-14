import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { GuideCategoryBindingModel } from '../../models/db/api/guide-category-binding-model';
import { AppSetting } from '../../services/app-setting';
import { LoggerService } from '../../services/logger-service';
import { MiscService } from '../../services/misc-service';

@Injectable()
export class GuideCategoryBindingService extends ApiService {
    data: GuideCategoryBindingModel[] = [];
    loadUrl: string = '/guide-category-binding';
    dbModelApi: GuideCategoryBindingModel = new GuideCategoryBindingModel();

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
        public appSetting: AppSetting) {
        super(http, appSetting);
        console.debug('GuideCategoryBindingService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideCategoryBindingModel}
     */
    public newModel() {
        return new GuideCategoryBindingModel();
    }
}
