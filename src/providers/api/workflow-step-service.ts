import { LoggerService } from './../../services/logger-service';
import { Injectable } from '@angular/core';
import { ApiService } from './base/api-service';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { AppSetting } from '../../services/app-setting';
import { WorkflowStepModel } from '../../models/db/api/workflow-step-model';
import { WorkflowTransitionModel } from '../../models/db/api/workflow-transition-model';
import { WorkflowTransitionService } from './workflow-transition-service';

@Injectable()
export class WorkflowStepService extends ApiService {
    data: WorkflowStepModel[] = [];
    loadUrl: string = '/workflow-step';
    dbModelApi: WorkflowStepModel = new WorkflowStepModel();
    private workflowStepsListCache: WorkflowStepModel[] = [];

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     * @param appSetting
     * @param workflowTransitionService
     */
    constructor(http: HttpClient,
        public authService: AuthService,
        public downloadService: DownloadService,
        public loggerService: LoggerService,
        public appSetting: AppSetting,
        private workflowTransitionService: WorkflowTransitionService
    ) {
        super(http, appSetting);
    }

    getById(workflowStepId: number): Promise<WorkflowStepModel> {
        return new Promise(async (resolve) => {
            if (this.workflowStepsListCache.length) {
                for (let i = 0; i < this.workflowStepsListCache.length; i++) {
                    if (this.workflowStepsListCache[i].idApi === workflowStepId) {
                        this.workflowStepsListCache[i].workflowStepNextTransitions = await this.getNextWorkflowTransitions(
                            this.workflowStepsListCache[i].idApi
                        );
                        resolve(this.workflowStepsListCache[i]);
                        return;
                    }
                }
            }
            this.dbModelApi.findFirst([this.dbModelApi.COL_ID_API, workflowStepId]).then(async result => {
                if (result && result[0]) {
                    result[0].workflowStepNextTransitions = await this.getNextWorkflowTransitions(result[0].idApi);
                    this.workflowStepsListCache.push(result[0]);
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }

    getNextWorkflowTransitions(stepId): Promise<WorkflowTransitionModel[]> {
        return new Promise(resolve => {
            this.workflowTransitionService.dbModelApi.findAllWhere(['workflow_step_id', stepId])
                .then((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        resolve([]);
                    }
                });
        });
    }

    unsetWorkflowStepsListCache() {
        this.workflowStepsListCache = [];
    }

    /**
     * Create a new instance of the service model
     * @returns {WorkflowStepModel}
     */
    public newModel() {
        return new WorkflowStepModel();
    }
}
