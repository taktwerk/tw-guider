import { Platform } from '@ionic/angular';
import { DbApiModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';
import { GuiderModel } from './guider-model';
import { WorkflowTransitionModel } from './workflow-transition-model';
import { LoggerService } from 'src/services/logger-service';
import { MiscService } from 'src/services/misc-service';

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
    TAG: string = 'WorkflowStepModel';
    public apiPk = 'id';

    //members
    public client_id: number = null;
    public name: string;
    public type: string;
    public role: string;
    public user_id: number;
    public assignee: string;
    public is_first: boolean;

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

    public workflowStepNextTransitions: WorkflowTransitionModel[];

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
    constructor(
        public platform: Platform,
        public db: DbProvider,
        public downloadService: DownloadService,
        public loggerService: LoggerService,
        public miscService: MiscService

    ) {
        super(platform, db, downloadService, loggerService, miscService);
    }

    setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }
}
