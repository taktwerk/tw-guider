import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {GuiderModel} from '../../models/db/api/guider-model';
import {DownloadService} from '../../services/download-service';
import {GuideCategoryModel} from '../../models/db/api/guide-category-model';
import {DbBaseModel} from '../../models/base/db-base-model';

@Injectable()
export class GuideCategoryService extends ApiService {
    data: GuideCategoryModel[] = [];
    loadUrl: string = '/guide-category';
    dbModelApi: GuideCategoryModel = new GuideCategoryModel(this.p, this.db, this.events, this.downloadService);

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
        public downloadService: DownloadService
    ) {
        super(http, events);
        console.debug('GuideCategoryService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {TimerTrackingModel}
     */
    public newModel() {
        return new GuideCategoryModel(this.p, this.db, this.events, this.downloadService);
    }

    public findByGuides(searchValue): Promise<any> {
        return new Promise((resolve) => {
            const query = 'SELECT ' + this.dbModelApi.secure('guide_category') + '.*' + ' from ' + this.dbModelApi.secure('guide_category') +
                ' JOIN ' + this.dbModelApi.secure('guide_category_binding') + ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_category_id') + '=' + this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure('id') +
                ' JOIN ' + this.dbModelApi.secure('guide') + ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') + '=' + this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id') +
                ' WHERE ' + this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(GuiderModel.COL_TITLE) + ' LIKE "%' + searchValue + '%" OR ' + this.dbModelApi.secure(GuiderModel.COL_DESCRIPTION) + ' LIKE "%' + searchValue + '%"' +
                ' ORDER BY guide_category.name ASC'
            console.log('queriiiiii', query);

            const entries: any[] = [];
            this.db.query(query).then((res) => {
                if (res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const obj: DbBaseModel = this.newModel();
                        obj.platform = this.dbModelApi.platform;
                        obj.db = this.db;
                        obj.events = this.events;
                        obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
                        // console.debug(this.TAG, 'new instance', obj);
                        entries.push(obj);
                    }
                }

                resolve(entries);
            }).catch((err) => {
                resolve(entries);
            });
        });
    }
}