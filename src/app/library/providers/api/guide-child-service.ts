import { Injectable } from '@angular/core';
import { ApiService } from './base/api-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { GuideChildModel } from 'app/database/models/db/api/guide-child-model';

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
