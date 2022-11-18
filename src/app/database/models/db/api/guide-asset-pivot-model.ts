import { DbApiModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuideAssetPivotModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'GuideAssetPivotModel';
    public apiPk = 'id';

    //members
    public guide_id: any;
    public guide_asset_id: any;

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
    constructor() {
        super();
    }
}
