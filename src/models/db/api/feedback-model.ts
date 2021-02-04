import { LoggerService } from './../../../services/logger-service';
import { Platform, Events } from '@ionic/angular';
import { DbApiModel, FileMapInModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';

export enum FeedbackModelDownloadMapEnum {
    ATTACHED_FILE
}
/**
 * API Db Model for 'Feedback Model'.
 */
export class FeedbackModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'FeedbackModel';
    public apiPk = 'id';

    //members
    public user_id: number = null;
    public title: string;
    public description: string;
    public reference_model: string = null;
    public feedback_url: string = '';
    public status = 'Open';
    public reference_id: number = null;
    public attached_file: string;
    public local_attached_file: string;
    public local_thumb_attached_file: string;
    public client_id: number;

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

    public downloadMapping: FileMapInModel[] = [
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
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService, public loggerService: LoggerService) {
        super(platform, db, events, downloadService, loggerService);
    }

    public isOpenStatus() {
        return this.status === 'Open';
    }

    getReferenceModelByAlias(referenceModelAlias) {
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
