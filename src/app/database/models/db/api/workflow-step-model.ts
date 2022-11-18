import { DbApiModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';
import { WorkflowTransitionModel } from './workflow-transition-model';

/**
 * API Db Model for 'Workflow Step Model'.
 */

export enum WorkflowStepTypeEnum {
    input,
    validation,
    final
}

export class WorkflowStepModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'WorkflowStepModel';
    public apiPk = 'id';

    //members
    public client_id: any = null;
    public name: any;
    public type: any;
    public role: any;
    public user_id: any;
    public assignee: any;
    public is_first: any;

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_WORKFLOW_ID = 'workflow_id';
    static COL_NAME = 'name';
    static COL_TYPE = 'type';
    static COL_ROLE = 'role';
    static COL_USER_ID = 'user_id';
    static COL_ASSIGNEE = 'assignee';
    static COL_IS_FRIST = 'is_first';

    /** @inheritDoc */
    TABLE_NAME: string = 'workflow_step';

    public workflowStepNextTransitions: WorkflowTransitionModel[] = [];

    /** @inheritDoc */
    TABLE: any = [
        [WorkflowStepModel.COL_CLIENT_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [WorkflowStepModel.COL_WORKFLOW_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [WorkflowStepModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [WorkflowStepModel.COL_TYPE, 'VARCHAR(30)', DbBaseModel.TYPE_STRING],
        [WorkflowStepModel.COL_ROLE, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [WorkflowStepModel.COL_USER_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [WorkflowStepModel.COL_ASSIGNEE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [WorkflowStepModel.COL_IS_FRIST, 'TINYINT(1) DEFAULT 0', DbBaseModel.TYPE_BOOLEAN],
    ];

    /**
     * @inheritDoc
     */
    constructor() {
        super();
    }

    override setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }
}
