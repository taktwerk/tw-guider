import { Injectable } from '@angular/core';

import { ApiService } from './base/api-service';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { GuiderModel } from 'src/app/database/models/db/api/guider-model';

@Injectable()
export class GuiderService extends ApiService {
    data: GuiderModel[] = [];
    loadUrl: string = '/guider';
    dbModelApi: GuiderModel = new GuiderModel();

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     * @param appSetting
     */
    constructor(
        http: HttpClient,
        public authService: AuthService,
        public appSetting: AppSetting,
    ) {
        super(http, appSetting);
        console.debug('GuiderService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuiderModel}
     */
    public newModel() {
        return new GuiderModel();
    }

    public getById(id): Promise<any> {
        return new Promise(async resolve => {
            const user = await this.authService.getLastUser();
            if (!user) {
                resolve([]);
                return;
            }
            const whereCondition = [['id', id]];
            if (!user.isAuthority && user.client_id) {
                whereCondition.push(['client_id', user.client_id]);
            }
            this.dbModelApi.findFirst(whereCondition).then(result => {
                resolve(result);
            });
        });
    }
}
