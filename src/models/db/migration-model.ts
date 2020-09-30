import {Platform, Events} from '@ionic/angular';
import {DbApiModel, FileMapInModel} from '../base/db-api-model';
import {DbProvider} from '../../providers/db-provider';
import {DbBaseModel} from '../base/db-base-model';
import {DownloadService} from '../../services/download-service';

/**
 * API Db Model for 'Guide Child Model'.
 */
export class MigrationModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'MigrationModel';
    public apiPk = 'id';

    //members
    public name: string;
    public table_name: string;
    public is_active: number;

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
    constructor(public platform: Platform, public db: DbProvider, public events: Events, public downloadService: DownloadService) {
        super(platform, db, events, downloadService);
    }
}
