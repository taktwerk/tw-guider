import {Platform, Events} from '@ionic/angular';
import {DbApiModel, FileMapInModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
import {ProtocolModel} from './protocol-model';

/**
 * API Db Model for 'Protocol Default Model'.
 */
export class ProtocolDefaultModel extends DbApiModel {
    /** @inheritDoc */
    loadUrl: string = '/protocol-default';
    TAG: string = 'ProtocolDefaultModel';
    public apiPk = 'id';

    //members
    public protocol_id: number;
    public local_protocol_id: number;

    //db columns
    static COL_PROTOCOL_ID = 'protocol_id';
    static COL_LOCAL_PROTOCOL_ID = 'local_protocol_id';
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
    TABLE_NAME: string = 'protocol_default';

    /** @inheritDoc */
    TABLE: any = [
        [ProtocolDefaultModel.COL_PROTOCOL_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [ProtocolDefaultModel.COL_LOCAL_PROTOCOL_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        /// attached file columns
        [ProtocolDefaultModel.COL_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolDefaultModel.COL_API_PROTOCOL_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolDefaultModel.COL_LOCAL_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        /// thumb attached file columns
        [ProtocolDefaultModel.COL_THUMB_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [ProtocolDefaultModel.COL_API_THUMB_PROTOCOL_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [ProtocolDefaultModel.COL_LOCAL_THUMB_PROTOCOL_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, null, true],
        [ProtocolDefaultModel.COL_PDF_IMAGE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolDefaultModel.COL_API_PDF_IMAGE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [ProtocolDefaultModel.COL_LOCAL_PDF_IMAGE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
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
            },
        },
        {
            name: ProtocolDefaultModel.COL_PDF_IMAGE,
            url: ProtocolDefaultModel.COL_API_PDF_IMAGE_PATH,
            localPath: ProtocolDefaultModel.COL_LOCAL_PDF_IMAGE
        }
    ];

    public migrations = ['AddPdfImageColumnsToProtocolDefaultTableMigration'];

    async updateLocalRelations() {
        if (!this[this.COL_ID] || !this.idApi) {
            return;
        }
        console.log('after check');

        if (this.protocol_id) {
            const protocolModel = new ProtocolModel(this.platform, this.db, this.events, this.downloadService);
            const protocolModels = await protocolModel.findFirst(
                [protocolModel.COL_ID_API, this.protocol_id]
            );
            if (protocolModels && protocolModels.length) {
                const protocol = protocolModels[0];
                if (protocol) {
                    this.local_protocol_id = protocol[protocol.COL_ID];
                    await this.save(false, true);
                    protocol[ProtocolModel.COL_LOCAL_PROTOCOL_FORM_NUMBER] = this[this.COL_ID];
                    await protocol.save(false, true);
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

    /// return additional models for push data to server
    async afterPushDataToServer(isInsert?: boolean) {
        const additionalModelsForPushDataToServer = [];
        if (isInsert) {
            if (!this[this.COL_ID] || !this.idApi) {
                return;
            }
            const protocolModel = new ProtocolModel(this.platform, this.db, this.events, this.downloadService);
            const protocolModels = await protocolModel.findFirst([protocolModel.COL_ID_API, this.protocol_id]);
            if (protocolModels && protocolModels.length) {
                const protocol = protocolModels[0];
                if (protocol) {
                    protocol.protocol_form_number = this.idApi;
                    await protocol.save(false, true);
                    additionalModelsForPushDataToServer.push(protocol);
                }
            }
        }

        return additionalModelsForPushDataToServer;
    }

    /**
     * @inheritDoc
     */
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService) {
        super(platform, db, events, downloadService);
    }
}
