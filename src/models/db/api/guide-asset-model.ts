import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
/**
 * API Db Model for 'Guider Model'.
 */
export class GuideAssetModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideAssetModel';
    public apiPk = 'id';

    public UNIQUE_PAIR: string = 'UNIQUE(' + this.COL_ID_API + ', ' + GuideAssetModel.COL_USER_ID + ')';

    //members
    public user_id: number = null;
    public name: string;
    public asset_file: string;
    public asset_html: string;
    public pdf_image: string;

    //db columns
    static COL_USER_ID = 'user_id';
    static COL_NAME = 'name';
    static COL_ASSET_HTML = 'asset_html';
    static COL_ORDER_NUMBER = 'order_number';
    static COL_ASSET_FILE = 'asset_file';
    static COL_API_ASSET_FILE_PATH = 'asset_file_path';
    static COL_LOCAL_ASSET_FILE = 'local_asset_file';
    static COL_PDF_IMAGE = 'pdf_image';
    static COL_API_PDF_IMAGE_PATH = 'pdf_image_path';
    static COL_LOCAL_PDF_IMAGE = 'local_pdf_image';

    public downloadMapping: any = [
        [
            GuideAssetModel.COL_ASSET_FILE,
            GuideAssetModel.COL_API_ASSET_FILE_PATH,
            GuideAssetModel.COL_LOCAL_ASSET_FILE
        ],
        [
            GuideAssetModel.COL_PDF_IMAGE,
            GuideAssetModel.COL_API_PDF_IMAGE_PATH,
            GuideAssetModel.COL_LOCAL_PDF_IMAGE
        ]
    ];

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_asset';

    /** @inheritDoc */
    TABLE: any = [
        [GuideAssetModel.COL_USER_ID, 'INT', DbBaseModel.TYPE_NUMBER],
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

    /**
     * @inheritDoc
     */
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService) {
        super(platform, db, events, downloadService);
    }

    public getLocalFilePath() {
        return this[GuideAssetModel.COL_LOCAL_ASSET_FILE];
    }

    public getApiFilePath() {
        return this[GuideAssetModel.COL_ASSET_FILE];
    }

    public getLocalPdfImageFilePath() {
        return this[GuideAssetModel.COL_LOCAL_PDF_IMAGE];
    }

    public getApiPdfImageFilePath() {
        return this[GuideAssetModel.COL_PDF_IMAGE];
    }

    public isFile() {
        return !!this[GuideAssetModel.COL_ASSET_FILE];
    }

    public isPdf() {
        if (!this.isFile()) {
            return false;
        }
        const apiFilePath = this.getApiFilePath();

        return apiFilePath.indexOf('.pdf') > -1;
    }

    public getPdf() {
        if (this[GuideAssetModel.COL_LOCAL_PDF_IMAGE]) {
            return this.downloadService.webview.convertFileSrc(this[GuideAssetModel.COL_LOCAL_PDF_IMAGE]);
        } else {
            return this.defaultImage;
        }
    }

    public getAssetFile() {
        if (this[GuideAssetModel.COL_LOCAL_ASSET_FILE]) {
            return this.downloadService.webview.convertFileSrc(this[GuideAssetModel.COL_LOCAL_ASSET_FILE]);
        } else {
            return this.defaultImage;
        }
    }

    setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['user_id', this.user_id]);
    }
}
