import { Injectable } from '@angular/core';
import { ApiService } from './base/api-service';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { WorkflowStepService } from './workflow-step-service';
import { ProtocolTemplateModel } from 'app/database/models/db/api/protocol-template-model';
import { AuthDb } from 'app/database/models/db/auth-db';

@Injectable()
export class ProtocolTemplateService extends ApiService {
    override data: ProtocolTemplateModel[] = [];
    loadUrl: string = '/protocol-template';
    dbModelApi: ProtocolTemplateModel = new ProtocolTemplateModel();
    user: AuthDb = new AuthDb();

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     * @param appSetting
     * @param workflowStepService
     * @param workflowService
     * @param userService
     */
    constructor(
        http: HttpClient,
        public authService: AuthService,
        public override appSetting: AppSetting,
        private workflowStepService: WorkflowStepService,
    ) {
        super(http, appSetting);
    }

    async getCurrentUser() {
        this.user = await this.authService.getLastUser();

        return this.user;
    }

    async canCreateProtocol(templateId: any): Promise<boolean> {
        if (!templateId) {
            return false;
        }
        const user = await this.getCurrentUser();
        if (!user) {
            return false;
        }
        const protocolTemplate = await this.dbModelApi.findFirst([this.dbModelApi.COL_ID_API, templateId]);
        if (!protocolTemplate || !protocolTemplate[0]) {
            console.log('protocolTemplate', protocolTemplate);
            return false;
        }
        const workflowStepModel = this.workflowStepService.newModel();
        const firstWorkflowStepOfTemplate = await workflowStepModel.findFirst(
            [['workflow_id', protocolTemplate[0].workflow_id], ['is_first', 1]]
        );
        if (!firstWorkflowStepOfTemplate || !firstWorkflowStepOfTemplate[0]) {
            console.log('!firstWorkflowStepOfTemplate');
            return false;
        }
        const workflowStep = firstWorkflowStepOfTemplate[0];
        if (workflowStep.type === 'final') {
            console.log('workflowStep.type is final');
            return false;
        }
        if (!workflowStep.user_id && !workflowStep.role) {
            return true;
        }
        if (workflowStep.user_id) {
            console.log('workflowStep', workflowStep);
            console.log('is workflowStep.user_id', workflowStep.user_id);
            console.log('user.userId', user.userId);
            if (workflowStep.user_id === user.userId) {
                return true;
            }
        }
        if (workflowStep.role && user.additionalInfo && user.additionalInfo.roles) {
            console.log('in rulesssss');
            if (user.additionalInfo.roles.includes(workflowStep.role)) {
                return true;
            }
        }

        console.log('just cant create protocol');
        return false;
    }

    /**
     * Create a new instance of the service model
     * @returns {ProtocolTemplateModel}
     */
    public override newModel() {
        return new ProtocolTemplateModel();
    }
}
