import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { AppSetting } from '../../services/app-setting';
import { ProtocolTemplateModel } from '../../models/db/api/protocol-template-model';
import { WorkflowStepService } from './workflow-step-service';
import { UserService } from '../../services/user-service';
import { AuthDb } from '../../models/db/auth-db';
import { WorkflowService } from './workflow-service';
import { LoggerService } from 'src/services/logger-service';
import { MiscService } from 'src/services/misc-service';

@Injectable()
export class ProtocolTemplateService extends ApiService {
    data: ProtocolTemplateModel[] = [];
    loadUrl: string = '/protocol-template';
    dbModelApi: ProtocolTemplateModel = new ProtocolTemplateModel(this.p, this.db, this.downloadService, this.loggerService, this.miscService);
    user: AuthDb;

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
    constructor(http: HttpClient,
        private p: Platform,
        private db: DbProvider,
        public authService: AuthService,

        public downloadService: DownloadService,
        public loggerService: LoggerService,

        public appSetting: AppSetting,
        private workflowStepService: WorkflowStepService,
        private workflowService: WorkflowService,
        private userService: UserService
        , private miscService: MiscService
    ) {
        super(http, appSetting);
    }

    async getCurrentUser() {
        this.user = await this.authService.getLastUser();

        return this.user;
    }

    async canCreateProtocol(templateId): Promise<boolean> {
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
    public newModel() {
        return new ProtocolTemplateModel(this.p, this.db, this.downloadService, this.loggerService, this.miscService);
    }
}
