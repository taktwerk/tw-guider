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
import {AppSetting} from '../../services/app-setting';

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
     * @param appSetting
     */
    constructor(http: HttpClient,
                private p: Platform,
                private db: DbProvider,
                public authService: AuthService,
                public events: Events,
                public downloadService: DownloadService,
                public appSetting: AppSetting) {
        super(http, events, appSetting);
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
        return new Promise(async (resolve) => {
            const user = await this.authService.getLastUser();
            if (!user) {
                resolve([]);
                return;
            }
            const whereCondition = [
                this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL',
            ];
            console.log('user.isAuthority', user.isAuthority);
            if (!user.isAuthority) {
                whereCondition.push(
                    this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id
                );
                whereCondition.push(
                    this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id
                );
            }
            if (searchValue) {
                whereCondition.push(
                    '(' + this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(GuiderModel.COL_SHORT_NAME) + ' LIKE "%' + searchValue + '%"'
                    + ' OR ' +
                    this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(GuiderModel.COL_TITLE) + ' LIKE "%' + searchValue + '%")'
                );
            }
            const joinCondition = 'JOIN ' + this.dbModelApi.secure('guide_category_binding') +
                ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_category_id') +
                '=' +
                this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure('id') +
                ' JOIN ' + this.dbModelApi.secure('guide') +
                ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') +
                '=' +
                this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id');

            const selectFrom = 'SELECT ' + this.dbModelApi.secure('guide_category') + '.*' + ' from ' + this.dbModelApi.secure('guide_category');
            const orderBy = 'guide_category.name ASC';
            const groupby = this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure('id');

            const entries: any[] = [];
            this.dbModelApi.searchAllAndGetRowsResult(
                whereCondition,
                orderBy,
                0,
                joinCondition,
                selectFrom,
                groupby
            ).then((res) => {
                if (res && res.rows && res.rows.length > 0) {
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

    async findAll(): Promise<any> {
        return new Promise(async (resolve) => {
            const user = await this.authService.getLastUser();
            if (!user) {
                resolve([]);
                return;
            }
            const whereCondition: any[] = [
                this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL AND ' +
                this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL',
            ];
            console.log('user.isAuthority', user.isAuthority);
            if (!user.isAuthority) {
                whereCondition.push(['client_id', user.client_id]);
            }
            const orderBy = 'name ASC';

            const entries: any[] = [];
            return this.dbModelApi.searchAllAndGetRowsResult(whereCondition, orderBy).then((res) => {
                if (res && res.rows && res.rows.length > 0) {
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

    public getGuides(guideId: number, searchValue?: string): Promise<GuiderModel[]> {
        return new Promise(async (resolve) => {
            const user = await this.authService.getLastUser();
            if (!user) {
                resolve([]);
                return;
            }
            const whereCondition: any[] = [
                this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure('id') + '=' + guideId,
                this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL'
            ];
            console.log('user.isAuthority', user.isAuthority);
            if (!user.isAuthority) {
                whereCondition.push(
                    this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id
                );
                whereCondition.push(
                    this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id
                );
            }
            if (searchValue) {
                whereCondition.push(
                    '(' + this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(GuiderModel.COL_SHORT_NAME) + ' LIKE "%' + searchValue + '%"'
                    + ' OR ' +
                    this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(GuiderModel.COL_TITLE) + ' LIKE "%' + searchValue + '%")'
                );
            }
            const joinCondition =
                'JOIN ' + this.dbModelApi.secure('guide_category_binding') +
                ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') +
                ' = ' +
                this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id') +
                ' JOIN ' + this.dbModelApi.secure('guide_category') +
                ' ON ' +
                this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_category_id') +
                ' = ' +
                this.dbModelApi.secure('guide_category') + '.' + this.dbModelApi.secure('id');
            const selectFrom = 'SELECT ' + this.dbModelApi.secure('guide') + '.*' + ' from ' + this.dbModelApi.secure('guide');
            const groupby = this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id');

            const entries: any[] = [];
            this.dbModelApi.searchAllAndGetRowsResult(whereCondition, '', 0, joinCondition, selectFrom, groupby).then((res) => {
                if (res && res.rows && res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const obj: GuiderModel = new GuiderModel(this.p, this.db, this.events, this.downloadService);
                        obj.platform = this.dbModelApi.platform;
                        obj.db = this.db;
                        obj.events = this.events;
                        obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
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
