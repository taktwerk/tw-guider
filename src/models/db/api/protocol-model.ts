import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
import {GuiderModel} from './guider-model';

/**
 * API Db Model for 'Protocol Model'.
 */
export class ProtocolModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'ProtocolModel';
    public apiPk = 'id';

    //members
    public client_id: number = null;
    public name: string = null;
    public protocol_template_id: number;
    public workflow_step_id: number;
    public protocol_form_table: string;
    public protocol_form_number: number;

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_PROTOCOL_TEMPLATE_ID = 'protocol_template_id';
    static COL_WORKFLOW_STEP_ID = 'workflow_step_id';
    static COL_NAME = 'name';
    static COL_PROTOCOL_FORM_TABLE = 'protocol_form_table';
    static COL_PROTOCOL_FORM_NUMBER = 'protocol_form_number';

    /** @inheritDoc */
    TABLE_NAME: string = 'protocol';

    /** @inheritDoc */
    TABLE: any = [
        [ProtocolModel.COL_CLIENT_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [ProtocolModel.COL_WORKFLOW_STEP_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolModel.COL_PROTOCOL_TEMPLATE_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [ProtocolModel.COL_PROTOCOL_FORM_TABLE, 'VARCHAR(191)', DbBaseModel.TYPE_STRING],
        [ProtocolModel.COL_PROTOCOL_FORM_NUMBER, 'INT(11)', DbBaseModel.TYPE_NUMBER],
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

    setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }
}
