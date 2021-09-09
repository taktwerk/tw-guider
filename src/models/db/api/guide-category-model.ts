import { LoggerService } from './../../../services/logger-service';
import { Platform } from '@ionic/angular';
import { DbApiModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';
import { GuiderModel } from './guider-model';
import { MiscService } from '../../../services/misc-service';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuideCategoryModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideCategoryModel';
    public apiPk = 'id';

    //members
    public client_id: number = null;
    public name: string = null;

    /// relation
    public guides: GuiderModel[] = [];
    public guidesCount = 0;

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_NAME = 'name';

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_category';

    public UNIQUE_PAIR: string = 'UNIQUE(' + this.COL_ID_API + ', ' + GuideCategoryModel.COL_CLIENT_ID + ')';

    /** @inheritDoc */
    TABLE: any = [
        [GuideCategoryModel.COL_CLIENT_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideCategoryModel.COL_NAME, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
    ];

    /**
     * @inheritDoc
     */
    constructor(
        public platform: Platform,
        public db: DbProvider,

        public downloadService: DownloadService,
        public loggerService: LoggerService,
        public miscService: MiscService,
    ) {
        super(platform, db, downloadService, loggerService, miscService);
    }

    public addGuide(newData) {
        const indexApi = this.guides.findIndex(record => newData.idApi && record.idApi === newData.idApi);

        if (indexApi !== -1) {
            this.guides[indexApi] = newData;
        } else {
            this.guides.push(newData);
        }
    }

    public setGuides(searchValue?: string) {
        return new Promise((resolve) => {
            const whereCondition = [
                this.secure('guide_category') + '.' + this.secure('id') + '=' + this.idApi,
                this.secure('guide') + '.' + this.secure(this.COL_DELETED_AT) + ' IS NULL',
                this.secure('guide') + '.' + this.secure(this.COL_LOCAL_DELETED_AT) + ' IS NULL',
                this.secure('guide_category') + '.' + this.secure(this.COL_DELETED_AT) + ' IS NULL',
                this.secure('guide_category') + '.' + this.secure(this.COL_LOCAL_DELETED_AT) + ' IS NULL',
                this.secure('guide_category_binding') + '.' + this.secure(this.COL_DELETED_AT) + ' IS NULL',
                this.secure('guide_category_binding') + '.' + this.secure(this.COL_LOCAL_DELETED_AT) + ' IS NULL'
            ];

            if (searchValue) {
                whereCondition.push(
                    '(' + this.secure('guide') + '.' + this.secure(GuiderModel.COL_TITLE) + ' LIKE "%' + searchValue + '%"' +
                    ' OR ' + this.secure(GuiderModel.COL_DESCRIPTION) + ' LIKE "%' + searchValue + '%")'
                );
            }

            const joinCondition =
                'JOIN ' + this.secure('guide_category_binding') +
                ' ON ' + this.secure('guide_category_binding') + '.' + this.secure('guide_id') +
                ' = ' +
                this.secure('guide') + '.' + this.secure('id') +
                ' JOIN ' + this.secure('guide_category') +
                ' ON ' +
                this.secure('guide_category_binding') + '.' + this.secure('guide_category_id') +
                ' = ' +
                this.secure('guide_category') + '.' + this.secure('id');

            const selectFrom = 'SELECT ' + this.secure('guide') + '.*' + ' from ' + this.secure('guide');

            const entries: any[] = [];

            this.searchAllAndGetRowsResult(whereCondition, '', 0, joinCondition, selectFrom).then((res) => {
                if (res && res.rows && res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const obj: GuiderModel = new GuiderModel(this.platform, this.db, this.downloadService, this.loggerService, this.miscService);
                        obj.platform = this.platform;
                        obj.db = this.db;

                        obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
                        this.addGuide(obj);
                    }
                }
                this.guidesCount = this.guides.length;
                resolve(true);
            }).catch((err) => {
                console.log('guide category error', err);
            });
        });
    }

    setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }

    removeAll(condition?: []): Promise<any> {
        return super.removeAll(condition);
    }
}
