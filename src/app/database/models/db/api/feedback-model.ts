import { DbApiModel, FileMapInModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';

export enum FeedbackModelDownloadMapEnum {
    ATTACHED_FILE
}
/**
 * API Db Model for 'Feedback Model'.
 */
export class FeedbackModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'FeedbackModel';
    public apiPk = 'id';

    //members
    public user_id: any = null;
    public title: any;
    public description: any;
    public reference_model: any = null;
    public feedback_url: any = '';
    public status = 'Open';
    public reference_id: any = null;
    public attached_file: any;
    public override attached_file_path: any;
    public local_attached_file: any;
    public local_thumb_attached_file: any;
    public client_id: any;

    //db columns
    static COL_TITLE = 'title';
    static COL_DESCRIPTION = 'description';
    static COL_CLIENT_ID = 'client_id';
    static COL_REFERENCE_MODEL = 'reference_model';
    static COL_FEEDBACK_URL = 'feedback_url';
    static COL_STATUS = 'status';
    static COL_REFERNCE_ID = 'reference_id';
    static COL_USER_ID = 'user_id';
    static COL_ATTACHED_FILE = 'attached_file';
    static COL_ATTACHED_FILE_PATH = 'attached_file_path';
    static COL_LOCAL_ATTACHED_FILE = 'local_attached_file';
    static COL_THUMB_ATTACHED_FILE = 'thumb_attached_file';
    static COL_API_THUMB_ATTACHED_FILE_PATH = 'thumb_attached_file_path';
    static COL_LOCAL_THUMB_ATTACHED_FILE = 'local_thumb_attached_file';

    /** @inheritDoc */
    TABLE_NAME: string = 'feedback';

    /** @inheritDoc */
    TABLE: any = [
        [FeedbackModel.COL_CLIENT_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [FeedbackModel.COL_USER_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER, 'user_id'],
        [FeedbackModel.COL_TITLE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [FeedbackModel.COL_DESCRIPTION, 'TEXT', DbBaseModel.TYPE_STRING],
        [FeedbackModel.COL_REFERENCE_MODEL, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [FeedbackModel.COL_FEEDBACK_URL, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, 'feedback_url'],
        [FeedbackModel.COL_STATUS, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, 'status'],
        [FeedbackModel.COL_REFERNCE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        /// attached file columns
        [FeedbackModel.COL_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [FeedbackModel.COL_ATTACHED_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [FeedbackModel.COL_LOCAL_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        /// thumb attached file columns
        [FeedbackModel.COL_THUMB_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [FeedbackModel.COL_API_THUMB_ATTACHED_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [FeedbackModel.COL_LOCAL_THUMB_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
    ];

    public override downloadMapping: FileMapInModel[] = [
        {
            name: FeedbackModel.COL_ATTACHED_FILE,
            url: FeedbackModel.COL_ATTACHED_FILE_PATH,
            localPath: FeedbackModel.COL_LOCAL_ATTACHED_FILE,

            thumbnail: {
                name: FeedbackModel.COL_THUMB_ATTACHED_FILE,
                url: FeedbackModel.COL_API_THUMB_ATTACHED_FILE_PATH,
                localPath: FeedbackModel.COL_LOCAL_THUMB_ATTACHED_FILE
            }
        }
    ];

    /**
     * @inheritDoc
     */
    constructor() {
        super();
    }

    public isOpenStatus() {
        return this.status === 'Open';
    }

    getReferenceModelByAlias(referenceModelAlias: any) {
        switch (referenceModelAlias) {
            case 'guide':
                return '\\modules\\guide\\models\\Guide';
            case 'guide_step':
                return '\\modules\\guide\\models\\GuideStep';
            default:
                return null;
        }
    }
}
