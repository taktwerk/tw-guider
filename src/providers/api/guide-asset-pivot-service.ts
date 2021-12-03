import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { GuideAssetPivotModel } from '../../models/db/api/guide-asset-pivot-model';
import { AppSetting } from '../../services/app-setting';
import { LoggerService } from '../../services/logger-service';
import { MiscService } from '../../services/misc-service';

@Injectable()
export class GuideAssetPivotService extends ApiService {
    data: GuideAssetPivotModel[] = [];
    loadUrl: string = '/guide-asset-pivot';
    dbModelApi: GuideAssetPivotModel = new GuideAssetPivotModel();

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
        public authService: AuthService,
        public appSetting: AppSetting,
    ) {
        super(http, appSetting);
        console.debug('GuideAssetPivotService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideAssetPivotModel}
     */
    public newModel() {
        return new GuideAssetPivotModel();
    }
}
