import { LoggerService } from './../../services/logger-service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform, Events } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { AppSetting } from '../../services/app-setting';
import { ProtocolCommentModel } from '../../models/db/api/protocol-comment-model';
import { WorkflowStepModel } from '../../models/db/api/workflow-step-model';
import { TranslateConfigService } from '../../services/translate-config.service';

@Injectable()
export class ProtocolCommentService extends ApiService {
    data: ProtocolCommentModel[] = [];
    loadUrl: string = '/protocol-comment';
    dbModelApi: ProtocolCommentModel = new ProtocolCommentModel(this.p, this.db, this.events, this.downloadService, this.loggerService);

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     * @param appSetting
     * @param translateConfigService
     */
    constructor(http: HttpClient,
        private p: Platform, private db: DbProvider,
        public authService: AuthService,
        public events: Events,
        public downloadService: DownloadService,
        public loggerService: LoggerService,
        public appSetting: AppSetting,
        private translateConfigService: TranslateConfigService) {
        super(http, events, appSetting);
    }

    getByProtocolId(protocolId: number): Promise<ProtocolCommentModel[]> {
        return new Promise(async (resolve) => {
            this.dbModelApi.findAllWhere(
                [ProtocolCommentModel.COL_LOCAL_PROTOCOL_ID, protocolId], '_id DESC').then(async result => {
                    if (result) {
                        for (let i = 0; i < result.length; i++) {
                            result[i].body = await this.getCommentBody(result[i]);
                            result[i].icon = await result[i].getIcon();
                            result[i].colour = await result[i].getColour();
                        }
                        resolve(result);
                    } else {
                        resolve(null);
                    }
                });
        });
    }

    async getCommentBody(protocolComment: ProtocolCommentModel) {
        if (protocolComment.comment) {
            return await this.translateConfigService.translate(
                'protocol.commented', { comment: protocolComment.comment }
            );
        }
        if (!protocolComment.new_workflow_step_id || !protocolComment.old_workflow_step_id) {
            return null;
        }
        const newWorkflowStepModel = new WorkflowStepModel(this.p, this.db, this.events, this.downloadService, this.loggerService);
        const newWorkflowStepSearchResult = await newWorkflowStepModel.findFirst(
            [newWorkflowStepModel.COL_ID_API, protocolComment.new_workflow_step_id]
        );
        if (!newWorkflowStepSearchResult.length) {
            return null;
        }
        const newWorkflowStep = newWorkflowStepSearchResult[0];
        if (newWorkflowStep.type === 'final') {
            return await this.translateConfigService.translate('Final');
        }

        const oldWorkflowStepModel = new WorkflowStepModel(this.p, this.db, this.events, this.downloadService, this.loggerService);
        const oldWorkflowStepSearchResult = await oldWorkflowStepModel.findFirst(
            [newWorkflowStepModel.COL_ID_API, protocolComment.old_workflow_step_id]
        );
        if (!oldWorkflowStepSearchResult.length) {
            return null;
        }
        const oldWorkflowStep = oldWorkflowStepSearchResult[0];

        if (newWorkflowStep && oldWorkflowStep) {
            return await this.translateConfigService.translate(
                'protocol.workflow_step_changed',
                { oldWorkflowStepName: oldWorkflowStep.name, newWorkflowStepName: newWorkflowStep.name }
            );
        }

        return null;
    }

    /**
     * Create a new instance of the service model
     * @returns {ProtocolCommentModel}
     */
    public newModel() {
        return new ProtocolCommentModel(this.p, this.db, this.events, this.downloadService, this.loggerService);
    }
}
