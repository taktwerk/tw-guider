import { LoggerService } from './../../services/logger-service';
import { DbBaseModel } from '../base/db-base-model';
import { Platform } from '@ionic/angular';
import { DbProvider } from '../../providers/db-provider';
import { DownloadService } from '../../services/download-service';
import { MiscService } from '../../services/misc-service';
import { Injectable } from '@angular/core';

@Injectable()
export class AppSettingsDb extends DbBaseModel {
    /** @inheritDoc */
    TAG: string = 'AppSettingsDb';

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
