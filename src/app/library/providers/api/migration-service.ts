import { Injectable } from '@angular/core';

import { ApiService } from './base/api-service';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { MigrationModel } from 'app/database/models/db/migration-model';

@Injectable()
export class MigrationService extends ApiService {
    override data: MigrationModel[] = [];
    loadUrl: any = null;
    dbModelApi: MigrationModel = new MigrationModel();

    /**
     * Constructor
     * @param http
     * @param appSetting
     */
    constructor(http: HttpClient,
        public authService: AuthService,
        public override appSetting: AppSetting,
    ) {
        super(http, appSetting);
    }

    /**
     * Create a new instance of the service model
     * @returns {MigrationkModel}
     */
    public override newModel() {
        return new MigrationModel();
    }
}
