import { DbApiModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';
import { ProtocolModel } from './protocol-model';
import { WorkflowStepModel } from './workflow-step-model';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


/**
 * API Db Model for 'Workflow Transition Model'.
 */

export class ProtocolCommentModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'ProtocolCommentModel';
    public apiPk = 'id';

    //members
    public protocol_id: any = null;
    public local_protocol_id: any = null;
    public comment: any;
    public event: any;
    public name: any;
    public old_workflow_step_id: any = null;
    public new_workflow_step_id: any = null;
    public creator: any = null;

    public body: any;
    public icon: any;
    public colour: any;

    //db columns
    static COL_CREATOR = 'creator';
    static COL_PROTOCOL_ID = 'protocol_id';
    static COL_LOCAL_PROTOCOL_ID = 'local_protocol_id';
    static COL_OLD_WORKFLOW_STEP_ID = 'old_workflow_step_id';
    static COL_NEW_WORKFLOW_STEP_ID = 'new_workflow_step_id';
    static COL_COMMENT = 'comment';
    static COL_EVENT = 'event';
    static COL_NAME = 'name';

    /** @inheritDoc */
    TABLE_NAME: string = 'protocol_comment';

    /** @inheritDoc */
    TABLE: any = [
        [ProtocolCommentModel.COL_CREATOR, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolCommentModel.COL_PROTOCOL_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolCommentModel.COL_LOCAL_PROTOCOL_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolCommentModel.COL_COMMENT, 'TEXT', DbBaseModel.TYPE_STRING],
        [ProtocolCommentModel.COL_EVENT, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [ProtocolCommentModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [ProtocolCommentModel.COL_OLD_WORKFLOW_STEP_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolCommentModel.COL_NEW_WORKFLOW_STEP_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER]
    ];

    /**
     * @inheritDoc
     */
    constructor(
    ) {
        super();
    }

    async getIcon() {
        if (this.comment) {
            return faComment;
        }
        if (this.new_workflow_step_id) {
            const newWorkflowStepModel = new WorkflowStepModel();
            const newWorkflowStepSearchResult = await newWorkflowStepModel.findFirst(
                [newWorkflowStepModel.COL_ID_API, this.new_workflow_step_id]
            );
            if (newWorkflowStepSearchResult.length) {
                const newWorkflowStep = newWorkflowStepSearchResult[0];
                if (newWorkflowStep.type === 'final') {
                    return faCheck;
                }
            }
        }

        return faArrowAltCircleRight;
    }

    async getColour() {
        if (this.new_workflow_step_id) {
            const newWorkflowStepModel = new WorkflowStepModel();
            const newWorkflowStepSearchResult = await newWorkflowStepModel.findFirst(
                [newWorkflowStepModel.COL_ID_API, this.new_workflow_step_id]
            );
            if (newWorkflowStepSearchResult.length) {
                const newWorkflowStep = newWorkflowStepSearchResult[0];
                if (newWorkflowStep.type === 'final') {
                    return '#0073b7';
                }
            }
        }

        if (this.comment) {
            return '#f39c12';
        }

        return '#00a65a';
    }

    override async updateLocalRelations() {
        if (!(this as any)[this.COL_ID] || !this.idApi) {
            return;
        }

        const protocolModel = new ProtocolModel();
        if (protocolModel) {
            const protocolModels = await protocolModel.findFirst(
                [protocolModel.COL_ID_API, this.protocol_id]
            );
            console.log('protocol-commnet model protocolModels', protocolModels);
            if (protocolModels && protocolModels.length) {
                const protocol = protocolModels[0];
                if (protocol) {
                    this.local_protocol_id = protocol[protocol.COL_ID];
                    await this.save(false, true);
                }
            }
        }
    }

    override async beforePushDataToServer(isInsert?: boolean) {
        if (isInsert) {
            if (!(this as any)[this.COL_ID]) {
                return;
            }
            const protocolModel = new ProtocolModel();
            const protocolModels = await protocolModel.findFirst([protocolModel.COL_ID, this.local_protocol_id]);
            if (protocolModels && protocolModels.length) {
                const protocol = protocolModels[0];
                if (protocol) {
                    this.protocol_id = protocol.idApi;
                    await this.save(false, false);
                }
            }
        }
    }
}
