import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {DownloadService} from '../../services/download-service';
import {AppSetting} from '../../services/app-setting';
import {WorkflowStepModel} from '../../models/db/api/workflow-step-model';

@Injectable()
export class WorkflowStepService extends ApiService {
    data: WorkflowStepModel[] = [];
    loadUrl: string = '/workflow-step';
    dbModelApi: WorkflowStepModel = new WorkflowStepModel(this.p, this.db, this.events, this.downloadService);
    currentWorkflowStepsList: any;

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
                public events: Events,
                public downloadService: DownloadService,
                public appSetting: AppSetting) {
        super(http, events, appSetting);
    }

    getById(workflowStepId: number) {
        return new Promise((resolve) => {
            this.dbModelApi.findFirst([this.dbModelApi.COL_ID_API, workflowStepId]).then(result => {
                if (result && result[0]) {
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }

    /**
     * Create a new instance of the service model
     * @returns {WorkflowStepModel}
     */
    public newModel() {
        return new WorkflowStepModel(this.p, this.db, this.events, this.downloadService);
    }
}
