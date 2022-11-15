import { DbApiModel, FileMapInModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';
import { WorkflowModel } from './workflow-model';

/**
 * API Db Model for 'Protocol Template Model'.
 */
export class ProtocolTemplateModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'ProtocolTemplateModel';
    public apiPk = 'id';

    //members
    public client_id: number;
    public name: string;
    public workflow_id: number;
    public protocol_form_table: string;

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_NAME = 'name';
    static COL_WORKFLOW_ID = 'workflow_id';
    static COL_PROTOCOL_FORM_TABLE = 'protocol_form_table';
    static COL_PROTOCOL_FILE = 'protocol_file';
    static COL_API_PROTOCOL_FILE_PATH = 'protocol_file_path';
    static COL_LOCAL_PROTOCOL_FILE = 'local_protocol_file';
    static COL_THUMB_PROTOCOL_FILE = 'thumb_protocol_file';
    static COL_API_THUMB_PROTOCOL_FILE_PATH = 'thumb_protocol_file_path';
    static COL_LOCAL_THUMB_PROTOCOL_FILE = 'local_thumb_protocol_file';
    static COL_PDF_IMAGE = 'pdf_image';
    static COL_API_PDF_IMAGE_PATH = 'pdf_image_path';
    static COL_LOCAL_PDF_IMAGE = 'local_pdf_image';

    /** @inheritDoc */
    TABLE_NAME: string = 'protocol_template';

    workflow: WorkflowModel;

    /** @inheritDoc */
    TABLE: any = [
        [ProtocolTemplateModel.COL_CLIENT_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolTemplateModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [ProtocolTemplateModel.COL_WORKFLOW_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolTemplateModel.COL_PROTOCOL_FORM_TABLE, 'VARCHAR(191)', DbBaseModel.TYPE_STRING],
        /// attached file columns
        [ProtocolTemplateModel.COL_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolTemplateModel.COL_API_PROTOCOL_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolTemplateModel.COL_LOCAL_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        /// thumb attached file columns
        [ProtocolTemplateModel.COL_THUMB_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [ProtocolTemplateModel.COL_API_THUMB_PROTOCOL_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [ProtocolTemplateModel.COL_LOCAL_THUMB_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        /// pdf images
        [ProtocolTemplateModel.COL_PDF_IMAGE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolTemplateModel.COL_API_PDF_IMAGE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolTemplateModel.COL_LOCAL_PDF_IMAGE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
    ];

    public downloadMapping: FileMapInModel[] = [
        {
            name: ProtocolTemplateModel.COL_PROTOCOL_FILE,
            url: ProtocolTemplateModel.COL_API_PROTOCOL_FILE_PATH,
            localPath: ProtocolTemplateModel.COL_LOCAL_PROTOCOL_FILE,
            thumbnail: {
                name: ProtocolTemplateModel.COL_THUMB_PROTOCOL_FILE,
                url: ProtocolTemplateModel.COL_API_THUMB_PROTOCOL_FILE_PATH,
                localPath: ProtocolTemplateModel.COL_LOCAL_THUMB_PROTOCOL_FILE
            }
        },
        {
            name: ProtocolTemplateModel.COL_PDF_IMAGE,
            url: ProtocolTemplateModel.COL_API_PDF_IMAGE_PATH,
            localPath: ProtocolTemplateModel.COL_LOCAL_PDF_IMAGE
        }
    ];

    async getWorkflow() {
        console.log('this.workflow_id', this.workflow_id);
        if (!this.workflow_id) {
            return;
        }
        if (this.workflow && this.workflow[this.COL_ID_API] === this.workflow_id) {
            return this.workflow;
        }
        const workflowModel = new WorkflowModel();
        const workflows = await workflowModel.findFirst([workflowModel.COL_ID_API, this.workflow_id]);

        this.workflow = workflows.length ? workflows[0] : null;

        return this.workflow;
    }

    /**
     * @inheritDoc
     */
    constructor() {
        super();
    }
}
