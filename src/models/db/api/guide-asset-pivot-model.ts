import { Platform, Events } from '@ionic/angular';
import { DbApiModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';
import { LoggerService } from 'src/services/logger-service';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuideAssetPivotModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideAssetPivotModel';
    public apiPk = 'id';

    //members
    public guide_id: number;
    public guide_asset_id: number;

    //db columns
    static COL_GUIDE_ID = 'guide_id';
    static COL_GUIDE_ASSET_ID = 'guide_asset_id';

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_asset_pivot';

    /** @inheritDoc */
    TABLE: any = [
        [GuideAssetPivotModel.COL_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideAssetPivotModel.COL_GUIDE_ASSET_ID, 'INT', DbBaseModel.TYPE_NUMBER]
    ];

    /**
     * @inheritDoc
     */
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService, public loggerService: LoggerService) {
        super(platform, db, events, downloadService, loggerService);
    }
}
