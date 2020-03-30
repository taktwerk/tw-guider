import {Platform, Events} from '@ionic/angular';
import {DbApiModel, FileMapInModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';

/**
 * API Db Model for 'Guider Model'.
 */
export class ProtocolTemplateModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'ProtocolTemplateModel';
    public apiPk = 'id';

    //members
    public client_id: number;
    public name: string;
    public workflow_id: number;

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_NAME = 'name';
    static COL_WORKFLOW_ID = 'workflow_id';
    static COL_PROTOCOL_FILE = 'protocol_file';
    static COL_API_PROTOCOL_FILE_PATH = 'protocol_file_path';
    static COL_LOCAL_PROTOCOL_FILE = 'local_protocol_file';
    static COL_THUMB_PROTOCOL_FILE = 'thumb_protocol_file';
    static COL_API_THUMB_PROTOCOL_FILE_PATH = 'thumb_protocol_file_path';
    static COL_LOCAL_THUMB_PROTOCOL_FILE = 'local_thumb_protocol_file';

    /** @inheritDoc */
    TABLE_NAME: string = 'protocol_template';

    /** @inheritDoc */
    TABLE: any = [
        [ProtocolTemplateModel.COL_CLIENT_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolTemplateModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [ProtocolTemplateModel.COL_WORKFLOW_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        /// attached file columns
        [ProtocolTemplateModel.COL_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolTemplateModel.COL_API_PROTOCOL_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolTemplateModel.COL_LOCAL_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        /// thumb attached file columns
        [ProtocolTemplateModel.COL_THUMB_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [ProtocolTemplateModel.COL_API_THUMB_PROTOCOL_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [ProtocolTemplateModel.COL_LOCAL_THUMB_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
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
        }
    ];

    /**
     * @inheritDoc
     */
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService) {
        super(platform, db, events, downloadService);
    }
}
