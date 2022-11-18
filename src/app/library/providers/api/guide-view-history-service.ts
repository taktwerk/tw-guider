import { LoggerService } from './../../services/logger-service';
import { Injectable } from '@angular/core';

import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { AppSetting } from '../../services/app-setting';
import { GuiderService } from './guider-service';
import { GuideViewHistoryModel } from 'app/database/models/db/api/guide-view-history-model';
import { GuiderModel } from 'app/database/models/db/api/guider-model';

@Injectable()
export class GuideViewHistoryService extends ApiService {
    override data: GuideViewHistoryModel[] = [];
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
        public guiderService: GuiderService,
        public override appSetting: AppSetting,
    ) {
        super(http, appSetting);
        console.debug('GuideViewHistoryService', 'initialized');
    }

    /**
     * Create a new instance of the service model
     * @returns {GuideViewHistoryModel}
     */
    public override newModel() {
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

            const from = 'SELECT ' + '*, (SELECT count(*) AS COUNT from guide_step WHERE `guide_step`.`guide_id` = `guide_view_history`.`guide_id`) AS count' + ' from ' + this.dbModelApi.secure('guide_view_history');

            const join = 'LEFT JOIN ' + this.dbModelApi.secure('guide') +
                ' ON ' + this.dbModelApi.secure('guide_view_history') + '.' + this.dbModelApi.secure('guide_id') +
                ' = ' + this.dbModelApi.secure('guide') + '.' + this.dbModelApi.secure('id');

            const whereCondition: any[] = [deletedAtRaw];

            if (!user.isAuthority) {
                whereCondition.push(['client_id', user.client_id]);
            }

            // const orderBy = 'updated_at DESC';
            const orderBy = 'local_updated_at DESC';

            const entries: Array<any> = [];
            return this.dbModelApi.searchAllAndGetRowsResult(whereCondition, orderBy, undefined, undefined, from).then(async (res) => {
                if (res && res.rows && res.rows.length > 0) {

                    const isCollectionExistInArray = (guide: any) => {
                        for (let element of entries) {
                            if (element.type === 'collection' && element.id == guide.parent_guide_id) {
                                return element;
                            }
                        }
                        return false;
                    };



                    for (let i = 0; i < res.rows.length; i++) {
                        const item = res.rows.item(i);

                        const obj: any = new GuiderModel();
                        obj.loadFromAttributes(item);
                        obj.count = item.count;

                        obj.steps = item.step;
                        // if (obj.type = 'collection') {
                        //     console.log("obj.type", obj.type);
                        //     obj.count = newCount;
                        //     console.log("check obj.count", obj.count);
                        // }
                        // obj.count = item.count;
                        obj.data = item;
                        obj.guide_id = item.guide_id;
                        obj.parent_guide_id = item.parent_guide_id;
                        obj.idApi = item.parent_guide_id;
                        const guider = await this.guiderService.getById(obj.guide_id);
                        // console.log("guider.title", guider[0].title, guider);
                        obj.title = guider[0].title;
                        obj.guider = guider;


                        if (obj.parent_guide_id != 0) {


                            if (isCollectionExistInArray(obj) === false) {

                                const collectionGuide = await this.guiderService.getById(obj.parent_guide_id);
                                obj.title = collectionGuide[0].title;
                                await obj.setChildren();
                                let count = 0;
                                let steps = 0;
                                let breakStep = false;
                                for (let guide of obj.guide_collection) {

                                    count += Number(guide.count);
                                    if (guide.count == guide.step + 1 && breakStep == false) {
                                        steps += guide.step + 1;
                                    } else {
                                        if (breakStep == false) {
                                            steps += guide.step + 1;
                                        }
                                        breakStep = true;
                                    }

                                }

                                obj.count = count;
                                obj.steps = steps;

                                entries.push({
                                    id: obj.parent_guide_id,
                                    guides: obj,
                                    type: 'collection'
                                });
                            }

                        } else {
                            entries.push({
                                id: obj.guide_id,
                                guides: obj,
                                type: 'single'
                            });
                        }
                    }

                }
                resolve(entries);
            }).catch((err) => {
                resolve(entries);
            });
        });
    }
    public getActivity(guideCategoryId?: number, searchValue?: string, withoutCategories = false): any {
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

            const orderBy = 'local_updated_at DESC';

            const from = 'SELECT ' + '*, (SELECT count(*) AS COUNT from guide_step WHERE `guide_step`.`guide_id` = `guide_view_history`.`guide_id`) AS count' + ' from ' + this.dbModelApi.secure('guide_view_history');

            const entries: any = [];

            this.dbModelApi.searchAllAndGetRowsResult(null, orderBy, null, join, from).then(async (res) => {
                if (res && res.rows && res.rows.length > 0) {
                    // console.log("new query again", res);
                    for (let i = 0; i < res.rows.length; i++) {

                        const item = res.rows.item(i);
                        // console.log("res.rows", item);
                        const obj: any = new GuiderModel();
                        // obj.platform = this.dbModelApi.platform;
                        // obj.db = this.db;
                        // obj.downloadService = this.downloadService;

                        obj.step = item.step;
                        obj.count = item.count;
                        obj.data = item;
                        obj.guide_id = item.guide_id;
                        obj.parent_guide_id = item.parent_guide_id;
                        obj.loadFromAttributes(item);
                        await obj.setProtocolTemplate();
                        entries.push(obj);
                    }

                }
                resolve(entries);
                console.log("entries", entries);

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
