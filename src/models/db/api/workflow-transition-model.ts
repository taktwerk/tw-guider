import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';

/**
 * API Db Model for 'Workflow Transition Model'.
 */

export class WorkflowTransitionModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'WorkflowTransitionModel';
    public apiPk = 'id';

    //members
    public workflow_step_id: number = null;
    public next_workflow_step_id: number;
    public action_key: string;
    public default_order: number;

    //db columns
    static COL_WORKFLOW_STEP_ID = 'workflow_step_id';
    static COL_NEXT_WORKFLOW_STEP_ID = 'next_workflow_step_id';
    static COL_ACTION_KEY = 'action_key';
    static COL_DEFAULT_ORDER = 'default_order';

    /** @inheritDoc */
    TABLE_NAME: string = 'workflow_transition';

    /** @inheritDoc */
    TABLE: any = [
        [WorkflowTransitionModel.COL_WORKFLOW_STEP_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [WorkflowTransitionModel.COL_NEXT_WORKFLOW_STEP_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [WorkflowTransitionModel.COL_ACTION_KEY, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [WorkflowTransitionModel.COL_DEFAULT_ORDER, 'INT(6)', DbBaseModel.TYPE_NUMBER],
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
}
