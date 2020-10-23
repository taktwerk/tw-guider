import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {DbApiModel} from '../../../models/base/db-api-model';
import {HttpClient} from '../../../services/http-client';
import {AppSetting} from '../../../services/app-setting';
import {Events} from '@ionic/angular';
import {UserDb} from '../../../models/db/user-db';
import {HttpHeaders as Headers} from '@angular/common/http';

@Injectable()
export abstract class ApiService {
    /** holds all loaded model instances together */
    public data: DbApiModel[];
    // tslint:disable-next-line:jsdoc-format
    /** holds the current "query" data **/
    public currentData: DbApiModel[];

    /** API URL to load data from the remote server */
    abstract loadUrl: string;
    /** new instance of a DbHelperApi Model to load records into model instances */
    abstract dbModelApi: DbApiModel;

    private isReady = true;

    /**
     * Version of the data
     */
    public dataVersion = 0;

    protected constructor(public http: HttpClient,
                          public events: Events,
                          public appSetting: AppSetting) {
        this.data = [];
        this.currentData = [];
    }

    public load(): Promise<any[]> {
        return this.loadApi();
    }

    /**
     * Return a new model
     * @returns {DbApiModel}
     */
    public newModel(): any {
        // Override in each service to create proper service
    }

    /**
     * Filter the modal to available (non-deleted) entries.
     * @returns {DbApiModel[]}
     */
    public available() {
        return this.data.filter(model => {
            return model[model.COL_DELETED_AT] === '' && model[model.COL_LOCAL_DELETED_AT] === '';
        });
    }

    /**
     * Loads data from the remote server API.
     * @param forceReload
     * @returns {any}
     */
    private loadApi(forceReload?: boolean, save?: boolean): Promise<any[]> {
        // return current data if service is busy
        if (!this.isReady) {
            return Promise.resolve(this.data);
        }

        // clean data if forceReload required
        if (forceReload) { this.data = []; }

        if (this.data.length > 0) {
            // already loaded data
            return Promise.resolve(this.data);
        }

        // don't have the data yet
        return new Promise(resolve => {
            this.isReady = false;
            this.http.get(this.appSetting.getApiUrl() + this.loadUrl)
                .map(res => res.json())
                .subscribe(data => {
                    this.isReady = true;
                    for (const record of data) {
                        const obj = this.dbModelApi.loadFromApi(record);
                        this.data.push(obj);
                        if (save) { obj.save(); }
                    }
                    resolve(this.data);
                });
        });
    }

    /**
     * Stores local (unsynced) data into remote server API.
     * @returns Promise<any[]>
     */
    public prepareBatchPost(): Promise<any> {
        return new Promise(resolve => {
          this.dbModelApi.searchAll(
            this.dbModelApi.parseWhere([this.dbModelApi.COL_IS_SYNCED, 0])
          )
            .then((models) => {
              if (!models || models.length === 0) {
                resolve(false);
              } else {
                  resolve(models);
                // this.dbModelApi.prepareBatchPost(<DbApiModel[]> models).then((res) => {
                //   resolve(res);
                // });
              }
            });
        });
    }

    /**
     * Adds a new data record to the service's data list if not already added. Checks both API ids and local ids
     * @param newData
     */
    public addToList(newData: DbApiModel) {
        let indexApi = this.data.findIndex(record => newData.idApi && record.idApi === newData.idApi);
        let indexDB = this.data.findIndex(record => newData.id && record.id === newData.id);
        if (indexApi !== -1) {
            this.data[indexApi] = newData;
        } else if (indexDB !== -1) {
            this.data[indexDB] = newData;
        } else {
            this.data.push(newData);

            // Now that the file has been added and has an ID, let's download its files if there are any
            //this.downloadFiles(newData);
        }

        this.dataVersion++;
    }

    /**
     *
     * @param {DbApiModel} model
     */
    public removeFromList(model: DbApiModel) {
        const indexApi = this.data.findIndex(record => model.idApi && record.idApi === model.idApi);
        let indexDB = this.data.findIndex(record => model.id && record.id === model.id);
        if (indexApi !== -1) {
            this.data.splice(indexApi, 1);
        } else if (indexDB !== -1) {
            this.data.splice(indexDB, 1);
        }

        this.dataVersion++;
    }

    /**
     * Save a model to the service and add it to the data list automatically. This is the
     * prefered way to save a model from the controllers/services so that it is added directly
     * to the service.
     * @param model
     */
    public save(model: DbApiModel): Promise<any> {
        return new Promise(resolve => {
            model.save().then(res => {
                resolve(res);
            });
        });
    }

    /**
     * Delete a model
     */
    public remove(model: DbApiModel): Promise<any> {
        return new Promise(resolve => {
            // No sync with the API yet? Only local? Delete it
            if (model.idApi == null) {
                model.remove().then(res => {
                    this.removeFromList(model);
                    resolve(res);
                });
            } else {
                model[model.COL_DELETED_AT] = model[model.COL_LOCAL_DELETED_AT] = new Date();
                model.save().then(res => {
                    model.deleteAllFiles();
                    resolve(res);
                });
            }
        });
    }

    /**
     * Sync the files of a model. Download or upload new files.
     *
     * @param {DbApiModel} model
     * @param userForSaving
     * @returns {boolean}
     */
    public pushFiles(model: DbApiModel, userForSaving?: UserDb): Promise<boolean> {
        console.log('push files to server');
        return new Promise(async (resolve) => {
          if (model.platform.is('mobileweb')) {
            resolve(false);
            return;
          }
          // Do we have files to upload?
          if (!model.canThereBeFiles()) {
            resolve(false);
            return;
          }
          const url = this.appSetting.getApiUrl() + this.loadUrl + '/' + model.idApi + '/upload';
          const headers = new Headers({'X-Auth-Token': this.http.getAuthorizationToken()});
          const uploadFilePromises = [];
          console.log('MODEL.DOWNLOADMAPPING', model.downloadMapping );
          for (const fields of model.downloadMapping) {
            console.log('in forrrrr of pushing files');
            // If we have a local path but no api path, we need to upload the file!
            if (model[fields.localPath] && !model[fields.url]) {
                console.log('model[fields.localPath] && !model[fields.url] pushing files');
                const fieldUrl = url + '?fileAttribute=' + fields.name;
                console.log('fieledUrl  pushing files', fieldUrl);
                try {
                    console.log('in try catcj of push');
                    const uploadResult = await model.downloadService.startUpload(
                        model.TABLE_NAME,
                        fields.name,
                        model[fields.name],
                        model[fields.localPath],
                        fieldUrl,
                        headers
                    );
                    console.log('uploadResult', uploadResult );
                    if (uploadResult) {
                       // await this.saveSyncedModel(uploadResult, false, false); // WAS COMMENTED
                        console.log('SAVEED');
                        if (userForSaving) {
                            userForSaving.userSetting.appDataVersion++;
                            await userForSaving.save();
                        }
                    }
                } catch (err) {
                    console.log('upload file', err);
                }
            }
          }

          resolve(true);
        });
    }

    async saveSyncedModel(newModel, canUpdateNotSyncedData = false, willChangeFiles = true) {
        let oldModel = await this.dbModelApi.findFirst(['id', newModel[this.dbModelApi.apiPk]]);
        oldModel = oldModel[0] ? oldModel[0] : null;
        if (newModel.deleted_at) {
            if (oldModel) {
                oldModel.remove();
            }
            return true;
        }
        const obj = this.newModel();
        if (oldModel) {
            obj.loadFromApiToCurrentObject(oldModel);
        }
        obj.loadFromApiToCurrentObject(newModel, oldModel, willChangeFiles);
        let isSynced = true;
        if (!canUpdateNotSyncedData && oldModel && !oldModel.is_synced && oldModel.doesHaveFilesForPush()) {
            const fieldsForPush = oldModel.getFieldsForPushFiles();

            for (let i = 0; i < fieldsForPush.length; i++) {
                const fieldForPush = fieldsForPush[i];
                obj[fieldForPush.name] = oldModel[fieldForPush.name];
                obj[fieldForPush.url] = oldModel[fieldForPush.url];
                obj[fieldForPush.localPath] = oldModel[fieldForPush.localPath];
                if (fieldForPush.thumbnail) {
                    obj[fieldForPush.thumbnail.name] = oldModel[fieldForPush.thumbnail.name];
                    obj[fieldForPush.thumbnail.url] = oldModel[fieldForPush.thumbnail.url];
                    obj[fieldForPush.thumbnail.localPath] = oldModel[fieldForPush.thumbnail.localPath];
                }
            }

            isSynced = false;
        }
        obj.is_synced = isSynced;
        let updateCondition = null;
        if (obj.idApi) {
            if (!isSynced) {
                updateCondition = `${obj.COL_ID_API} = ${obj.idApi}`;
            } else {
                obj.updateCondition = [[obj.COL_ID_API, obj.idApi]];
            }
        }
        if (!oldModel || oldModel.updated_at !== obj.updated_at) {
            await obj.save(false, isSynced, updateCondition, false);
        }
        await obj.updateLocalRelations();
        return await obj.pullFiles(oldModel, this.http.getAuthorizationToken());
    }
}
