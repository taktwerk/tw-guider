import { Platform } from '@ionic/angular';
import { DbApiModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';
import { ProtocolModel } from './protocol-model';
import { WorkflowStepModel } from './workflow-step-model';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { LoggerService } from 'src/services/logger-service';
import { MiscService } from 'src/services/misc-service';

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
    public creator: string = null;

    public body;
    public icon;
    public colour;

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
        public platform: Platform,
        public db: DbProvider,
        public downloadService: DownloadService,
        public loggerService: LoggerService,
        public miscService: MiscService,

    ) {
        super(platform, db, downloadService, loggerService, miscService);
    }

    async getIcon() {
        if (this.comment) {
            return faComment;
        }
        if (this.new_workflow_step_id) {
            const newWorkflowStepModel = new WorkflowStepModel(this.platform, this.db,
                this.downloadService, this.loggerService, this.miscService);
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
            const newWorkflowStepModel = new WorkflowStepModel(this.platform, this.db, this.downloadService, this.loggerService, this.miscService);
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

    async updateLocalRelations() {
        if (!this[this.COL_ID] || !this.idApi) {
            return;
        }

        const protocolModel = new ProtocolModel(this.platform, this.db, this.downloadService, this.loggerService, this.miscService);
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
            const protocolModel = new ProtocolModel(this.platform, this.db, this.downloadService, this.loggerService, this.miscService);
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
