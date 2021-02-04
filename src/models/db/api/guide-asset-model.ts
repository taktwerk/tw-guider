import { Platform, Events } from '@ionic/angular';
import { DbApiModel, FileMapInModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';
import { LoggerService } from 'src/services/logger-service';

export enum GuideAssetModelFileMapIndexEnum {
    ASSET_FILE,
    PDF_FILE_IMAGE
}

/**
 * API Db Model for 'Guider Model'.
 */
export class GuideAssetModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideAssetModel';
    public apiPk = 'id';

    public UNIQUE_PAIR: string = 'UNIQUE(' + this.COL_ID_API + ', ' + GuideAssetModel.COL_CLIENT_ID + ')';

    //members
    public name: string;
    public asset_file: string;
    public asset_html: string;
    public thumb_asset_file: string; //pdf_image
    public client_id: number;

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_NAME = 'name';
    static COL_ASSET_HTML = 'asset_html';
    static COL_ORDER_NUMBER = 'order_number';
    static COL_ASSET_FILE = 'asset_file';
    static COL_API_ASSET_FILE_PATH = 'asset_file_path';
    static COL_LOCAL_ASSET_FILE = 'local_asset_file';
    static COL_PDF_IMAGE = 'thumb_asset_file';
    static COL_API_PDF_IMAGE_PATH = 'thumb_asset_file_path';
    static COL_LOCAL_PDF_IMAGE = 'local_pdf_image';

    public downloadMapping: FileMapInModel[] = [
        {
            name: GuideAssetModel.COL_ASSET_FILE,
            url: GuideAssetModel.COL_API_ASSET_FILE_PATH,
            localPath: GuideAssetModel.COL_LOCAL_ASSET_FILE
        },
        {
            name: GuideAssetModel.COL_PDF_IMAGE,
            url: GuideAssetModel.COL_API_PDF_IMAGE_PATH,
            localPath: GuideAssetModel.COL_LOCAL_PDF_IMAGE
        }
    ];

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_asset';

    /** @inheritDoc */
    TABLE: any = [
        [GuideAssetModel.COL_CLIENT_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
        [GuideAssetModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_ASSET_HTML, 'TEXT', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_ORDER_NUMBER, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideAssetModel.COL_ASSET_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_API_ASSET_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_LOCAL_ASSET_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_PDF_IMAGE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_API_PDF_IMAGE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_LOCAL_PDF_IMAGE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
    ];

    public migrations = ['NewTestMigration'];

    /**
     * @inheritDoc
     */
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService, public loggerService: LoggerService) {
        super(platform, db, events, downloadService, loggerService);
    }

    setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }
}
