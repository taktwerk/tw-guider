import { LoggerService } from './../../services/logger-service';
import { Injectable } from '@angular/core';

import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { GuiderModel } from '../../models/db/api/guider-model';
import { DownloadService } from '../../services/download-service';
import { GuideViewHistoryModel } from '../../models/db/api/guide-view-history-model';
import { DbBaseModel } from '../../models/base/db-base-model';
import { AppSetting } from '../../services/app-setting';

@Injectable()
export class GuideViewHistoryService extends ApiService {
    data: GuideViewHistoryModel[] = [];
    loadUrl = '/guide-view-history';
    dbModelApi: GuideViewHistoryModel = new GuideViewHistoryModel();

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     * @param sanitized
     * @param appSetting
     */
    constructor(http: HttpClient,
        private db: DbProvider,
        public authService: AuthService,

        public downloadService: DownloadService,
        public loggerService: LoggerService,
        public appSetting: AppSetting,
    ) {
        super(http, appSetting);
        console.debug('GuideViewHistoryService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideViewHistoryModel}
     */
    public newModel() {
        return new GuideViewHistoryModel();
    }
    async findAll(searchValue?: string): Promise<any> {
        return new Promise(async (resolve) => {
            const user = await this.authService.getLastUser();
            if (!user) {
                resolve([]);
                return;
            }
            let deletedAtRaw = this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL AND ' +
                this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL';
            if (searchValue) {
                // deletedAtRaw += ' AND ' + this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure(GuideViewHistoryModel) + ' LIKE "%' + searchValue + '%"';
            }
            const whereCondition: any[] = [deletedAtRaw];
            if (!user.isAuthority) {
                whereCondition.push(['client_id', user.client_id]);
            }
            const orderBy = 'updated_at DESC';

            const entries: any[] = [];
            return this.dbModelApi.searchAllAndGetRowsResult(whereCondition, orderBy).then((res) => {
                if (res && res.rows && res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const obj: DbBaseModel = this.newModel();
                        obj.platform = this.dbModelApi.platform;
                        obj.db = this.db;
                        obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
                        entries.push(obj);
                    }
                }
                // console.log("findAll entries Activity", entries)
                resolve(entries);
            }).catch((err) => {
                resolve(entries);
            });
        });
    }
    public getActivity(guideCategoryId?: number, searchValue?: string, withoutCategories = false): Promise<GuiderModel[]> {
        return new Promise(async (resolve) => {
            const user = await this.authService.getLastUser();
            if (!user) {
                console.log('1');
                resolve([]);
                return;
            }


            const join = 'LEFT JOIN ' + this.dbModelApi.secure('guide') +
                ' ON ' + this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('guide_id') +
                ' = ' + this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id');

            const orderBy = 'updated_at DESC';

            const from = 'SELECT ' + '*' + ' from ' + this.dbModelApi.secure('guide_view_history');
            
            const entries = [];
            
            this.dbModelApi.searchAllAndGetRowsResult(null, orderBy, null, join, from).then(res => {
                console.log('new query', res);
                if (res && res.rows && res.rows.length > 0) {
                    console.log(res);
                    for (let i = 0; i < res.rows.length; i++) {
                        console.log(res.rows.item(i));
                        const obj: GuiderModel = new GuiderModel();
                        obj.platform = this.dbModelApi.platform;
                        obj.db = this.db;
                        obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
                        obj.setChildren();
                        obj.setProtocolTemplate();
                        entries.push(obj);
                    }
                }
                resolve(entries);
            }).catch(e => {
                resolve(entries);
            });



            // const whereCondition: any[] = [
            //     this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
            //     this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL',
            //     this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
            //     this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL'
            // ];

            // if (guideCategoryId) {
            //     whereCondition.push(
            //         this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('id') +
            //         '=' +
            //         guideCategoryId
            //     );
            // }

            // if (!user.isAuthority) {
            //     whereCondition.push(
            //         this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id
            //     );
            // }

            // if (searchValue) {
            //     whereCondition.push(
            //         '(' + this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(GuiderModel.COL_SHORT_NAME) + ' LIKE "%' + searchValue + '%"'
            //         + ' OR ' +
            //         this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(GuiderModel.COL_TITLE) + ' LIKE "%' + searchValue + '%")'
            //     );
            // }

            // let joinCondition = '';
            // if (withoutCategories) {
            //     joinCondition =
            //         'LEFT JOIN ' + this.dbModelApi.secure('guide_category_binding') +
            //         ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') +
            //         ' = ' +
            //         this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id') +
            //         ' LEFT JOIN ' + this.dbModelApi.secure('guide_view_history') +
            //         ' ON ' +
            //         this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_category_id') +
            //         ' = ' +
            //         this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('id') +
            //         ' LEFT JOIN ' + this.dbModelApi.secure('guide_child') +
            //         ' ON ' +
            //         this.dbModelApi.secure('guide_child') + '.' + this.dbModelApi.secure('guide_id') +
            //         '=' +
            //         this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id');

            //     whereCondition.push(
            //         this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') + ' IS NULL',
            //         this.dbModelApi.secure('guide_child') + '.' + this.dbModelApi.secure('guide_id') + ' IS NULL'
            //     );
            // }
            // else {
            //     joinCondition =
            //         'JOIN ' + this.dbModelApi.secure('guide_category_binding') +
            //         ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') +
            //         ' = ' +
            //         this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id') +
            //         ' JOIN ' + this.dbModelApi.secure('guide_view_history') +
            //         ' ON ' +
            //         this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_category_id') +
            //         ' = ' +
            //         this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('id');
            //     if (!user.isAuthority) {
            //         whereCondition.push(
            //             this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id,
            //             this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
            //             this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL'
            //         );
            //     }
            // }

            // const selectFrom = 'SELECT ' + this.dbModelApi.secure('guide') + '.*' + ' from ' + this.dbModelApi.secure('guide');
            // const groupby = this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id');
            // const entries: GuiderModel[] = [];
            // this.dbModelApi.searchAllAndGetRowsResult(whereCondition, '', 0, joinCondition, selectFrom, groupby).then((res) => {
            //     if (res && res.rows && res.rows.length > 0) {
            //         for (let i = 0; i < res.rows.length; i++) {
            //             const obj: GuiderModel = new GuiderModel();
            //             obj.platform = this.dbModelApi.platform;
            //             obj.db = this.db;
            //             obj.downloadService = this.downloadService;
            //             obj.loadFromAttributes(res.rows.item(i));
            //             obj.setChildren();
            //             obj.setProtocolTemplate();
            //             entries.push(obj);
            //         }
            //     }
            //     resolve(entries);
            // }).catch((err) => {
            //     resolve(entries);
            // });
        });
    }
}
