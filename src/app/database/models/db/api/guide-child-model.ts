import { DbApiModel} from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';

/**
 * API Db Model for 'Guide Child Model'.
 */
export class GuideChildModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'GuideChildModel';
    public apiPk = 'id';

    //members
    public parent_guide_id: any;
    public guide_id: any;
    public order_number: any;

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
    constructor() {
        super();
    }
}
