import { DbApiModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';
import { WorkflowStepModel } from './workflow-step-model';

/**
 * API Db Model for 'Workflow Model'.
 */
export class WorkflowModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'WorkflowModel';
    public apiPk = 'id';

    public steps: WorkflowStepModel[] = [];

    //members
    public client_id: any = null;
    public name: any = null;

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_NAME = 'name';

    /** @inheritDoc */
    TABLE_NAME: string = 'workflow';

    /** @inheritDoc */
    TABLE: any = [
        [WorkflowModel.COL_CLIENT_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [WorkflowModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
    ];

    /**
     * @inheritDoc
     */
    constructor() {
        super();
    }

    async getSteps() {
        if (this.steps && this.steps.length && (this.steps[0] as any)[WorkflowStepModel.COL_WORKFLOW_ID] === this.idApi) {
            return this.steps;
        }
        const stepModel = new WorkflowStepModel();
        const steps = await stepModel.searchAll([WorkflowStepModel.COL_WORKFLOW_ID, this.idApi]);

        this.steps = steps;

        return steps;
    }

    async getFirstStep() {
        const steps = await this.getSteps();
        console.log('steps', steps);

        if (!steps.length) {
            return null;
        }

        for (let i = 0; i < steps.length; i++) {
            if (steps[i].is_first) {
                return steps[i];
            }
        }

        return null;
    }

    override setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }
}
