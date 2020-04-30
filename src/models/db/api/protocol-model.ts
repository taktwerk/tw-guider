import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
import {ProtocolDefaultModel} from './protocol-default-model';
import {WorkflowStepModel} from './workflow-step-model';
import {ProtocolCommentModel} from './protocol-comment-model';

/**
 * API Db Model for 'Protocol Model'.
 */
export class ProtocolModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'ProtocolModel';
    public apiPk = 'id';
    loadUrl: string = '/protocol';

    //members
    public client_id: number = null;
    public name: string = null;
    public protocol_template_id: number;
    public workflow_step_id: number;
    public protocol_form_table: string;
    public protocol_form_number: number;
    public local_protocol_form_number: number;
    public reference_model: string = null;
    public reference_id: number = null;
    public creator: string = null;

    //db columns
    static COL_CREATOR = 'creator';
    static COL_CLIENT_ID = 'client_id';
    static COL_PROTOCOL_TEMPLATE_ID = 'protocol_template_id';
    static COL_WORKFLOW_STEP_ID = 'workflow_step_id';
    static COL_NAME = 'name';
    static COL_PROTOCOL_FORM_TABLE = 'protocol_form_table';
    static COL_PROTOCOL_FORM_NUMBER = 'protocol_form_number';
    static COL_LOCAL_PROTOCOL_FORM_NUMBER = 'local_protocol_form_number';
    static COL_REFERENCE_MODEL = 'reference_model';
    static COL_REFERNCE_ID = 'reference_id';

    /** @inheritDoc */
    TABLE_NAME: string = 'protocol';

    /// relations
    workflowStep: WorkflowStepModel;
    comments: ProtocolCommentModel[];

    canEditProtocol: boolean;
    canFillProtocol: boolean;

    /** @inheritDoc */
    TABLE: any = [
        [ProtocolModel.COL_CREATOR, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolModel.COL_CLIENT_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [ProtocolModel.COL_WORKFLOW_STEP_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolModel.COL_PROTOCOL_TEMPLATE_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [ProtocolModel.COL_PROTOCOL_FORM_TABLE, 'VARCHAR(191)', DbBaseModel.TYPE_STRING],
        [ProtocolModel.COL_PROTOCOL_FORM_NUMBER, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolModel.COL_LOCAL_PROTOCOL_FORM_NUMBER, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolModel.COL_REFERENCE_MODEL, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolModel.COL_REFERNCE_ID, 'INT', DbBaseModel.TYPE_NUMBER]
    ];

    /**
     * @inheritDoc
     */
    constructor(
        public platform: Platform,
        public db: DbProvider,
        public events: Events,
        public downloadService: DownloadService
    ) {
        super(platform, db, events, downloadService);
    }

    getReferenceModelByAlias(referenceModelAlias) {
        switch (referenceModelAlias) {
            case 'guide':
                return 'app\\modules\\guide\\models\\Guide';
            case 'guide_step':
                return 'app\\modules\\guide\\models\\GuideStep';
            default:
                return null;
        }
    }

    setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }

    getProtocolFormModel(protocolFormTable: string) {
        if (!protocolFormTable) {
            return new ProtocolDefaultModel(this.platform, this.db, this.events, this.downloadService);
        }
        switch (protocolFormTable) {
            case 'protocol_default':
                return new ProtocolDefaultModel(this.platform, this.db, this.events, this.downloadService);
            default:
                return null;
        }
    }

    async updateLocalRelations() {
        console.log('protocol update local relations');
        if (!this[this.COL_ID] || !this.idApi) {
            return;
        }

        if (this.protocol_form_table && this.protocol_form_number) {
            const protocolFormModel = this.getProtocolFormModel(this.protocol_form_table);
            if (protocolFormModel) {
                const protocolFormTableModels = await protocolFormModel.findFirst(
                    [protocolFormModel.COL_ID_API, this.protocol_form_number]
                );
                if (protocolFormTableModels && protocolFormTableModels.length) {
                    const protocolFormTableModel = protocolFormTableModels[0];
                    if (protocolFormTableModel) {
                        this.local_protocol_form_number = protocolFormTableModel[protocolFormTableModel.COL_ID];
                        await this.save(false, true);
                        protocolFormTableModel[ProtocolDefaultModel.COL_LOCAL_PROTOCOL_ID] = this[this.COL_ID];
                        await protocolFormTableModel.save(false, true);
                    }
                }
            }
        }
    }
}
