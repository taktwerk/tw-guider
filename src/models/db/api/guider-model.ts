/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */

import { DbApiModel, FileMapInModel } from '../../base/db-api-model';

import { DbBaseModel } from '../../base/db-base-model';
import { GuideAssetModel } from './guide-asset-model';
import { GuideChildModel } from './guide-child-model';
import { GuideStepModel } from './guide-step-model';
import { ProtocolTemplateModel } from './protocol-template-model';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuiderModel extends DbApiModel {
    /** @inheritDoc */
    TAG = 'GuiderModel';
    public apiPk = 'id';

    /// relations
    steps: GuideStepModel[] = [];
    assets: GuideAssetModel[] = [];
    protocol_template: ProtocolTemplateModel;
    guide_collection: GuideChildModel[] = [];

    public UNIQUE_PAIR: string = 'UNIQUE(' + this.COL_ID_API + ', ' + GuiderModel.COL_CLIENT_ID + ')';

    // members
    public client_id: number = null;
    public short_name: string;
    public title: string;
    public description: string;
    public preview_file: string;
    public preview_file_path: string;
    public revision_term: string;
    public revision_counter: number;
    public duration: number;
    public template_id: number;
    public protocol_template_id: number;
    public revision: string;

    // db columns
    static COL_CLIENT_ID = 'client_id';
    static COL_SHORT_NAME = 'short_name';
    static COL_TITLE = 'title';
    static COL_DESCRIPTION = 'description';
    static COL_PREVIEW_FILE = 'preview_file';
    static COL_API_PREVIEW_FILE_PATH = 'preview_file_path';
    static COL_LOCAL_PREVIEW_FILE = 'local_preview_file';
    static COL_REVISION_TERM = 'revision_term';
    static COL_REVISION_COUNTER = 'revision_counter';
    static COL_DURATION = 'duration';
    static COL_TEMPLATE_ID = 'template_id';
    static COL_PROTOCOL_TEMPLATE_ID = 'protocol_template_id';
    static COL_REVISION = 'revision';

    public downloadMapping: FileMapInModel[] = [
        {
            name: GuiderModel.COL_PREVIEW_FILE,
            url: GuiderModel.COL_API_PREVIEW_FILE_PATH,
            localPath: GuiderModel.COL_LOCAL_PREVIEW_FILE
        }
    ];

    /** @inheritDoc */
    TABLE_NAME = 'guide';

    /** @inheritDoc */
    TABLE: any = [
        [GuiderModel.COL_CLIENT_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuiderModel.COL_SHORT_NAME, 'VARCHAR(4)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_TITLE, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_DESCRIPTION, 'TEXT', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_PREVIEW_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_API_PREVIEW_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_LOCAL_PREVIEW_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_REVISION_TERM, 'VARCHAR(10)', DbBaseModel.TYPE_STRING],
        [GuiderModel.COL_REVISION_COUNTER, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuiderModel.COL_DURATION, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuiderModel.COL_TEMPLATE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuiderModel.COL_PROTOCOL_TEMPLATE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuiderModel.COL_REVISION, 'VARCHAR(255)', DbBaseModel.TYPE_STRING]
    ];

    public migrations = ['AddCreatedTermAndUpdatedTermToGuideTableMigration'];

    /**
     * @inheritDoc
     */
    constructor() {
        super();
    }

    /**
     *
     *
     * Get short description
     *
     *
     *
     * @returns
     */
    public getDescription(): string {
        return this.description.replace(/\n/g, '<br />');
    }

    public getByCategory() {
        return [
            { description: 'America', title: 'Title' },
            { description: 'Guide description', title: 'Guider' }
        ];
    }

    public getDuration() {
        const days = Math.floor(this.duration / 1440);
        const hours = Math.floor((this.duration - days * 1440) / 60);
        const minutes = Math.floor(this.duration - (days * 1440) - (hours * 60));

        const day = days;
        const hour = (days >= 1 ? ' ' : '') + hours;
        const minute = (hours >= 1 ? ' ' : '') + minutes;

        const dayString = days >= 1 ? (day + ' ' + (day >= 2 ? 'days' : 'day')) : '';
        const hourString = hours >= 1 ? hour + 'h' : '';
        const minuteString = minutes >= 1 ? minute + 'min' : '';

        return `${dayString}${hourString}${minuteString}`;
    }

    public addRelativeData(newData, relationKey) {
        const indexApi = this[relationKey].findIndex(record => newData.idApi && record.idApi === newData.idApi);
        const deletedIndexApi = this[relationKey]
            .findIndex(record => !record.deleted_at && !record.local_deleted_at);

        if (indexApi !== -1) {
            this[relationKey][indexApi] = newData;
        } else {
            this[relationKey].push(newData);
        }
    }


    public setAssets(id): Promise<GuideAssetModel[]> {
        return new Promise((resolve) => {
            const query = 'SELECT ' + this.secure('guide_asset') + '.*' + ' from ' + this.secure('guide') +
                ' JOIN ' + this.secure('guide_asset_pivot') + ' ON ' + this.secure('guide_asset_pivot') + '.' + this.secure('guide_id') + '=' + this.secure('guide') + '.' + this.secure('id') +
                ' JOIN ' + this.secure('guide_asset') + ' ON ' + this.secure('guide_asset_pivot') + '.' + this.secure('guide_asset_id') + '=' + this.secure('guide_asset') + '.' + this.secure('id') +
                ' WHERE ' + this.secure('guide') + '.' + this.secure('id') + ' = ' + id +
                ' AND ' + this.secure('guide') + '.' + this.secure(this.COL_DELETED_AT) + ' IS NULL' +
                ' AND ' + this.secure('guide') + '.' + this.secure(this.COL_LOCAL_DELETED_AT) + ' IS NULL' +
                ' AND ' + this.secure('guide_asset') + '.' + this.secure(this.COL_DELETED_AT) + ' IS NULL' +
                ' AND ' + this.secure('guide_asset') + '.' + this.secure(this.COL_LOCAL_DELETED_AT) + ' IS NULL' +
                ' AND ' + this.secure('guide_asset_pivot') + '.' + this.secure(this.COL_DELETED_AT) + ' IS NULL' +
                ' AND ' + this.secure('guide_asset_pivot') + '.' + this.secure(this.COL_LOCAL_DELETED_AT) + ' IS NULL' +
                ' GROUP BY guide_asset.id';

            this.db.query(query).then((res) => {
                this.assets = [];
                if (res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const obj: GuideAssetModel = new GuideAssetModel();
                        obj.platform = this.platform;
                        obj.db = this.db;
                        obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
                        this.assets.push(obj);
                    }
                }
                resolve(this.assets);
            }).catch((err) => {
                resolve(this.assets);
            });
        });
    }

    public setChildren(): Promise<GuideChildModel[]> {
        return new Promise((resolve) => {
            const query = 'SELECT ' + this.secure('guide_child') + '.*' +
                ', (SELECT count(*) AS COUNT from guide_step WHERE `guide_step`.`guide_id` = ' + this.secure('guide_child') + '.' + this.secure('guide_id') + ') AS count' +
                ', (SELECT step from guide_view_history WHERE `guide_view_history`.`guide_id` = ' + this.secure('guide_child') + '.' + this.secure('guide_id') +
                ' AND `guide_view_history`.`parent_guide_id` = ' + this.secure('guide') + '.' + this.secure('id') + ') AS step' +
                ' from ' + this.secure('guide') +
                ' JOIN ' + this.secure('guide_child') + ' ON ' + this.secure('guide_child') + '.' + this.secure('parent_guide_id') + '=' + this.secure('guide') + '.' + this.secure('id') +
                ' WHERE ' + this.secure('guide') + '.' + this.secure('id') + ' = ' + this.idApi +
                ' AND ' + this.secure('guide') + '.' + this.secure(this.COL_DELETED_AT) + ' IS NULL' +
                ' AND ' + this.secure('guide') + '.' + this.secure(this.COL_LOCAL_DELETED_AT) + ' IS NULL' +
                ' AND ' + this.secure('guide_child') + '.' + this.secure(this.COL_DELETED_AT) + ' IS NULL' +
                ' AND ' + this.secure('guide_child') + '.' + this.secure(this.COL_LOCAL_DELETED_AT) + ' IS NULL';
            // ' GROUP BY guide_child.id';

            this.guide_collection = [];

            this.db.query(query).then((res) => {

                if (res.rows.length > 0) {
                    for (let i = 0; i < res.rows.length; i++) {
                        const obj: any = new GuideChildModel();
                        // obj.platform = this.platform;
                        // obj.db = this.db;
                        // obj.downloadService = this.downloadService;
                        obj.loadFromAttributes(res.rows.item(i));
                        obj.count = res.rows.item(i).count;
                        obj.step = res.rows.item(i).step;
                        obj.guide_id = res.rows.item(i).guide_id;
                        obj.parent_guide_id = res.rows.item(i).parent_guide_id;
                        this.guide_collection.push(obj);
                    }
                }
                resolve(this.guide_collection);
            }).catch((err) => {
                resolve(this.guide_collection);
                console.log(err);
            });
        });
    }

    setProtocolTemplate() {
        return new Promise((resolve) => {
            if (!this.protocol_template_id) {
                resolve(this.protocol_template);
            }
            const query = 'SELECT ' + this.secure('protocol_template') + '.*' + ' from ' + this.secure('guide') +
                ' JOIN ' + this.secure('protocol_template') + ' ON ' + this.secure('protocol_template') + '.' + this.secure('id') + '=' + this.secure('guide') + '.' + this.secure('protocol_template_id') +
                ' AND ' + this.secure('guide') + '.' + this.secure('client_id') + ' = ' + this.secure('protocol_template') + '.' + this.secure('client_id') +
                ' WHERE ' + this.secure('guide') + '.' + this.secure('id') + ' = ' + this.idApi +
                ' GROUP BY guide.id';

            this.db.query(query).then((res) => {
                this.protocol_template = null;
                if (res.rows.length > 0) {
                    const obj: ProtocolTemplateModel = new ProtocolTemplateModel();
                    obj.platform = this.platform;
                    obj.db = this.db;
                    obj.downloadService = this.downloadService;
                    obj.loadFromAttributes(res.rows.item(0));
                    this.protocol_template = obj;
                }
                resolve(this.protocol_template);
            }).catch((err) => {
                console.log('errrr', err);
                resolve(this.protocol_template);
            });
        });
    }

    setUpdateCondition() {
        super.setUpdateCondition();
        this.updateCondition.push(['client_id', this.client_id]);
    }
}
