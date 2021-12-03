import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { AppSetting } from '../../services/app-setting';
import { WorkflowModel } from '../../models/db/api/workflow-model';
import { LoggerService } from '../../services/logger-service';
import { MiscService } from '../../services/misc-service';

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
