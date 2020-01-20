import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
import {WebView} from '@ionic-native/ionic-webview/ngx';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuideAssetModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideAssetModel';
    public apiPk = 'id';

    //members
    public client_id: number;
    public order_number: number;
    public title: string;
    public description_html: string;
    public attached_file: string;

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_NAME = 'name';
    static COL_ASSET_HTML = 'asset_html';
    static COL_ORDER_NUMBER = 'order_number';
    static COL_ATTACHED_FILE = 'attached_file';
    static COL_API_ATTACHED_FILE_PATH = 'attached_file_path';
    static COL_LOCAL_ATTACHED_FILE = 'local_attached_file';

    public downloadMapping: any = [
        [
            // Name of the file
            GuideAssetModel.COL_ATTACHED_FILE,
            // Url of the file
            GuideAssetModel.COL_API_ATTACHED_FILE_PATH,
            // Local path
            GuideAssetModel.COL_LOCAL_ATTACHED_FILE
        ]
    ];

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_step';

    /** @inheritDoc */
    TABLE: any = [
        [GuideAssetModel.COL_CLIENT_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideAssetModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [GuideAssetModel. COL_ASSET_HTML, 'TEXT', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_ORDER_NUMBER, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideAssetModel.COL_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_API_ATTACHED_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideAssetModel.COL_LOCAL_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
    ];

    /**
     * @inheritDoc
     */
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService) {
        super(platform, db, events, downloadService);
    }

    public getLocalFilePath() {
        return this[GuideStepModel.COL_LOCAL_ATTACHED_FILE];
    }

    public getApiFilePath() {
        return this[GuideStepModel.COL_ATTACHED_FILE];
    }

    public getFile() {
        if (this[GuideStepModel.COL_LOCAL_ATTACHED_FILE]) {
            return this.downloadService.webview.convertFileSrc(this[GuideStepModel.COL_LOCAL_ATTACHED_FILE]);
        } else {
            return this[GuideStepModel.COL_API_ATTACHED_FILE_PATH];
        }
    }

    public isVideoAttachedFile() {
        const localFilePath = this.getLocalFilePath();
        const apiFilePath = this.getApiFilePath();

        return (localFilePath && (localFilePath.indexOf('.MOV') > -1 || localFilePath.indexOf('.mp4') > -1)) ||
            (apiFilePath && (apiFilePath.indexOf('.MOV') > -1 || apiFilePath.indexOf('.mp4') > -1));
    }

    public isImageAttachedFile() {
        const localFilePath = this.getLocalFilePath();
        const apiFilePath = this.getApiFilePath();

        return (localFilePath && (localFilePath.indexOf('.jpg') > -1 || localFilePath.indexOf('.png') > -1)) ||
            (apiFilePath && (apiFilePath.indexOf('.jpg') > -1 || apiFilePath.indexOf('.png') > -1));
    }
}
