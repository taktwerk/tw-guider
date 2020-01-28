import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {GuiderModel} from '../../models/db/api/guider-model';
import {DownloadService} from '../../services/download-service';

@Injectable()
export class GuiderService extends ApiService {
    data: GuiderModel[] = [];
    loadUrl: string = '/guider';
    dbModelApi: GuiderModel = new GuiderModel(this.p, this.db, this.events, this.downloadService);

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     */
    constructor(http: HttpClient, private p: Platform, private db: DbProvider,
        public authService: AuthService,
        public events: Events,
        public downloadService: DownloadService) {
        super(http, events);
        console.debug('GuiderService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {TimerTrackingModel}
     */
    public newModel() {
        return new GuiderModel(this.p, this.db, this.events, this.downloadService);
    }

    public getById(id): Promise<any> {
        return new Promise(async resolve => {
            const user = await this.authService.getLastUser();
            if (!user) {
                resolve([]);
                return;
            }
            const whereCondition = [['id', id]];
            if (user.clientId) {
                whereCondition.push(['user_id', user.userId]);
            }
            this.dbModelApi.findFirst(whereCondition).then(result => {
                resolve(result);
            });
        });
    }
}
