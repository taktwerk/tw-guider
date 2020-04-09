import {Platform, Events} from '@ionic/angular';
import {DbApiModel, FileMapInModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';

/**
 * API Db Model for 'Protocol Default Model'.
 */
export class ProtocolDefaultModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'ProtocolDefaultModel';
    public apiPk = 'id';

    //members
    public protocol_id: number;

    //db columns
    static COL_PROTOCOL_ID = 'protocol_id';
    static COL_PROTOCOL_FILE = 'protocol_file';
    static COL_API_PROTOCOL_FILE_PATH = 'protocol_file_path';
    static COL_LOCAL_PROTOCOL_FILE = 'local_protocol_file';
    static COL_THUMB_PROTOCOL_FILE = 'thumb_protocol_file';
    static COL_API_THUMB_PROTOCOL_FILE_PATH = 'thumb_protocol_file_path';
    static COL_LOCAL_THUMB_PROTOCOL_FILE = 'local_thumb_protocol_file';

    /** @inheritDoc */
    TABLE_NAME: string = 'protocol_default';

    /** @inheritDoc */
    TABLE: any = [
        [ProtocolDefaultModel.COL_PROTOCOL_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        /// attached file columns
        [ProtocolDefaultModel.COL_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolDefaultModel.COL_API_PROTOCOL_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolDefaultModel.COL_LOCAL_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        /// thumb attached file columns
        [ProtocolDefaultModel.COL_THUMB_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [ProtocolDefaultModel.COL_API_THUMB_PROTOCOL_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [ProtocolDefaultModel.COL_LOCAL_THUMB_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
    ];

    public downloadMapping: FileMapInModel[] = [
        {
            name: ProtocolDefaultModel.COL_PROTOCOL_FILE,
            url: ProtocolDefaultModel.COL_API_PROTOCOL_FILE_PATH,
            localPath: ProtocolDefaultModel.COL_LOCAL_PROTOCOL_FILE,
            thumbnail: {
                name: ProtocolDefaultModel.COL_THUMB_PROTOCOL_FILE,
                url: ProtocolDefaultModel.COL_API_THUMB_PROTOCOL_FILE_PATH,
                localPath: ProtocolDefaultModel.COL_LOCAL_THUMB_PROTOCOL_FILE
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
