import { DbApiModel } from '../../base/db-api-model';
import { DbBaseModel } from '../../base/db-base-model';

/**
 * API Db Model for 'Sync Index Model'.
 */
export class SyncIndexModel extends DbApiModel {
    /** @inheritDoc */
    override TAG: string = 'SyncIndexModel';
    public apiPk = 'id';

    // members
    public model: any; //
    public model_id: any; //
    public user_id: any = null; //

    // db columns
    static COL_MODEL = 'model';
    static COL_MODEL_ID = 'model_id';
    static COL_USER_ID = 'user_id';

    /** @inheritDoc */
    TABLE_NAME: string = 'sync_index';

    /** @inheritDoc */
    TABLE: any = [
        [SyncIndexModel.COL_MODEL, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, 'model'],
        [SyncIndexModel.COL_MODEL_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER, 'model_id'],
        [SyncIndexModel.COL_USER_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER, 'user_id'],
    ];

    public override migrations = ['AddModelColumnsToSyncIndexTableMigration'];

    /**
     * @inheritDoc
     */
    constructor(
    ) {
        super();
    }
}