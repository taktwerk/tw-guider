import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
import {GuideStepModel} from './guide-step-model';
import {GuideAssetModel} from './guide-asset-model';

/**
 * API Db Model for 'Guider Model'.
 */
export class FeedbackModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'FeedbackModel';
    public apiPk = 'id';

    //members
    public user_id: number = null;
    public title: string;
    public description: string;

    //db columns
    static COL_USER_ID = 'user_id';
    static COL_TITLE = 'title';
    static COL_DESCRIPTION = 'description';

    /** @inheritDoc */
    TABLE_NAME: string = 'feedback';

    /** @inheritDoc */
    TABLE: any = [
        [FeedbackModel.COL_USER_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [FeedbackModel.COL_TITLE, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [FeedbackModel. COL_DESCRIPTION, 'TEXT', DbBaseModel.TYPE_STRING],
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
}
