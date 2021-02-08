import { LoggerService } from './../../../services/logger-service';
import { Platform, Events } from '@ionic/angular';
import { DbApiModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';
import { WorkflowStepModel } from './workflow-step-model';

/**
 * API Db Model for 'Workflow Model'.
 */
export class WorkflowModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'WorkflowModel';
    public apiPk = 'id';

    public steps: WorkflowStepModel[];

    //members
    public client_id: number = null;
    public name: string = null;

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
    constructor(
        public platform: Platform,
        public db: DbProvider,
        public events: Events,
        public downloadService: DownloadService,
        public loggerService: LoggerService
    ) {
        super(platform, db, events, downloadService, loggerService);
    }

    async getSteps() {
        if (this.steps && this.steps.length && this.steps[0][WorkflowStepModel.COL_WORKFLOW_ID] === this.idApi) {
            return this.steps;
        }
        const stepModel = new WorkflowStepModel(this.platform, this.db, this.events, this.downloadService,    this.loggerService);
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

    setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }
}
