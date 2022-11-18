import { Injectable } from '@angular/core';
import { ApiService } from './base/api-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { GuideAssetModel } from 'app/database/models/db/api/guide-asset-model';


@Injectable()
export class GuideAssetService extends ApiService {
    override data: GuideAssetModel[] = [];
    loadUrl = '/guide-asset';
    dbModelApi: GuideAssetModel = new GuideAssetModel();

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
    constructor(
        public override http: HttpClient,
        public override appSetting: AppSetting,
    ) {
        super(http, appSetting);
        console.debug('GuideAssetService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideAssetModel}
     */
    public override newModel() {
        return new GuideAssetModel();
    }
}