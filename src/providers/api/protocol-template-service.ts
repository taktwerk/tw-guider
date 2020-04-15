import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {DownloadService} from '../../services/download-service';
import {AppSetting} from '../../services/app-setting';
import {ProtocolTemplateModel} from '../../models/db/api/protocol-template-model';
import {WorkflowStepService} from './workflow-step-service';
import {UserService} from '../../services/user-service';
import {AuthDb} from '../../models/db/auth-db';

@Injectable()
export class ProtocolTemplateService extends ApiService {
    data: ProtocolTemplateModel[] = [];
    loadUrl: string = '/protocol-template';
    dbModelApi: ProtocolTemplateModel = new ProtocolTemplateModel(this.p, this.db, this.events, this.downloadService);
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
     * @param userService
     */
    constructor(http: HttpClient,
                private p: Platform,
                private db: DbProvider,
                public authService: AuthService,
                public events: Events,
                public downloadService: DownloadService,
                public appSetting: AppSetting,
                private workflowStepService: WorkflowStepService,
                private userService: UserService) {
        super(http, events, appSetting);
    }

    async getCurrentUser() {
        this.user = await this.authService.getLastUser();

        return this.user;
    }

    async canCreateProtocol(templateId): Promise<boolean> {
        const user = await this.getCurrentUser();
        if (!user) {
            return false;
        }
        const protocol = await this.dbModelApi.findFirst([this.dbModelApi.COL_ID_API, templateId]);
        if (protocol && protocol[0]) {
            const workflowStepModel = this.workflowStepService.newModel();
            const firstWorkflowStepOfTemplate = await workflowStepModel.findFirst(
                [[this.dbModelApi.COL_ID_API, templateId], ['is_first', 1]]
            );
            if (!firstWorkflowStepOfTemplate || !firstWorkflowStepOfTemplate[0]) {
                return false;
            }
            const workflowStep = firstWorkflowStepOfTemplate[0];
            if (workflowStep.type === 'final') {
                return false;
            }
            if (!workflowStep.user_id && !workflowStep.role) {
                return true;
            }
            if (workflowStep.user_id) {
                if (workflowStep.user_id === user.userId) {
                    return true;
                }
            }
            if (workflowStep.role && user.additionalInfo && user.additionalInfo.roles) {
                if (user.additionalInfo.roles.includes(workflowStep.role)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Create a new instance of the service model
     * @returns {ProtocolTemplateModel}
     */
    public newModel() {
        return new ProtocolTemplateModel(this.p, this.db, this.events, this.downloadService);
    }
}
