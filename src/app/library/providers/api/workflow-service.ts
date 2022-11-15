import { Injectable } from '@angular/core';

import { ApiService } from './base/api-service';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { WorkflowModel } from 'app/database/models/db/api/workflow-model';

@Injectable()
export class WorkflowService extends ApiService {
    data: WorkflowModel[] = [];
    loadUrl: string = '/workflow';
    dbModelApi: WorkflowModel = new WorkflowModel();

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
        public appSetting: AppSetting) {
        super(http, appSetting);
    }

    /**
     * Create a new instance of the service model
     * @returns {WorkflowModel}
     */
    public newModel() {
        return new WorkflowModel();
    }
}
