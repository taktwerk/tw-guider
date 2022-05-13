
import { DbBaseModel } from './db-base-model';
import { RecordedFile } from '../../services/download-service';

export class BaseFileMapInModel {
    public name: string;
    public url: string;
    public localPath: string;
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
    loadUrl: string;
    public defaultImage = '/assets/placeholder.jpg';
    /** flag that indicate either a record is synced with the API or not */
    public is_synced: boolean;
    /** primary key */
    public idApi: number;
    /** name of the primary key from API (required to sync records) */
    public abstract apiPk: string;

    //API boilerplate default fields members
    public created_at: Date;
    public local_created_at: Date;
    public created_by: number;
    public updated_at: Date;
    public local_updated_at: Date;
    public updated_by: number;
    public created_term: string;
    public updated_term: string;
    public deleted_at: Date;
    public local_deleted_at: Date;
    public deleted_by: number;

    public migrations = [];

    // download mapping
    public downloadMapping: FileMapInModel[];

    // API boilerplate default fields columns
    /** local column that indicates if the record is synced with the API */
    public COL_IS_SYNCED: string = '_is_synced';
    /** id's column name */
    public COL_ID_API: string = 'id';
    /** date time when this record was created on API */
    public COL_CREATED_AT: string = 'created_at';
    public COL_LOCAL_CREATED_AT: string = 'local_created_at';
    public COL_CREATED_BY: string = 'created_by';
    public COL_CREATED_TERM: string = 'created_term';

    /** date time when this record was updated on API */
    public COL_UPDATED_AT: string = 'updated_at';
    public COL_LOCAL_UPDATED_AT: string = 'local_updated_at';
    public COL_UPDATED_BY: string = 'updated_by';
    public COL_UPDATED_TERM: string = 'updated_term';

    /** date time when this record was deleted on API */
    public COL_DELETED_AT: string = 'deleted_at';
    public COL_LOCAL_DELETED_AT: string = 'local_deleted_at';
    public COL_DELETED_BY: string = 'deleted_by';

    /**
     * Constructor
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
     * @param apiObj row received from API
     * @param oldModel
     */
    public loadFromApi(apiObj: any, oldModel = null): DbApiModel {
        let obj: DbApiModel = null;
        obj = new (<any>this.constructor);
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
                                if (apiObj[memberNameOfFile] !== undefined && this[memberNameOfFile] === apiObj[memberNameOfFile]) {
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
                const type: number = parseInt(column[2]);
                const memberName = column[3] ? column[3] : columnName;
                if (apiObj[memberName] !== undefined) {
                    this[memberName] = this.getObjectByType(apiObj[memberName], type);
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
     * Creates the db table for the extended db class.
     * @returns {Promise<any>}
     */
    public dbCreateTable(): Promise<any> {
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
     * @inheritDoc
     */
    public loadFromAttributes(item: any): DbBaseModel {
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
     * @param isSynced optional param that indicates whether this record is synced with api or not
     */
    protected beforeSave(isSynced?: boolean) {
        this.is_synced = isSynced;
    }

    /**
     * Stores this api synced instance in sql lite db and creates
     * a new entry or updates this entry if the primary key is not empty.
     * @param forceCreation optional param to force creation
     * @param updateCondition
     */
    public saveSynced(forceCreation?: boolean, updateCondition?: string): Promise<any> {
        return this.save(forceCreation, true, updateCondition, false);
    }

    /**
     * Stores this instance in sql lite db and creates a new entry
     * or updates this entry if the primary key is not empty.
     * @param forceCreation optional param to force creation
     * @param isSynced optional param that indicates whether this record is synced with api or not
     * @param updateCondition optional fix updateCondition
     * @param isSaveLocaleDates
     * @override
     */
    public save(forceCreation?: boolean, isSynced?: boolean, updateCondition?: string, isSaveLocaleDates: boolean = true): Promise<any> {
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
                    this[this.COL_LOCAL_UPDATED_AT] = new Date();
                }
                await this.update();
                this.unsetNotSavedModelUploadedFilePaths();
                resolve(true);
                return;
            } else {
                if (isSaveLocaleDates) {
                    this[this.COL_LOCAL_CREATED_AT] = new Date();
                    this[this.COL_LOCAL_UPDATED_AT] = new Date();
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
        this.updateCondition = [[this.COL_ID, this[this.COL_ID]]];
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
     * @param models
     */
    public prepareBatchPost(models: DbApiModel[]): Promise<any[]> {
        return new Promise((resolve) => {
            let modelBodies: any[] = [];
            for (let model of models) {
                // Push the model in the data
                modelBodies.push(model.getBodyJson());
            }
            resolve(modelBodies);
        });
    }

    /**
     * Returns a Promise with information about the existing
     * of this DbApiModel instance by its `updateCondition`
     * @returns {Promise<T>}
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
                    let query = "SELECT * FROM " + this.TABLE_NAME + " WHERE " + this.parseWhere(condition);
                    if (query.indexOf('undefined') >= 0) {
                        resolve(false);
                    } else {
                        db.query(query).then((res) => {
                            resolve(res.rows.length > 0);
                        }).catch((err) => {
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
     * @return {}
     */
    public getBodyJson(): {} {
        let obj = {};
        let columns = this.attributeNames();
        let types = this.columnTypes();

        obj[this.apiPk] = this.idApi;
        obj[this.COL_ID] = this[this.COL_ID];

        obj['deleted_at'] = this.formatApiDate(this[this.COL_DELETED_AT]);
        obj['local_deleted_at'] = this.formatApiDate(this[this.COL_LOCAL_DELETED_AT]);
        obj['local_updated_at'] = this.formatApiDate(this[this.COL_LOCAL_UPDATED_AT]);
        obj['local_created_at'] = this.formatApiDate(this[this.COL_LOCAL_CREATED_AT]);

        for (let i = 0; i < columns.length; i++) {
            const type: number = types[i];
            let value: any = this[columns[i]];

            //format value if required
            switch (type) {
                case DbBaseModel.TYPE_NUMBER:
                    if (isNaN(value)) value = null;
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
            if (this[fields.localPath] && !this[fields.url]) {
                return true;
            }
        }

        return false;
    }

    getFieldsForPushFiles(): any[] {
        const fieldsForPush = [];
        for (const fields of this.downloadMapping) {
            if (this[fields.localPath] && !this[fields.url]) {
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
            !!this[this.downloadMapping[columnNameIndex].name];
    }

    isExistFileIndex(columnNameIndex: number = 0): boolean {
        return this.canThereBeFiles() && !!this.downloadMapping[columnNameIndex];
    }
    /**
     * Download new files of a model
     *
     * @param {DbApiModel} oldModel the previous values
     * @param authorizationToken
     * @returns {boolean}
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

    protected async downloadAndSaveFile(fileMap: any, oldModel, authorizationToken) {
        if (!fileMap.name || !this[fileMap.name]) {
            return false;
        }
        let fileName = this[fileMap.name];
        if (oldModel && oldModel[fileMap.url] === this[fileMap.url]) {
            this[fileMap.name] = oldModel[fileMap.name];
            if (this.isExistThumbnail(fileMap)) {
                await this.downloadAndSaveFile(fileMap.thumbnail, oldModel, authorizationToken);
            }
            await this.saveSynced(true);
            return true;
        }
        if (!this.isExistFilePathInModel(fileMap)) {
            if (!this[fileMap.url]) {
                this[fileMap.name] = fileName;
                this[fileMap.localPath] = null;
                if (this.isExistThumbnail(fileMap) &&
                    (oldModel && oldModel[fileMap.url])
                ) {
                    this[fileMap.thumbnail.name] = null;
                    this[fileMap.thumbnail.url] = null;
                    this[fileMap.thumbnail.localPath] = null;
                }
                await this.saveSynced(true);
            }

            return false;
        }
        if (oldModel &&
            oldModel[fileMap.url] !== this[fileMap.url] &&
            oldModel[fileMap.name] === this[fileMap.name]
        ) {
            fileName = '1' + fileName;
        }
        // If we have a local path but no api path, we need to upload the file!
        // Only download if the new file is different than the old one? We don't have this information here.
        const finalPath = await this.downloadService.downloadAndSaveFile(
            this[fileMap.url],
            fileName,
            this.TABLE_NAME,
            authorizationToken
        );
        console.log("check final path on DB----->", finalPath);
        if (!finalPath) {
            return false;
        }
        this[fileMap.name] = fileName;
        this[fileMap.localPath] = finalPath;
        // We received the local path back if it's successful
        await this.saveSynced(true);
        // Delete old file
        if (oldModel && oldModel[fileMap.localPath] !== this[fileMap.localPath]) {
            await this.downloadService.deleteFile(oldModel[fileMap.localPath]);
        }
        if (this.isExistThumbnail(fileMap) &&
            (!oldModel || oldModel[fileMap.url] !== this[fileMap.url])
        ) {
            console.log('download thumbnail');
            await this.downloadAndSaveFile(fileMap.thumbnail, oldModel, authorizationToken);
        }

        return true;
    }

    isExistFilePathInModel(fileMap) {
        return fileMap.name &&
            fileMap.url &&
            this[fileMap.name] &&
            this[fileMap.url];
    }

    isExistThumbnail(fileMap: any): boolean {
        return (!!fileMap.thumbnail &&
            !!fileMap.thumbnail.name &&
            !!fileMap.thumbnail.url &&
            !!this[fileMap.thumbnail.name] &&
            !!this[fileMap.thumbnail.url]);
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
        console.log("check recorded file from setFileProperty method =>", recordedFile);

        const modelFileMap = this.downloadMapping[columnNameIndex];
        this[modelFileMap.name] = recordedFile.uri.substring(recordedFile.uri.lastIndexOf('/') + 1);
        this[modelFileMap.url] = recordedFile.uri;
        this[modelFileMap.localPath] = '';
        this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath = recordedFile.uri;
        /// If exist thumbnail for file
        if (modelFileMap.thumbnail) {

            this[modelFileMap.thumbnail.name] = recordedFile.thumbnailUri ? recordedFile.thumbnailUri.substr(recordedFile.thumbnailUri.lastIndexOf('/') + 1) : '';
            this[modelFileMap.thumbnail.url] = '';
            this[modelFileMap.thumbnail.localPath] = recordedFile.thumbnailUri ? recordedFile.thumbnailUri : '';
            this.downloadMapping[columnNameIndex].thumbnail.notSavedModelUploadedFilePath = recordedFile.thumbnailUri ? recordedFile.thumbnailUri : '';
        }
    }


    setFileProperty(recordedFile: RecordedFile, columnNameIndex = 0, willDeleteFile = true) {
        console.log("check recorded file from setFileProperty method =>", recordedFile);
        if (!this.isExistFileIndex(columnNameIndex)) {
            return;
        }
        const modelFileMap = this.downloadMapping[columnNameIndex];
        if (willDeleteFile) {
            if (this[modelFileMap.name]) {
                const attachedFileForDelete = this[modelFileMap.name] ? this.downloadService.getNativeFilePath(this[modelFileMap.name], this.TABLE_NAME) : '';
                if (this[this.COL_ID] && !this.downloadMapping[columnNameIndex].originalFile && attachedFileForDelete) {
                    this.downloadMapping[columnNameIndex].originalFile = attachedFileForDelete;
                }
                if (!this.downloadMapping[columnNameIndex].attachedFilesForDelete) {
                    this.downloadMapping[columnNameIndex].attachedFilesForDelete = [];
                }
                this.downloadMapping[columnNameIndex].attachedFilesForDelete.push(attachedFileForDelete);
            }
        }
        this[modelFileMap.name] = recordedFile.uri.substring(recordedFile.uri.lastIndexOf('/') + 1);
        this[modelFileMap.url] = '';
        this[modelFileMap.localPath] = recordedFile.uri;
        this.downloadMapping[columnNameIndex].notSavedModelUploadedFilePath = recordedFile.uri;

        console.log(" this[modelFileMap.name]", this[modelFileMap.name])
        console.log(" this[modelFileMap.localPath]", modelFileMap.localPath, this[modelFileMap.localPath])

        /// If exist thumbnail for file
        if (modelFileMap.thumbnail) {
            if (this[this.COL_ID] && !this.downloadMapping[columnNameIndex].thumbnail.originalFile) {
                this.downloadMapping[columnNameIndex].thumbnail.originalFile = this[modelFileMap.thumbnail.name];
            }
            if (willDeleteFile) {
                if (this[modelFileMap.thumbnail.name]) {
                    const thumbnailAttachedFileForDelete = this[modelFileMap.thumbnail.name] ? this.downloadService.getNativeFilePath(this[modelFileMap.thumbnail.name], this.TABLE_NAME) : '';
                    if (this[this.COL_ID] && !this.downloadMapping[columnNameIndex].thumbnail.originalFile && thumbnailAttachedFileForDelete) {
                        this.downloadMapping[columnNameIndex].thumbnail.originalFile = thumbnailAttachedFileForDelete;
                    }
                    if (!this.downloadMapping[columnNameIndex].thumbnail.attachedFilesForDelete) {
                        this.downloadMapping[columnNameIndex].thumbnail.attachedFilesForDelete = [];
                    }
                    this.downloadMapping[columnNameIndex].thumbnail.attachedFilesForDelete.push(thumbnailAttachedFileForDelete);
                }
            }
            this[modelFileMap.thumbnail.name] = recordedFile.thumbnailUri ? recordedFile.thumbnailUri.substr(recordedFile.thumbnailUri.lastIndexOf('/') + 1) : '';
            this[modelFileMap.thumbnail.url] = '';
            this[modelFileMap.thumbnail.localPath] = recordedFile.thumbnailUri ? recordedFile.thumbnailUri : '';
            this.downloadMapping[columnNameIndex].thumbnail.notSavedModelUploadedFilePath = recordedFile.thumbnailUri ? recordedFile.thumbnailUri : '';
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
                    if (thumbnailAttachedFileForDelete !== this.downloadMapping[columnNameIndex].thumbnail.originalFile) {
                        this.downloadService.deleteFile(thumbnailAttachedFileForDelete);
                    }
                }
                this.downloadMapping[columnNameIndex].thumbnail.attachedFilesForDelete = [];
                if (this.downloadMapping[columnNameIndex].thumbnail.notSavedModelUploadedFilePath) {
                    this.downloadService.deleteFile(this.downloadMapping[columnNameIndex].thumbnail.notSavedModelUploadedFilePath);
                }
                this.downloadMapping[columnNameIndex].thumbnail.notSavedModelUploadedFilePath = '';
                this.downloadMapping[columnNameIndex].thumbnail.originalFile = '';
            }
        });
    }

    deleteAllFiles() {
        if (!this.canThereBeFiles()) {
            return;
        }
        this.downloadMapping.map((fileMap, columnNameIndex) => {
            const filePath = this[fileMap.localPath];
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

    unsetNotSavedModelUploadedFilePath(columnNameIndex) {
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

    checkFileType(fileMapIndex, format): boolean {
        const localFilePath = this.getLocalFilePath(fileMapIndex);
        const fileName = this.getFileName(fileMapIndex);

        return this.downloadService.checkFileTypeByExtension(localFilePath, format) ||
            this.downloadService.checkFileTypeByExtension(fileName, format);
    }

    public getLocalFilePath(fileMapIndex = 0) {
        return this[this.downloadMapping[fileMapIndex].localPath];
    }

    public getFileUrl(fileMapIndex = 0) {
        return this[this.downloadMapping[fileMapIndex].url];
    }

    public getFileName(fileMapIndex = 0) {
        return this[this.downloadMapping[fileMapIndex].name];
    }

    public getApiThumbFilePath(fileMapIndex = 0) {
        return this[this.downloadMapping[fileMapIndex].thumbnail.name];
    }

    public isExistThumbOfFile(fileMapIndex = 0) {
        return this.isExistFileIndex(fileMapIndex) &&
            this.downloadMapping[fileMapIndex].thumbnail &&
            this.downloadMapping[fileMapIndex].thumbnail.name &&
            this[this.downloadMapping[fileMapIndex].thumbnail.name] &&
            this[this.downloadMapping[fileMapIndex].thumbnail.localPath];
    }

    public getFileImagePath(fileMapIndex = 0, sanitizeType = 'trustResourceUrl') {

        if (!this.platform.is('capacitor')) {

            let url = this['preview_file_path'];

            if (url == undefined) {
                url = this['thumb_attached_file_path'];
            }

            if (url == undefined) {
                url = this['attached_file_path'];
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
            console.log(error)
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
