import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
import {ProtocolDefaultModel} from './protocol-default-model';
import {ProtocolModel} from './protocol-model';

/**
 * API Db Model for 'Workflow Transition Model'.
 */

export class ProtocolCommentModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'ProtocolCommentModel';
    public apiPk = 'id';

    //members
    public protocol_id: number = null;
    public local_protocol_id: number = null;
    public comment: string;
    public event: string;
    public name: string;
    public old_workflow_step_id: number = null;
    public new_workflow_step_id: number = null;

    //db columns
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
        public platform: Platform,
        public db: DbProvider,
        public events: Events,
        public downloadService: DownloadService
    ) {
        super(platform, db, events, downloadService);
    }

    async updateLocalRelations() {
        if (!this[this.COL_ID] || !this.idApi) {
            return;
        }

        const protocolModel = new ProtocolModel(this.platform, this.db, this.events, this.downloadService);
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

    async beforePushDataToServer(isInsert?: boolean) {
        if (isInsert) {
            if (!this[this.COL_ID]) {
                return;
            }
            const protocolModel = new ProtocolModel(this.platform, this.db, this.events, this.downloadService);
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
