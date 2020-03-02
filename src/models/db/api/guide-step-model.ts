import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
import {WebView} from '@ionic-native/ionic-webview/ngx';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuideStepModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideStepModel';
    public apiPk = 'id';

    //members
    public guide_id: number;
    public order_number: number;
    public title: string;
    public description_html: string;
    public attached_file: string;
    public local_attached_file: string;

    //db columns
    static COL_GUIDE_ID = 'guide_id';
    static COL_ORDER_NUMBER = 'order_number';
    static COL_TITLE = 'title';
    static COL_DESCRIPTION_HTML = 'description_html';
    static COL_ATTACHED_FILE = 'attached_file';
    static COL_API_ATTACHED_FILE_PATH = 'attached_file_path';
    static COL_LOCAL_ATTACHED_FILE = 'local_attached_file';
    static COL_THUMB_ATTACHED_FILE = 'thumb_attached_file';
    static COL_API_THUMB_ATTACHED_FILE_PATH = 'thumb_attached_file_path';
    static COL_LOCAL_THUMB_ATTACHED_FILE = 'local_thumb_attached_file';

    public downloadMapping: any = [
        [
            // Name of the file
            GuideStepModel.COL_ATTACHED_FILE,
            // Url of the file
            GuideStepModel.COL_API_ATTACHED_FILE_PATH,
            // Local path
            GuideStepModel.COL_LOCAL_ATTACHED_FILE
        ],
        [
            // Name of the file
            GuideStepModel.COL_THUMB_ATTACHED_FILE,
            // Url of the file
            GuideStepModel.COL_API_THUMB_ATTACHED_FILE_PATH,
            // Local path
            GuideStepModel.COL_LOCAL_THUMB_ATTACHED_FILE
        ]
    ];

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_step';

    /** @inheritDoc */
    TABLE: any = [
        [GuideStepModel.COL_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideStepModel.COL_ORDER_NUMBER, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideStepModel.COL_TITLE, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [GuideStepModel. COL_DESCRIPTION_HTML, 'TEXT', DbBaseModel.TYPE_STRING],
        /// attached file columns
        [GuideStepModel.COL_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_API_ATTACHED_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_LOCAL_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        /// thumb attached file columns
        [GuideStepModel.COL_THUMB_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_API_THUMB_ATTACHED_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_LOCAL_THUMB_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
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

    public getApiThumbFilePath() {
        return this[GuideStepModel.COL_THUMB_ATTACHED_FILE];
    }

    public getAttachedFileImagePath() {
        if (!this[GuideStepModel.COL_LOCAL_ATTACHED_FILE]) {
            return this.defaultImage;
        }
        let imageName = null;

        if (this.isImageAttachedFile()) {
            imageName = this.getApiFilePath();
        } else if (this.isExistThumbOfFile()) {
            imageName = this.getApiThumbFilePath();
        } else {
            return null;
        }

        return this.downloadService.getSanitizedFileUrl(imageName, this.TABLE_NAME);
    }

    public isExistThumbOfFile() {
        return !!this[GuideStepModel.COL_LOCAL_THUMB_ATTACHED_FILE];
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
