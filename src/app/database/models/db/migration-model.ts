import { DbApiModel } from '../base/db-api-model';
import { DbBaseModel } from '../base/db-base-model';

/**
 * API Db Model for 'Guide Child Model'.
 */
export class MigrationModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'MigrationModel';
    public apiPk = 'id';

    //members
    public name: any;
    public table_name: any;
    public is_active: any;

    //db columns
    static COL_NAME = 'name';
    static COL_TABLE_NAME = 'table_name';
    static COL_IS_ACTIVE = 'is_active';

    /** @inheritDoc */
    TABLE_NAME: string = 'migration';

    /** @inheritDoc */
    TABLE: any = [
        [MigrationModel.COL_NAME, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [MigrationModel.COL_TABLE_NAME, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [MigrationModel.COL_IS_ACTIVE, 'TINYINT(1) DEFAULT 0', DbBaseModel.TYPE_BOOLEAN]
    ];

    /**
     * @inheritDoc
     */
    constructor() {
        super();
    }
}
