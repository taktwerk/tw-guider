import { Injectable } from '@angular/core';

import { ApiService } from './base/api-service';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { MigrationModel } from '../../models/db/migration-model';
import { AppSetting } from '../../services/app-setting';
import { LoggerService } from '../../services/logger-service';

@Injectable()
export class MigrationService extends ApiService {
    data: MigrationModel[] = [];
    loadUrl: string = null;
    dbModelApi: MigrationModel = new MigrationModel();

    /**
     * Constructor
     * @param http
     * @param appSetting
     */
    constructor(http: HttpClient,
        public authService: AuthService,
        public appSetting: AppSetting,
    ) {
        super(http, appSetting);
    }

    /**
     * Create a new instance of the service model
     * @returns {MigrationkModel}
     */
    public newModel() {
        return new MigrationModel();
    }
}
