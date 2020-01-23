import {Platform, Events} from '@ionic/angular';
import {DbApiModel} from '../../base/db-api-model';
import {DbProvider} from '../../../providers/db-provider';
import {DbBaseModel} from '../../base/db-base-model';
import {DownloadService} from '../../../services/download-service';
import {GuiderModel} from './guider-model';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuideCategoryModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideCategoryModel';
    public apiPk = 'id';

    //members
    public client_id: number;
    public name: string;

    /// relation
    public guides: GuiderModel[] = [];

    //db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_NAME = 'name';

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_category';

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
        public events: Events,
        public downloadService: DownloadService
    ) {
        super(platform, db, events, downloadService);
    }

    public addGuide(newData) {
        const indexApi = this.guides.findIndex(record => newData.idApi && record.idApi === newData.idApi);
        const indexDB = this.guides.findIndex(record => newData.id && record.id === newData.id);

        if (indexApi !== -1) {
            this.guides[indexApi] = newData;
        } else if (indexDB !== -1) {
            this.guides[indexDB] = newData;
        } else {
            this.guides.push(newData);
        }
    }

    public setGuides(searchValue?: string) {
        return new Promise((resolve) => {
            let query = 'SELECT ' + this.secure('guide') + '.*' + ' from ' + this.secure('guide') +
                ' JOIN ' + this.secure('guide_category_binding') + ' ON ' + this.secure('guide_category_binding') + '.' + this.secure('guide_id') + '=' + this.secure('guide') + '.' + this.secure('id') +
                ' JOIN ' + this.secure('guide_category') + ' ON ' + this.secure('guide_category_binding') + '.' + this.secure('guide_category_id') + '=' + this.secure('guide_category') + '.' + this.secure('id') +
                ' WHERE ' + this.secure('guide_category') + '.' + this.secure('id') + ' = ' + this.idApi;

            if (searchValue) {
                query += ' AND (' + this.secure('guide') + '.' + this.secure(GuiderModel.COL_TITLE) + ' LIKE "%' + searchValue + '%" OR ' + this.secure(GuiderModel.COL_DESCRIPTION) + ' LIKE "%' + searchValue + '%")';
            }

            const entries: any[] = [];
            this.db.query(query).then((res) => {
                if (res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const obj: GuiderModel = new GuiderModel(this.platform, this.db, this.events, this.downloadService);
                        obj.platform = this.platform;
                        obj.db = this.db;
                        obj.events = this.events;
                        obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
                        // console.debug(this.TAG, 'new instance', obj);
                        this.addGuide(obj);
                    }
                }
            }).catch((err) => {});
        });
    }
}
