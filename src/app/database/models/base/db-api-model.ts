/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */

import { RecordedFile } from 'app/library/services/download-service';
import { DbBaseModel } from './db-base-model';

export class BaseFileMapInModel {
    public name!: string;
    public url!: string;
    public localPath!: string;
    public originalFile?: string = '';
    public attachedFilesForDelete?: string[] = [];
    public notSavedModelUploadedFilePath?: string;
}

export class FileMapInModel extends BaseFileMapInModel {
    public thumbnail?: BaseFileMapInModel;
}

/**
 * Extend this abstract Helper class for every API DB-Model.
 * This class contains a model from the remote API with taktwerk's boilerplate.
 *
 * IMPORTANT: Do not extend this class if you only want to create a DbModel but not a model that has to be synced
 * with the remote API. In that case you'd have to extend only DbHelper.
 *
 */
export abstract class DbApiModel extends DbBaseModel {
    loadUrl: any;
    public defaultImage = '/assets/placeholder.jpg';
    /** flag that indicate either a record is synced with the API or not */
    public is_synced: any;
    /** primary key */
    public idApi: any;
    /** name of the primary key from API (required to sync records) */
    public abstract apiPk: string;

    //API boilerplate default fields members
    public created_at!: Date;
    public local_created_at!: Date;
    public created_by!: number;
    public updated_at!: Date;
    public local_updated_at!: Date;
    public updated_by!: number;
    public created_term!: string;
    public updated_term!: string;
    public deleted_at!: Date;
    public local_deleted_at!: Date;
    public deleted_by!: number;

    public migrations: any[] = [];

    // download mapping
    public downloadMapping!: FileMapInModel[];

    // API boilerplate default fields columns
    /** local column that indicates if the record is synced with the API */
    public COL_IS_SYNCED = '_is_synced';
    /** id's column name */
    public COL_ID_API = 'id';
    /** date time when this record was created on API */
    public COL_CREATED_AT = 'created_at';
    public COL_LOCAL_CREATED_AT = 'local_created_at';
    public COL_CREATED_BY = 'created_by';
    public COL_CREATED_TERM = 'created_term';

    /** date time when this record was updated on API */
    public COL_UPDATED_AT = 'updated_at';
    public COL_LOCAL_UPDATED_AT = 'local_updated_at';
    public COL_UPDATED_BY = 'updated_by';
    public COL_UPDATED_TERM = 'updated_term';

    /** date time when this record was deleted on API */
    public COL_DELETED_AT = 'deleted_at';
    public COL_LOCAL_DELETED_AT = 'local_deleted_at';
    public COL_DELETED_BY = 'deleted_by';
  preview_file_path: any;
  thumb_attached_file_path: any;
  attached_file_path: any;

    /**
     * Constructor
     *
     * @param platform
     * @param db
     * @param events
     * @param downloadService
     */
    constructor() {
        super();
    }

    /**
     * Loads an instance of this from a row received from the API.
     *
     * @param apiObj row received from API
     * @param oldModel
     */
    public loadFromApi(apiObj: any, oldModel = null): DbApiModel {
        let obj: any | null = null;
        obj = new (<any>this.constructor)();
        obj.platform = this.platform;
        obj.db = this.db;
        // obj.events = this.events;
        obj.downloadService = this.downloadService;
        obj.loadFromApiToCurrentObject(apiObj, oldModel);
        return obj;
    }

    loadFromApiToCurrentObject(apiObj: any, oldModel = null, willChangeFiles = true) {
        // iterate over table fields
        for (const column of this.TABLE) {
            let willChangeColumn = true;
            if (oldModel) {
                /// prevent change thumbnail if file name was not changed
                if (!willChangeFiles) {
                    if (this.downloadMapping && this.downloadMapping.length) {
                        for (const file of this.downloadMapping) {
                            if (file.thumbnail && (file.thumbnail.name === column[0] || file.thumbnail.url === column[0])) {
                                let memberNameOfFile = file.name;
                                for (const columnForFile of this.TABLE) {
                                    if (file.name === columnForFile[0]) {
                                        memberNameOfFile = columnForFile[3] ? columnForFile[3] : memberNameOfFile;
                                    }
                                }
                                if (apiObj[memberNameOfFile] !== undefined && (this as any)[memberNameOfFile] === apiObj[memberNameOfFile]) {
                                    // console.log('not willChangeColumn', memberNameOfFile);
                                    // console.log('not willChangeColumn in model', this);
                                    willChangeColumn = false;
                                }
                            }
                        }
                    }
                }
            }
            if (willChangeColumn) {
                const columnName = column[0];
                const type: number = parseInt(column[2], 10);
                const memberName = column[3] ? column[3] : columnName;
                if (apiObj[memberName] !== undefined) {
                  (this as any)[memberName] = this.getObjectByType(apiObj[memberName], type);
                }
            }
        }

        // default boilerplate fields
        this.idApi = this.getNumberValue(apiObj[this.apiPk]);
        this.created_at = this.getDateFromString(apiObj.created_at);
        this.local_created_at = this.getDateFromString(apiObj.local_created_at);
        this.created_by = this.getNumberValue(apiObj.created_by);
        this.created_term = this.getStringValue(apiObj.created_term);
        this.updated_at = this.getDateFromString(apiObj.updated_at);
        this.local_updated_at = this.getDateFromString(apiObj.local_updated_at);
        this.updated_by = this.getNumberValue(apiObj.updated_by);
        this.updated_term = this.getStringValue(apiObj.updated_term);
        this.deleted_at = this.getDateFromString(apiObj.deleted_at);
        this.local_deleted_at = this.getDateFromString(apiObj.local_deleted_at);
        this.deleted_by = this.getNumberValue(apiObj.deleted_by);
    }

    /**
     *
     *
     * Creates the db table for the extended db class.
     *
     *
     *
     * @returns
     */
    public override dbCreateTable(): Promise<any> {
        this.TABLE.push([this.COL_IS_SYNCED, 'TINYINT(1) DEFAULT 1', DbBaseModel.TYPE_BOOLEAN, 'is_synced']);
        this.TABLE.push([this.COL_CREATED_AT, 'DATETIME', DbBaseModel.TYPE_DATE]);
        this.TABLE.push([this.COL_LOCAL_CREATED_AT, 'DATETIME', DbBaseModel.TYPE_DATE]);
        this.TABLE.push([this.COL_CREATED_BY, 'INT', DbBaseModel.TYPE_NUMBER]);
        this.TABLE.push([this.COL_UPDATED_AT, 'DATETIME', DbBaseModel.TYPE_DATE]);
        this.TABLE.push([this.COL_LOCAL_UPDATED_AT, 'DATETIME', DbBaseModel.TYPE_DATE]);
        this.TABLE.push([this.COL_UPDATED_BY, 'INT', DbBaseModel.TYPE_NUMBER]);
        this.TABLE.push([this.COL_CREATED_TERM, 'VARCHAR(255)', DbBaseModel.TYPE_STRING]);
        this.TABLE.push([this.COL_UPDATED_TERM, 'VARCHAR(255)', DbBaseModel.TYPE_STRING]);
        this.TABLE.push([this.COL_DELETED_AT, 'DATETIME', DbBaseModel.TYPE_DATE]);
        this.TABLE.push([this.COL_LOCAL_DELETED_AT, 'DATETIME', DbBaseModel.TYPE_DATE]);
        this.TABLE.push([this.COL_DELETED_BY, 'INT', DbBaseModel.TYPE_NUMBER]);

        if (!this.hasOwnProperty('user_id')) {
            this.TABLE.push([this.COL_ID_API, 'INT UNIQUE', DbBaseModel.TYPE_NUMBER, 'idApi']);
        } else {
            this.TABLE.push([this.COL_ID_API, 'INT', DbBaseModel.TYPE_NUMBER, 'idApi']);
        }
        return super.dbCreateTable();
    }

    /**
     * Loads additional boilerplate fields and calls the super method.
     *
     * @inheritDoc
     */
    public override loadFromAttributes(item: any): DbBaseModel {
        this.idApi = item[this.COL_ID_API];
        this.is_synced = item[this.COL_IS_SYNCED];
        this.created_at = this.getDateValue(item[this.COL_CREATED_AT]);
        this.local_created_at = this.getDateValue(item[this.COL_LOCAL_CREATED_AT]);
        this.created_by = this.getNumberValue(item[this.COL_CREATED_BY]);
        this.updated_at = this.getDateValue(item[this.COL_UPDATED_AT]);
        this.local_updated_at = this.getDateValue(item[this.COL_LOCAL_UPDATED_AT]);
        this.updated_by = this.getNumberValue(item[this.COL_UPDATED_BY]);
        this.created_term = this.getStringValue(item[this.COL_CREATED_TERM]);
        this.updated_term = this.getStringValue(item[this.COL_UPDATED_TERM]);
        this.deleted_at = this.getDateValue(item[this.COL_DELETED_AT]);
        this.local_deleted_at = this.getDateValue(item[this.COL_LOCAL_DELETED_AT]);
        this.deleted_by = this.getNumberValue(item[this.COL_DELETED_BY]);
        return super.loadFromAttributes(item);
    }

    /**
     * Event before this instance is saved in local db.
     *
     * @param isSynced optional param that indicates whether this record is synced with api or not
     */
    protected beforeSave(isSynced?: boolean) {
        this.is_synced = isSynced;
    }

    /**
     * Stores this api synced instance in sql lite db and creates
     * a new entry or updates this entry if the primary key is not empty.
     *
     * @param forceCreation optional param to force creation
     * @param updateCondition
     */
    public saveSynced(forceCreation?: boolean, updateCondition?: string): Promise<any> {
        return this.save(forceCreation, true, updateCondition, false);
    }

    /**
     * Stores this instance in sql lite db and creates a new entry
     * or updates this entry if the primary key is not empty.
     *
     * @param forceCreation optional param to force creation
     * @param isSynced optional param that indicates whether this record is synced with api or not
     * @param updateCondition optional fix updateCondition
     * @param isSaveLocaleDates
     * @override
     */
    public override save(forceCreation?: boolean, isSynced?: boolean, updateCondition?: string, isSaveLocaleDates: boolean = true): Promise<any> {
        if (!isSynced || !this.updateCondition) {
            if (updateCondition) {
                this.updateCondition = updateCondition;
            } else {
                this.setUpdateCondition();
            }
        }
        return new Promise(async (resolve) => {
            this.beforeSave(isSynced);
            const res = await this.exists();
            if (res) {
                if (isSaveLocaleDates) {
                  (this as any)[this.COL_LOCAL_UPDATED_AT] = new Date();
                }
                await this.update();
                this.unsetNotSavedModelUploadedFilePaths();
                resolve(true);
                return;
            } else {
                if (isSaveLocaleDates) {
                  (this as any)[this.COL_LOCAL_CREATED_AT] = new Date();
                  (this as any)[this.COL_LOCAL_UPDATED_AT] = new Date();
                }
                // console.log('before create');
                await this.create();
                // console.log('after create');
                this.unsetNotSavedModelUploadedFilePaths();
                resolve(true);
                return;
            }
        });
    }

    public setUpdateCondition() {
        this.updateCondition = [[this.COL_ID, (this as any)[this.COL_ID]]];
    }

    public remove(): Promise<any> {
        return new Promise(resolve => {
            try {
                this.deleteAllFiles();
                this.delete().then(() => resolve(true));
            } catch (error) {
                console.log('error in remove', error);
                resolve(false);
            }
        });
    }

    /**
     * Stores passed models in remote API server.
     *
     * @param models
     */
    public prepareBatchPost(models: DbApiModel[]): Promise<any[]> {
        return new Promise((resolve) => {
            const modelBodies: any[] = [];
            for (const model of models) {
                // Push the model in the data
                modelBodies.push(model.getBodyJson());
            }
            resolve(modelBodies);
        });
    }

    /**
     *
     *
     * Returns a Promise with information about the existing
     *
     * of this DbApiModel instance by its `updateCondition`
     *
     *
     *
     * @returns
     */
    public exists(condition?: any): Promise<boolean> {
        return new Promise((resolve) => {
            this.dbReady().then((db) => {
                if (db == null) {
                    resolve(false);
                } else {
                    if (!condition) {
                        condition = this.updateCondition;
                    }
                    const query = 'SELECT * FROM ' + this.TABLE_NAME + ' WHERE ' + this.parseWhere(condition);
                    if (query.indexOf('undefined') >= 0) {
                        resolve(false);
                    } else {
                        db.query(query).then((res: any) => {
                            resolve(res.rows.length > 0);
                        }).catch((err: any) => {
                            resolve(false);
                        });
                    }
                }
            });
        });
    }

    /**
     * Returns a json object with all attributes and its values.
     * This json is needed for the api batch sync.
     *
     * @return {}
     */
    public getBodyJson() {
        const obj: any = {};
        const columns = this.attributeNames();
        const types = this.columnTypes();

        obj[this.apiPk] = this.idApi;
        obj[this.COL_ID] = (this as any)[this.COL_ID];

        obj.deleted_at = this.formatApiDate((this as any)[this.COL_DELETED_AT]);
        obj.local_deleted_at = this.formatApiDate((this as any)[this.COL_LOCAL_DELETED_AT]);
        obj.local_updated_at = this.formatApiDate((this as any)[this.COL_LOCAL_UPDATED_AT]);
        obj.local_created_at = this.formatApiDate((this as any)[this.COL_LOCAL_CREATED_AT]);

        for (let i = 0; i < columns.length; i++) {
            const type: number = types[i];
            let value: any = (this as any)[columns[i]];

            //format value if required
            switch (type) {
                case DbBaseModel.TYPE_NUMBER:
                    if (isNaN(value)) {value = null;}
                    break;
                case DbBaseModel.TYPE_DATE:
                    value = this.formatApiDate(value);
                    break;
            }
            obj[columns[i]] = value;
        }
        return obj;
    }

    /// Model file part
    doesHaveFilesForPush() {
        // console.log('this.downloadMapping doesHaveFilesForPush', this.downloadMapping);
        if (!this.downloadMapping) {
            return false;
        }
        for (const fields of this.downloadMapping) {
            if ((this as any)[fields.localPath] && !(this as any)[fields.url]) {
                return true;
            }
        }

        return false;
    }

    getFieldsForPushFiles(): any[] {
        const fieldsForPush = [];
        for (const fields of this.downloadMapping) {
            if ((this as any)[fields.localPath] && !(this as any)[fields.url]) {
                fieldsForPush.push(fields);
            }
        }

        return fieldsForPush;
    }

    canThereBeFiles(): boolean {
        return this.downloadMapping && this.downloadMapping.length > 0;
    }

    isExistFileByIndex(columnNameIndex: number = 0): boolean {
        return this.isExistFileIndex(columnNameIndex) &&
            !!this.downloadMapping[columnNameIndex].name &&
            !!(this as any)[this.downloadMapping[columnNameIndex].name];
    }

    isExistFileIndex(columnNameIndex: number = 0): boolean {
        return this.canThereBeFiles() && !!this.downloadMapping[columnNameIndex];
    }
    /**
     *
     *
     * Download new files of a model
     *
     *
     *
     * @param oldModel the previous values
     * @param authorizationToken
     * @returns
     */
    pullFiles(oldModel: any, authorizationToken: string) {
        return new Promise(async (resolve) => {
            // No use downloading if not on app
            if (this.platform.is('mobileweb')) {
                resolve(true);
            }

            // Do we have files to upload?
            if (!this.canThereBeFiles()) {
                resolve(true);
                return;
            }
            for (const fileMap of this.downloadMapping) {
                this.downloadAndSaveFile(fileMap, oldModel, authorizationToken).then((result) => {
                    resolve(result);
                    return;
                });
            }
        });
    }

    protected async downloadAndSaveFile(fileMap: any, oldModel: any, authorizationToken: any) {
        if (!fileMap.name || !(this as any)[fileMap.name]) {
            return false;
        }
        let fileName = (this as any)[fileMap.name];
        if (oldModel && oldModel[fileMap.url] === (this as any)[fileMap.url]) {
          (this as any)[fileMap.name] = oldModel[fileMap.name];
            if (this.isExistThumbnail(fileMap)) {
                await this.downloadAndSaveFile(fileMap.thumbnail, oldModel, authorizationToken);
            }
            await this.saveSynced(true);
            return true;
        }
        if (!this.isExistFilePathInModel(fileMap)) {
            if (!(this as any)[fileMap.url]) {
              (this as any)[fileMap.name] = fileName;
              (this as any)[fileMap.localPath] = null;
                if (this.isExistThumbnail(fileMap) &&
                    (oldModel && oldModel[fileMap.url])
                ) {
                    (this as any)[fileMap.thumbnail.name] = null;
                    (this as any)[fileMap.thumbnail.url] = null;
                    (this as any)[fileMap.thumbnail.localPath] = null;
                }
                await this.saveSynced(true);
            }

            return false;
        }
        if (oldModel &&
            oldModel[fileMap.url] !== (this as any)[fileMap.url] &&
            oldModel[fileMap.name] === (this as any)[fileMap.name]
        ) {
            fileName = '1' + fileName;
        }
        // If we have a local path but no api path, we need to upload the file!
        // Only download if the new file is different than the old one? We don't have this information here.
        const finalPath = await this.downloadService.downloadAndSaveFile(
          (this as any)[fileMap.url],
            fileName,
            this.TABLE_NAME,
            authorizationToken
        );

        if (!finalPath) {
            return false;
        }
        (this as any)[fileMap.name] = fileName;
        (this as any)[fileMap.localPath] = finalPath;
        // We received the local path back if it's successful
        await this.saveSynced(true);
        // Delete old file
        if (oldModel && oldModel[fileMap.localPath] !== (this as any)[fileMap.localPath]) {
            await this.downloadService.deleteFile(oldModel[fileMap.localPath]);
        }
        if (this.isExistThumbnail(fileMap) &&
            (!oldModel || oldModel[fileMap.url] !== (this as any)[fileMap.url])
        ) {
            console.log('download thumbnail');
            await this.downloadAndSaveFile(fileMap.thumbnail, oldModel, authorizationToken);
        }

        return true;
    }

    isExistFilePathInModel(fileMap:any) {
        return fileMap.name &&
            fileMap.url &&
            (this as any)[fileMap.name] &&
            (this as any)[fileMap.url];
    }

    isExistThumbnail(fileMap: any): boolean {
        return (!!fileMap.thumbnail &&
            !!fileMap.thumbnail.name &&
            !!fileMap.thumbnail.url &&
            !!(this as any)[fileMap.thumbnail.name] &&
            !!(this as any)[fileMap.thumbnail.url]);
    }

    async setFile(recordedFile: RecordedFile, fileMapIndex = 0) {
        if (!this.platform.is('capacitor')) {
            this.setFilePropertyForBrowser(recordedFile, fileMapIndex);
        } else {
            recordedFile.uri = await this.downloadService.copy(recordedFile.uri, this.TABLE_NAME);
            if (recordedFile.thumbnailUri) {
                recordedFile.thumbnailUri = await this.downloadService.copy(recordedFile.thumbnailUri, this.TABLE_NAME);
            }
            if (recordedFile.uri) {
                this.setFileProperty(recordedFile, fileMapIndex);
            }
        }
    }

    setFilePropertyForBrowser(recordedFile: RecordedFile, columnNameIndex = 0, willDeleteFile = true) {
        console.log('check recorded file from setFileProperty method =>', recordedFile);

        const modelFileMap = this.downloadMapping[columnNameIndex];
        (this as any)[modelFileMap.name] = recordedFile.uri.substring(recordedFile.uri.lastIndexOf('/') + 1);
        (this as any)[modelFileMap.url] = recordedFile.uri;
        (this as any)[modelFileMap.localPath] = '';
        this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath = recordedFile.uri;
        /// If exist thumbnail for file
        if (modelFileMap.thumbnail) {

            (this as any)[modelFileMap.thumbnail.name] = recordedFile.thumbnailUri ? recordedFile.thumbnailUri.substr(recordedFile.thumbnailUri.lastIndexOf('/') + 1) : '';
            (this as any)[modelFileMap.thumbnail.url] = '';
            (this as any)[modelFileMap.thumbnail.localPath] = recordedFile.thumbnailUri ? recordedFile.thumbnailUri : '';
            (this.downloadMapping as any) [columnNameIndex].thumbnail.notSavedModelUploadedFilePath = recordedFile.thumbnailUri ? recordedFile.thumbnailUri : '';
        }
    }


    setFileProperty(recordedFile: RecordedFile, columnNameIndex = 0, willDeleteFile = true) {
        console.log('check recorded file from setFileProperty method =>', recordedFile);
        if (!this.isExistFileIndex(columnNameIndex)) {
            return;
        }
        const modelFileMap = this.downloadMapping[columnNameIndex];
        if (willDeleteFile) {
            if ((this as any)[modelFileMap.name]) {
                const attachedFileForDelete = (this as any)[modelFileMap.name] ? this.downloadService.getNativeFilePath((this as any)[modelFileMap.name], this.TABLE_NAME) : '';
                if ((this as any)[this.COL_ID] && !this.downloadMapping[columnNameIndex].originalFile && attachedFileForDelete) {
                    this.downloadMapping[columnNameIndex].originalFile = attachedFileForDelete;
                }
                if (!this.downloadMapping[columnNameIndex].attachedFilesForDelete) {
                    this.downloadMapping[columnNameIndex].attachedFilesForDelete = [];
                }
                (this.downloadMapping as any)[columnNameIndex].attachedFilesForDelete.push(attachedFileForDelete);
            }
        }
        (this as any)[modelFileMap.name] = recordedFile.uri.substring(recordedFile.uri.lastIndexOf('/') + 1);
        (this as any)[modelFileMap.url] = '';
        (this as any)[modelFileMap.localPath] = recordedFile.uri;
        this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath = recordedFile.uri;

        console.log(' (this as any)[modelFileMap.name]', (this as any)[modelFileMap.name]);
        console.log(' (this as any)[modelFileMap.localPath]', modelFileMap.localPath, (this as any)[modelFileMap.localPath]);

        /// If exist thumbnail for file
        if (modelFileMap.thumbnail) {
            if ((this as any)[this.COL_ID] && !(this.downloadMapping as any)[columnNameIndex].thumbnail.originalFile) {
                (this.downloadMapping as any)[columnNameIndex].thumbnail.originalFile = (this as any)[modelFileMap.thumbnail.name];
            }
            if (willDeleteFile) {
                if ((this as any)[modelFileMap.thumbnail.name]) {
                    const thumbnailAttachedFileForDelete = (this as any)[modelFileMap.thumbnail.name] ? this.downloadService.getNativeFilePath((this as any)[modelFileMap.thumbnail.name], this.TABLE_NAME) : '';
                    if ((this as any)[this.COL_ID] && !(this.downloadMapping as any)[columnNameIndex].thumbnail.originalFile && thumbnailAttachedFileForDelete) {
                        (this.downloadMapping as any)[columnNameIndex].thumbnail.originalFile = thumbnailAttachedFileForDelete;
                    }
                    if (!(this.downloadMapping as any)[columnNameIndex].thumbnail.attachedFilesForDelete) {
                        (this.downloadMapping as any)[columnNameIndex].thumbnail.attachedFilesForDelete = [];
                    }
                    (this.downloadMapping as any)[columnNameIndex].thumbnail.attachedFilesForDelete.push(thumbnailAttachedFileForDelete);
                }
            }
            (this as any)[modelFileMap.thumbnail.name] = recordedFile.thumbnailUri ? recordedFile.thumbnailUri.substr(recordedFile.thumbnailUri.lastIndexOf('/') + 1) : '';
            (this as any)[modelFileMap.thumbnail.url] = '';
            (this as any)[modelFileMap.thumbnail.localPath] = recordedFile.thumbnailUri ? recordedFile.thumbnailUri : '';
            (this.downloadMapping as any)[columnNameIndex].thumbnail.notSavedModelUploadedFilePath = recordedFile.thumbnailUri ? recordedFile.thumbnailUri : '';
        }
    }

    deleteAttachedFilesForDelete() {
        if (!this.canThereBeFiles()) {
            return;
        }
        this.downloadMapping.map((value, columnNameIndex) => {
            const fileMap = this.downloadMapping[columnNameIndex];
            if (fileMap.attachedFilesForDelete && fileMap.attachedFilesForDelete.length) {
                for (const attachedFileForDelete of fileMap.attachedFilesForDelete) {
                    if (attachedFileForDelete !== this.downloadMapping[columnNameIndex].originalFile) {
                        this.downloadService.deleteFile(attachedFileForDelete);
                    }
                }
            }
            this.downloadMapping[columnNameIndex].attachedFilesForDelete = [];
            if (this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath) {
                this.downloadService.deleteFile(this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath);
            }
            this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath = '';
            this.downloadMapping[columnNameIndex].originalFile = '';

            if (fileMap.thumbnail &&
                fileMap.thumbnail.attachedFilesForDelete &&
                fileMap.thumbnail.attachedFilesForDelete.length
            ) {
                for (const thumbnailAttachedFileForDelete of fileMap.thumbnail.attachedFilesForDelete) {
                    if (thumbnailAttachedFileForDelete !== (this.downloadMapping as any)[columnNameIndex].thumbnail.originalFile) {
                        this.downloadService.deleteFile(thumbnailAttachedFileForDelete);
                    }
                }
                (this.downloadMapping as any)[columnNameIndex].thumbnail.attachedFilesForDelete = [];
                if ((this.downloadMapping as any)[columnNameIndex].thumbnail.notSavedModelUploadedFilePath) {
                    this.downloadService.deleteFile((this.downloadMapping as any)[columnNameIndex].thumbnail.notSavedModelUploadedFilePath);
                }
                (this.downloadMapping as any)[columnNameIndex].thumbnail.notSavedModelUploadedFilePath = '';
                (this.downloadMapping as any)[columnNameIndex].thumbnail.originalFile = '';
            }
        });
    }

    deleteAllFiles() {
        if (!this.canThereBeFiles()) {
            return;
        }
        this.downloadMapping.map((fileMap, columnNameIndex) => {
            const filePath = (this as any)[fileMap.localPath];
            if (filePath) {
                this.downloadService.deleteFile(filePath);
            }
        });
        this.deleteAttachedFilesForDelete();
    }

    unsetNotSavedModelUploadedFilePaths() {
        if (!this.canThereBeFiles()) {
            return;
        }
        this.downloadMapping.map((value, columnNameIndex) => {
            if (this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath) {
                this.unsetNotSavedModelUploadedFilePath(columnNameIndex);
            }
        });
    }

    unsetNotSavedModelUploadedFilePath(columnNameIndex: any) {
        if (!this.isExistFileIndex(columnNameIndex) ||
            !this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath
        ) {
            return;
        }

        this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath = '';
    }

    public isExistFormatFile(fileMapIndex = 0) {
        return this.isVideoFile(fileMapIndex) ||
            this.isImageFile(fileMapIndex) ||
            this.isAudioFile(fileMapIndex) ||
            this.isPdf(fileMapIndex) ||
            this.is3dFile(fileMapIndex);
    }

    public isAudioFile(fileMapIndex = 0): boolean {
        return this.checkFileType(fileMapIndex, 'audio');
    }

    public isVideoFile(fileMapIndex = 0): boolean {
        return this.checkFileType(fileMapIndex, 'video');
    }

    public isImageFile(fileMapIndex = 0): boolean {
        return this.checkFileType(fileMapIndex, 'image');
    }

    public isPdf(fileMapIndex = 0): boolean {
        return this.checkFileType(fileMapIndex, 'pdf');
    }

    public is3dFile(fileMapIndex = 0): boolean {
        return this.checkFileType(fileMapIndex, '3d');
    }

    checkFileType(fileMapIndex: any, format: any): boolean {
        const localFilePath = this.getLocalFilePath(fileMapIndex);
        const fileName = this.getFileName(fileMapIndex);

        return this.downloadService.checkFileTypeByExtension(localFilePath, format) ||
            this.downloadService.checkFileTypeByExtension(fileName, format);
    }

    public getLocalFilePath(fileMapIndex = 0) {
        return (this as any)[this.downloadMapping[fileMapIndex].localPath];
    }

    public getFileUrl(fileMapIndex = 0) {
        return (this as any)[this.downloadMapping[fileMapIndex].url];
    }

    public getFileName(fileMapIndex = 0) {
        return (this as any)[this.downloadMapping[fileMapIndex].name];
    }

    public getApiThumbFilePath(fileMapIndex = 0) {
        return (this as any)[(this.downloadMapping as any)[fileMapIndex].thumbnail.name];
    }

    public isExistThumbOfFile(fileMapIndex = 0) {
        return this.isExistFileIndex(fileMapIndex) &&
            (this.downloadMapping as any)[fileMapIndex].thumbnail &&
            (this.downloadMapping as any)[fileMapIndex].thumbnail.name &&
            (this as any)[(this.downloadMapping as any)[fileMapIndex].thumbnail.name] &&
            (this as any)[(this.downloadMapping as any)[fileMapIndex].thumbnail.localPath];
    }

    public getFileImagePath(fileMapIndex = 0, sanitizeType = 'trustResourceUrl') {

        if (!this.platform.is('capacitor')) {

            let url = this.preview_file_path;

            if (url === undefined) {
                url = this.thumb_attached_file_path;
            }

            if (url === undefined) {
                url = this.attached_file_path;
            }
            return this.downloadService.previewSecuredImage(url);
        }
        if (!this.isExistFileByIndex(fileMapIndex)) {
            return this.defaultImage;
        }
        let imageName = null;
        if (this.isImageFile(fileMapIndex)) {
            imageName = this.getFileName(fileMapIndex);
        }
        else if (this.isExistThumbOfFile(fileMapIndex)) {
            imageName = this.getApiThumbFilePath(fileMapIndex);
        } else {
            return null;
        }

        try {
            imageName = encodeURI(imageName);
        } catch (error) {
            console.log(error);
        }
        return this.downloadService.getSanitizedFileUrl(imageName, this.TABLE_NAME, sanitizeType);
    }

    public getFilePath(basePath?: string, modelName?: string) {
        if (!basePath) {
            basePath = this.getFileName();
        }
        if (!modelName) {
            modelName = this.TABLE_NAME;
        }
        return this.downloadService.getNativeFilePath(basePath, modelName);
    }

    async updateLocalRelations() {
        ///
    }

    async beforePushDataToServer(isInsert?: boolean) {
        //
    }

    /// return additional models for push data to server
    async afterPushDataToServer(isInsert: boolean) {
        return [];
    }
}