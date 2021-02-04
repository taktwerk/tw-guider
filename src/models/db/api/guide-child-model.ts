import { Platform, Events } from '@ionic/angular';
import { DbApiModel, FileMapInModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';
import { LoggerService } from 'src/services/logger-service';

/**
 * API Db Model for 'Guide Child Model'.
 */
export class GuideChildModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideChildModel';
    public apiPk = 'id';

    //members
    public parent_guide_id: number;
    public guide_id: number;
    public order_number: number;

    //db columns
    static COL_PARENT_GUIDE_ID = 'parent_guide_id';
    static COL_GUIDE_ID = 'guide_id';
    static COL_ORDER_NUMBER = 'order_number';

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_child';

    /** @inheritDoc */
    TABLE: any = [
        [GuideChildModel.COL_PARENT_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideChildModel.COL_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideChildModel.COL_ORDER_NUMBER, 'INT', DbBaseModel.TYPE_NUMBER]
    ];

    /**
     * @inheritDoc
     */
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService, public loggerService: LoggerService) {
        super(platform, db, events, downloadService, loggerService);
    }
}
