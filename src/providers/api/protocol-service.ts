import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {DownloadService} from '../../services/download-service';
import {AppSetting} from '../../services/app-setting';
import {ProtocolModel} from '../../models/db/api/protocol-model';
import {WorkflowStepService} from './workflow-step-service';
import {ProtocolDefaultService} from './protocol-default-service';
import {AuthDb} from '../../models/db/auth-db';

@Injectable()
export class ProtocolService extends ApiService {
    data: ProtocolModel[] = [];
    loadUrl: string = '/protocol';
    dbModelApi: ProtocolModel = new ProtocolModel(this.p, this.db, this.events, this.downloadService);
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
     * @param protocolDefaultService
     */
    constructor(http: HttpClient,
                private p: Platform, private db: DbProvider,
                public authService: AuthService,
                public events: Events,
                public downloadService: DownloadService,
                public appSetting: AppSetting,
                public workflowStepService: WorkflowStepService,
                public protocolDefaultService: ProtocolDefaultService) {
        super(http, events, appSetting);
    }

    getAllProtocols(templateId: number, referenceModel?, referenceId?): Promise <any[]> {
        return new Promise(async (resolve) => {
            const user = await this.authService.getLastUser();
            if (!user) {
                resolve([]);
                return;
            }
            const protocolSearchCondition = [
                this.dbModelApi.secure('protocol_template') + '.' + this.dbModelApi.secure('id') + '=' + templateId,
                'protocol_template.deleted_at IS NULL',
                'protocol_template.local_deleted_at IS NULL'
            ];
            if (!user.isAuthority && user.client_id) {
                protocolSearchCondition.push(
                    this.dbModelApi.secure('protocol_template') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id
                );
            }
            const joinCondition = 'JOIN ' + this.dbModelApi.secure('protocol_template') +
                ' ON ' + this.dbModelApi.secure('protocol_template') + '.' + this.dbModelApi.secure('id') +
                '=' +
                this.dbModelApi.secure('protocol') + '.' + this.dbModelApi.secure('protocol_template_id');
                // +
                // ' JOIN ' + this.dbModelApi.secure('guide') +
                // ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') +
                // '=' +
                // this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id');

            const selectFrom = 'SELECT ' + this.dbModelApi.secure('protocol') + '.*' + ' from ' + this.dbModelApi.secure('protocol');
            const orderBy = 'protocol.local_created_at DESC, protocol.created_at DESC';
            // const groupby = this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure('id');

            const entries: any[] = [];
            this.dbModelApi.searchAllAndGetRowsResult(
                protocolSearchCondition,
                orderBy,
                0,
                joinCondition,
                selectFrom,
                ''
            ).then(async (res) => {
                if (res && res.rows && res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const obj: ProtocolModel = this.newModel();
                        obj.platform = this.dbModelApi.platform;
                        obj.db = this.db;
                        obj.events = this.events;
                        obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
                        obj.workflowStep = await this.workflowStepService.getById(obj.workflow_step_id);
                        obj.canEditProtocol = await this.canEditProtocol(obj);
                        entries.push(obj);
                    }
                }
                resolve(entries);
            }).catch((err) => {
                resolve(entries);
            });
        });
    }

    async getCurrentUser() {
        if (!this.user) {
            this.user = await this.authService.getLastUser();
        }

        return this.user;
    }

    async canEditProtocol(protocol: ProtocolModel) {
        const user = await this.getCurrentUser();
        if (!user) {
            return false;
        }
        if (!protocol.workflowStep) {
            return false;
        }
        const workflowStep = protocol.workflowStep;
        if (workflowStep.type === 'final') {
            return false;
        }
        if (workflowStep.user_id) {
            return workflowStep.user_id === user.userId;
        }
        if (workflowStep.role && user.additionalInfo && user.additionalInfo.roles) {
            return user.additionalInfo.roles.includes(workflowStep.role);
        }

        return false;
    }

    getProtocolFormService(protocolFormTable: string) {
        switch (protocolFormTable) {
            case 'protocol_default':
                return this.protocolDefaultService;
            default:
                return null;
        }
    }

    /**
     * Create a new instance of the service model
     * @returns {ProtocolModel}
     */
    public newModel() {
        return new ProtocolModel(this.p, this.db, this.events, this.downloadService);
    }
}
