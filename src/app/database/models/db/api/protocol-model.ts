import { DbApiModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';
import { ProtocolDefaultModel } from './protocol-default-model';
import { WorkflowStepModel } from './workflow-step-model';
import { ProtocolCommentModel } from './protocol-comment-model';

/**
 * API Db Model for 'Protocol Model'.
 */
export class ProtocolModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'ProtocolModel';
    public apiPk = 'id';
    override loadUrl: string = '/protocol';

    //members
    public client_id: any = null;
    public name: any = null;
    public protocol_template_id: any;
    public workflow_step_id: any;
    public protocol_form_table: any;
    public protocol_form_number: any;
    public local_protocol_form_number: any;
    public reference_model: any = null;
    public reference_id: any = null;
    public creator: any = null;

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
    workflowStep: WorkflowStepModel = new WorkflowStepModel;
    comments: ProtocolCommentModel[] = [];

    canEditProtocol: boolean = false;
    canFillProtocol: boolean = false;

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
    constructor() {
        super();
    }

    getReferenceModelByAlias(referenceModelAlias: any) {
        switch (referenceModelAlias) {
            case 'guide':
                return '\\modules\\guide\\models\\Guide';
            case 'guide_step':
                return '\\modules\\guide\\models\\GuideStep';
            default:
                return null;
        }
    }

    override setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }

    getProtocolFormModel(protocolFormTable: string) {
        if (!protocolFormTable) {
            return new ProtocolDefaultModel();
        }
        switch (protocolFormTable) {
            case 'protocol_default':
                return new ProtocolDefaultModel();
            default:
                return null;
        }
    }

    override async updateLocalRelations() {
        if (!(this as any)[this.COL_ID] || !this.idApi) {
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
                        protocolFormTableModel[ProtocolDefaultModel.COL_LOCAL_PROTOCOL_ID] = (this as any)[this.COL_ID];
                        await protocolFormTableModel.save(false, true);
                    }
                }
            }
        }
    }
}
