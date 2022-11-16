import { Injectable } from '@angular/core';
import { ApiService } from './base/api-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { FeedbackModel } from 'app/database/models/db/api/feedback-model';

@Injectable()
export class FeedbackService extends ApiService {
    override data: FeedbackModel[] = [];
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
        public override appSetting: AppSetting
    ) {
        super(http, appSetting);
        console.debug('FeedbackService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {FeedbackModel}
     */
    public override newModel() {
        return new FeedbackModel();
    }
}
