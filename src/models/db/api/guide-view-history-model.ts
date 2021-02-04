import { Platform, Events } from '@ionic/angular';
import { DbApiModel, FileMapInModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';
import { LoggerService } from 'src/services/logger-service';

export class GuideViewHistoryModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideViewHistoryModel';
    public apiPk = 'id';

    // members
    public client_id: number;
    public user_id: number;
    public guide_id: number;
    public step: number;
    public parent_guide_id: number;

    // db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_USER_ID = 'user_id';
    static COL_GUIDE_ID = 'guide_id';
    static COL_STEP = 'step';
    static COL_PARENT_GUIDE_ID = 'parent_guide_id';

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_view_history';

    /** @inheritDoc */
    TABLE: any = [
        [GuideViewHistoryModel.COL_CLIENT_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideViewHistoryModel.COL_USER_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER, 'user_id'],
        [GuideViewHistoryModel.COL_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideViewHistoryModel.COL_STEP, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideViewHistoryModel.COL_PARENT_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
    ];

    public migrations = ['AddModelColumnsToGuideViewHistoryTableMigration'];

    /**
  * @inheritDoc
  */
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService, public loggerService: LoggerService) {
        super(platform, db, events, downloadService, loggerService);
    }
}