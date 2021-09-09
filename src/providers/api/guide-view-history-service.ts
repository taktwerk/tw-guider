import { LoggerService } from './../../services/logger-service';
import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { GuiderModel } from '../../models/db/api/guider-model';
import { DownloadService } from '../../services/download-service';
import { DomSanitizer } from '@angular/platform-browser';
import { GuideViewHistoryModel } from '../../models/db/api/guide-view-history-model';
import { DbBaseModel } from '../../models/base/db-base-model';
import { AppSetting } from '../../services/app-setting';
import { MiscService } from '../../services/misc-service';

@Injectable()
export class GuideViewHistoryService extends ApiService {
    data: GuideViewHistoryModel[] = [];
    loadUrl = '/guide-view-history';
    dbModelApi: GuideViewHistoryModel = new GuideViewHistoryModel(this.p, this.db, this.downloadService, this.loggerService, this.miscService);

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
        private p: Platform,
        private db: DbProvider,
        public authService: AuthService,

        public downloadService: DownloadService,
        public loggerService: LoggerService,
        private sanitized: DomSanitizer,
        public appSetting: AppSetting,
        private miscService: MiscService,
    ) {
        super(http, appSetting);
        console.debug('GuideViewHistoryService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideViewHistoryModel}
     */
    public newModel() {
        return new GuideViewHistoryModel(this.p, this.db, this.downloadService, this.loggerService, this.miscService);
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
                console.log("findAll entries Activity", entries)
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
            const whereCondition: any[] = [
                this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
                this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL'
            ];

            if (guideCategoryId) {
                console.log('2');
                whereCondition.push(
                    this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('id') +
                    '=' +
                    guideCategoryId
                );
            }

            if (!user.isAuthority) {
                console.log('3');
                whereCondition.push(
                    this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id
                );
            }

            if (searchValue) {
                console.log('4');
                whereCondition.push(
                    '(' + this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(GuiderModel.COL_SHORT_NAME) + ' LIKE "%' + searchValue + '%"'
                    + ' OR ' +
                    this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure(GuiderModel.COL_TITLE) + ' LIKE "%' + searchValue + '%")'
                );
            }

            let joinCondition = '';
            if (withoutCategories) {
                console.log('5');
                joinCondition =
                    'LEFT JOIN ' + this.dbModelApi.secure('guide_category_binding') +
                    ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') +
                    ' = ' +
                    this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id') +
                    ' LEFT JOIN ' + this.dbModelApi.secure('guide_view_history') +
                    ' ON ' +
                    this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_category_id') +
                    ' = ' +
                    this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('id') +
                    ' LEFT JOIN ' + this.dbModelApi.secure('guide_child') +
                    ' ON ' +
                    this.dbModelApi.secure('guide_child') + '.' + this.dbModelApi.secure('guide_id') +
                    '=' +
                    this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id');

                whereCondition.push(
                    this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') + ' IS NULL',
                    this.dbModelApi.secure('guide_child') + '.' + this.dbModelApi.secure('guide_id') + ' IS NULL'
                );
            }
            else {
                console.log('6');
                joinCondition =
                    'JOIN ' + this.dbModelApi.secure('guide_category_binding') +
                    ' ON ' + this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_id') +
                    ' = ' +
                    this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id') +
                    ' JOIN ' + this.dbModelApi.secure('guide_view_history') +
                    ' ON ' +
                    this.dbModelApi.secure('guide_category_binding') + '.' + this.dbModelApi.secure('guide_category_id') +
                    ' = ' +
                    this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('id');
                if (!user.isAuthority) {
                    whereCondition.push(
                        this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('client_id') + '=' + user.client_id,
                        this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_DELETED_AT) + ' IS NULL',
                        this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure(this.dbModelApi.COL_LOCAL_DELETED_AT) + ' IS NULL'
                    );
                }
            }

            const selectFrom = 'SELECT ' + this.dbModelApi.secure('guide') + '.*' + ' from ' + this.dbModelApi.secure('guide');
            const groupby = this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id');
            console.log('7');
            const entries: GuiderModel[] = [];
            this.dbModelApi.searchAllAndGetRowsResult(whereCondition, '', 0, joinCondition, selectFrom, groupby).then((res) => {
                if (res && res.rows && res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const obj: GuiderModel = new GuiderModel(this.p, this.db, this.downloadService, this.loggerService, this.miscService);
                        obj.platform = this.dbModelApi.platform;
                        obj.db = this.db;
                        obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
                        obj.setChildren();
                        obj.setProtocolTemplate();
                        entries.push(obj);
                    }
                }
                console.log(entries, '8')
                resolve(entries);
            }).catch((err) => {
                resolve(entries);
            });
        });
    }
}
