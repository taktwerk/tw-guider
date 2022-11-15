import { DbApiModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';

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
    /** indicate true when a guide information modal is already displayed. 1 if already shown*/
    public show_info: number;

    // db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_USER_ID = 'user_id';
    static COL_GUIDE_ID = 'guide_id';
    static COL_STEP = 'step';
    static COL_PARENT_GUIDE_ID = 'parent_guide_id';
    static COL_SHOW_INFO = 'show_info';


    /** @inheritDoc */
    TABLE_NAME: string = 'guide_view_history';

    /** @inheritDoc */
    TABLE: any = [
        [GuideViewHistoryModel.COL_CLIENT_ID, 'TINYINT(1) DEFAULT 1', DbBaseModel.TYPE_NUMBER],
        [GuideViewHistoryModel.COL_USER_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER, 'user_id'],
        [GuideViewHistoryModel.COL_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideViewHistoryModel.COL_STEP, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideViewHistoryModel.COL_PARENT_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideViewHistoryModel.COL_SHOW_INFO, 'TINYINT(1) DEFAULT 0', DbBaseModel.TYPE_NUMBER],
    ];

    public migrations = ['AddShowInfoColumnToGuideViewHistory', 'AddModelColumnsToGuideViewHistoryTableMigration'];

    /**
  * @inheritDoc
  */
    constructor() {
        super();
    }
}
