import { Injectable } from '@angular/core';
import { ApiService } from './base/api-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { GuideCategoryBindingModel } from 'app/database/models/db/api/guide-category-binding-model';

@Injectable()
export class GuideCategoryBindingService extends ApiService {
    override data: GuideCategoryBindingModel[] = [];
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
        public override appSetting: AppSetting) {
        super(http, appSetting);
        console.debug('GuideCategoryBindingService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideCategoryBindingModel}
     */
    public override newModel() {
        return new GuideCategoryBindingModel();
    }
}
