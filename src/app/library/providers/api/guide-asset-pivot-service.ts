import { Injectable } from '@angular/core';
import { ApiService } from './base/api-service';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { GuideAssetPivotModel } from 'app/database/models/db/api/guide-asset-pivot-model';

@Injectable()
export class GuideAssetPivotService extends ApiService {
    override data: GuideAssetPivotModel[] = [];
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
        public override appSetting: AppSetting,
    ) {
        super(http, appSetting);
        console.debug('GuideAssetPivotService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideAssetPivotModel}
     */
    public override newModel() {
        return new GuideAssetPivotModel();
    }
}
