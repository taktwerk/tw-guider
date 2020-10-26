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
import {ProtocolCommentService} from './protocol-comment-service';

@Injectable()
export class ProtocolService extends ApiService {
    data: ProtocolModel[] = [];
    loadUrl: string = '/protocol';
    dbModelApi: ProtocolModel = new ProtocolModel(this.p, this.db, this.events, this.downloadService);
    user: AuthDb;

    possibleDatabaseNamespaces = [
        'app',
        'taktwerk\\yiiboilerplate'
    ];

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
     * @param protocolCommentService
     */
    constructor(http: HttpClient,
                private p: Platform, private db: DbProvider,
                public authService: AuthService,
                public events: Events,
                public downloadService: DownloadService,
                public appSetting: AppSetting,
                public workflowStepService: WorkflowStepService,
                public protocolDefaultService: ProtocolDefaultService,
                public protocolCommentService: ProtocolCommentService) {
        super(http, events, appSetting);
        this.events.subscribe('user:login', async (userId) => {
            this.user = null;
            await this.getCurrentUser();
        });
    }

    getAllProtocols(templateId: number, referenceModel?, referenceId?): Promise <any[]> {
        return new Promise(async (resolve) => {
            const user = await this.authService.getLastUser();
            if (!user) {
                resolve([]);
                return;
            }
            const protocolSearchCondition = [
                'protocol_template.deleted_at IS NULL',
                'protocol_template.local_deleted_at IS NULL',
                '1=1'
            ];
            if (templateId) {
                protocolSearchCondition.push(
                    this.dbModelApi.secure('protocol_template') + '.' + this.dbModelApi.secure('id') + '=' + templateId
                );
            }

            if (!user.isAuthority && user.client_id) {
                protocolSearchCondition.push(
                    this.dbModelApi.secure('protocol_template') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id
                );
            }
            if (referenceModel && referenceId && this.possibleDatabaseNamespaces.length) {
                let referenceModelQuery = '(';
                for (let i = 0; i < this.possibleDatabaseNamespaces.length; i++) {
                    const referenceModelName = this.possibleDatabaseNamespaces[i] + referenceModel;
                    referenceModelQuery = referenceModelQuery + this.dbModelApi.secure('protocol') + '.' + this.dbModelApi.secure('reference_model') + '= \'' + referenceModelName + '\'';
                    if (this.possibleDatabaseNamespaces.length > 1 && i !== (this.possibleDatabaseNamespaces.length - 1)) {
                        referenceModelQuery = referenceModelQuery + ' OR ';
                    }

                }
                referenceModelQuery = referenceModelQuery + ')';
                protocolSearchCondition.push(
                    referenceModelQuery
                );
                protocolSearchCondition.push(
                    this.dbModelApi.secure('protocol') + '.' + this.dbModelApi.secure('reference_id') + '=' + referenceId
                );
            }
            let joinCondition = 'JOIN ' + this.dbModelApi.secure('protocol_template') +
                ' ON ' + this.dbModelApi.secure('protocol_template') + '.' + this.dbModelApi.secure('id') +
                '=' +
                this.dbModelApi.secure('protocol') + '.' + this.dbModelApi.secure('protocol_template_id') + ' ';

            joinCondition += 'JOIN ' + this.dbModelApi.secure('workflow') +
                ' ON ' + this.dbModelApi.secure('protocol_template') + '.' + this.dbModelApi.secure('workflow_id') +
                '=' +
                this.dbModelApi.secure('workflow') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_ID_API) + ' ';
            joinCondition += 'JOIN ' + this.dbModelApi.secure('workflow_step') +
                ' ON ' + this.dbModelApi.secure('protocol') + '.' + this.dbModelApi.secure('workflow_step_id') +
                '=' +
                this.dbModelApi.secure('workflow_step') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_ID_API) +
                ' AND ' + this.dbModelApi.secure('workflow_step') + '.' + this.dbModelApi.secure('workflow_id') +
                '=' +
                this.dbModelApi.secure('workflow') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_ID_API) + ' ';

            const selectFrom = 'SELECT ' + this.dbModelApi.secure('protocol') + '.*' + ' from ' + this.dbModelApi.secure('protocol');
            const orderBy = 'protocol.local_created_at DESC, protocol.created_at DESC';

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
                        obj.canFillProtocol = await this.canFillProtocol(obj);
                        // obj.comments = await this.getComments(obj);
                        console.log('obj.comments', obj.comments);
                        entries.push(obj);
                    }
                }
                resolve(entries);
            }).catch((err) => {
                this.data = entries;
                resolve(entries);
            });
        });
    }

    unsetProtocolDataList() {
        this.data = [];
    }

    async getCurrentUser() {
        if (!this.user) {
            this.user = await this.authService.getLastUser();
        }

        return this.user;
    }

    async getComments(protocol: ProtocolModel) {
        return this.protocolCommentService.getByProtocolId(protocol[protocol.COL_ID]);
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
        if (user.isAuthority) {
            return true;
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

        return false;
    }

    async canFillProtocol(protocol: ProtocolModel) {
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
        if (user.isAuthority) {
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

        return user.can('protocol_protocol_fill');
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
