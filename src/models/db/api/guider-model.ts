import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
import {WebView} from '@ionic-native/ionic-webview/ngx';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuiderModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuiderModel';
    public apiPk = 'id';

    //members
    public client_id: number;
    public short_name: string;
    public title: string;
    public description: string;
    public preview_file: string;
    public revision_term: string;
    public revision_counter: number;
    public duration: number;
    public template_id: number;
    public protocol_template_id: number;

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_SHORT_NAME = 'short_name';
    static COL_TITLE = 'title';
    static COL_DESCRIPTION = 'description';
    static COL_PREVIEW_FILE = 'preview_file';
    static COL_API_PREVIEW_FILE_PATH = 'preview_file_path';
    static COL_LOCAL_PREVIEW_FILE = 'local_preview_file';
    static COL_REVISION_TERM = 'revision_term';
    static COL_REVISION_COUNTER = 'revision_counter';
    static COL_DURATION = 'duration';
    static COL_TEMPLATE_ID = 'template_id';
    static COL_PROTOCOL_TEMPLATE_ID = 'protocol_template_id';

    public downloadMapping: any = [
        [
            // Name of the file
            GuiderModel.COL_PREVIEW_FILE,
            // Url of the file
            GuiderModel.COL_API_PREVIEW_FILE_PATH,
            // Local path
            GuiderModel.COL_LOCAL_PREVIEW_FILE
        ]
    ];

    /** @inheritDoc */
    TABLE_NAME: string = 'guide';

    /** @inheritDoc */
    TABLE: any = [
        [GuiderModel.COL_CLIENT_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuiderModel.COL_SHORT_NAME, 'VARCHAR(4)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_TITLE, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [GuiderModel. COL_DESCRIPTION, 'TEXT', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_PREVIEW_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_API_PREVIEW_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_LOCAL_PREVIEW_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_REVISION_TERM, 'VARCHAR(10)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_REVISION_COUNTER, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuiderModel.COL_DURATION, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuiderModel.COL_TEMPLATE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuiderModel.COL_PROTOCOL_TEMPLATE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
    ];

    /**
     * @inheritDoc
     */
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService) {
        super(platform, db, events, downloadService);
    }

    /**
     * Get short description
     * @returns {string}
     */
    public getDescription(): string {
        return this.description.replace(/\n/g, "<br />");
    }

    public getByCategory() {
        return [
            {description: 'America', title: 'Title'},
            {description: 'Guide description', title: 'Guider'}
        ];
    }

    public getDuration() {
        const days = Math.floor(this.duration / 1440);
        const hours = Math.floor((this.duration - days * 1440) / 60);
        const minutes = Math.floor(this.duration - (days * 1440) - (hours * 60));

        const day = days;
        const hour = (days >= 1 ? ' ' : '') + hours;
        const minute = (hours >= 1 ? ' ' : '') + minutes;

        const dayString = days >= 1 ? (day + ' ' + (day >= 2 ? 'days' : 'day')) : '';
        const hourString = hours >= 1 ? hour + 'h' : '';
        const minuteString = minutes >= 1 ? minute + 'min' : '';

        return `${dayString}${hourString}${minuteString}`;
    }

    public getImage() {
        if (this[GuiderModel.COL_LOCAL_PREVIEW_FILE]) {
            return this.downloadService.webview.convertFileSrc(this[GuiderModel.COL_LOCAL_PREVIEW_FILE]);
        } else {
            return this[GuiderModel.COL_API_PREVIEW_FILE_PATH];
        }
    }
}
