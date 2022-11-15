import { LoggerService } from './../../services/logger-service';
import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { AppSetting } from '../../services/app-setting';
import { MiscService } from '../../services/misc-service';
import { WorkflowTransitionModel } from 'src/app/database/models/db/api/workflow-transition-model';

@Injectable()
export class WorkflowTransitionService extends ApiService {
    data: WorkflowTransitionModel[] = [];
    loadUrl: string = '/workflow-transition';
    dbModelApi: WorkflowTransitionModel = new WorkflowTransitionModel();

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
        private p: Platform, private db: DbProvider,
        public authService: AuthService,
        private miscService: MiscService,

        public downloadService: DownloadService,
        public loggerService: LoggerService,
        public appSetting: AppSetting

    ) {
        super(http, appSetting);
    }

    /**
     * Create a new instance of the service model
     * @returns {WorkflowStepModel}
     */
    public newModel() {
        return new WorkflowTransitionModel();
    }
}
