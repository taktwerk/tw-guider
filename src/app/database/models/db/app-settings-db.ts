import { DbBaseModel } from '../base/db-base-model';
import { Injectable } from '@angular/core';

@Injectable()
export class AppSettingsDb extends DbBaseModel {
    /** @inheritDoc */
    override TAG: string = 'AppSettingsDb';

    static COL_SETTINGS = 'settings';

    settings: any;

    /** @inheritDoc */
    TABLE_NAME: string = 'app_settings';
    /** @inheritDoc */
    TABLE: any = [
        [AppSettingsDb.COL_SETTINGS, 'TEXT', DbBaseModel.TYPE_OBJECT, 'settings'],
    ];

    /**
     * Constructor
     * @param {Platform} platform
     * @param {DbProvider} db
     * @param {Events} events
     * @param {DownloadService} downloadService
     */
    constructor(
    ) {
        super();
    }
}
