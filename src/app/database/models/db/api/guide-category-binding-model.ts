import { DbApiModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuideCategoryBindingModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'GuideCategoryBindingModel';
    public apiPk = 'id';

    //members
    public guide_id!: number;
    public guide_category_id!: number;

    //db columns
    static COL_GUIDE_ID = 'guide_id';
    static COL_GUIDE_CATEGORY_ID = 'guide_category_id';

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_category_binding';

    /** @inheritDoc */
    TABLE: any = [
        [GuideCategoryBindingModel.COL_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideCategoryBindingModel.COL_GUIDE_CATEGORY_ID, 'INT', DbBaseModel.TYPE_NUMBER]
    ];

    /**
     * @inheritDoc
     */
    constructor() {
        super();
    }
}
