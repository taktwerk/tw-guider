import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {DbApiModel} from "../../../models/base/db-api-model";
import {HttpClient} from "../../../services/http-client";
import {AppSetting} from "../../../services/app-setting";
import {UserDb} from "../../../models/db/user-db";
import {BehaviorSubject} from 'rxjs';
import {ApiSync} from '../../api-sync';
import {Events} from '@ionic/angular';

@Injectable()
export abstract class ApiService {
    /** holds all loaded model instances together */
    public data: DbApiModel[];
    /** holds the current "query" data **/
    public currentData: DbApiModel[];

    /** API URL to load data from the remote server */
    abstract loadUrl: string;
    /** new instance of a DbHelperApi Model to load records into model instances */
    abstract dbModelApi: DbApiModel;

    private isReady: boolean = true;

    /**
     * Version of the data
     * @type {number}
     */
    public dataVersion: number = 0;

    constructor(public http: HttpClient,
                public events: Events) {
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
        //return current data if service is busy
        if (!this.isReady) {
            return Promise.resolve(this.data);
        }

        //clean data if forceReload required
        if (forceReload) this.data = [];

        if (this.data.length > 0) {
            // already loaded data
            return Promise.resolve(this.data);
        }

        // don't have the data yet
        return new Promise(resolve => {
            this.isReady = false;
            this.http.get(AppSetting.API_URL + this.loadUrl)
                .map(res => res.json())
                .subscribe(data => {
                    this.isReady = true;
                    for (let record of data) {
                        let obj = this.dbModelApi.loadFromApi(record);
                        this.data.push(obj);
                        if (save) obj.save();
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
                //console.warn('ApiService', 'saveApi', 'no not synced data found');
                resolve(false);
              } else {
                this.dbModelApi.prepareBatchPost(<DbApiModel[]>models).then((res) => {
                  resolve(res);
                });
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
        let indexApi = this.data.findIndex(record => model.idApi && record.idApi === model.idApi);
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
                if (res) {
                    // this.addToList(model);
                }
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
            if (model[model.COL_ID_API] == null) {
                model.remove().then(res => {
                    this.removeFromList(model);
                    resolve(res);
                });
            } else {
                model[model.COL_DELETED_AT] = model[model.COL_LOCAL_DELETED_AT] = new Date();
                model.save().then(res => {
                    resolve(res);
                });
            }
        });
    }

    /**
     * Sync the files of a model. Download or upload new files.
     *
     * @param {DbApiModel} model
     * @returns {boolean}
     */
    public pushFiles(model: DbApiModel): Promise<boolean> {
        return new Promise((resolve) => {
          if (/*model.platform.is('core') || */model.platform.is('mobileweb')) {
            resolve(false);
            return;
          }
          // Do we have files to upload?
          if (!model.downloadMapping || model.downloadMapping.length <= 0) {
            resolve(false);
            return;
          }
          const url = AppSetting.API_URL + this.loadUrl + '/' + model.idApi + '/upload';
          const authToken = this.http.getAuthorizationToken();
          const uploadFilePromises = [];
          for (let fields of model.downloadMapping) {
            // If we have a local path but no api path, we need to upload the file!
            if (model[fields[2]] && !model[fields[1]]) {
              const fieldUrl = url + '?fileAttribute=' + fields[0];
              uploadFilePromises.push(
                  model.downloadService.startUpload(
                    model.TABLE_NAME,
                    fields[0],
                    model[fields[0]],
                    model[fields[2]],
                    fieldUrl,
                    authToken
                  )
                .then((result) => {
                  resolve(result);
                }).catch((err) => {
                      console.log('upload file', err);
                  })
              );
            }
          }

          Promise.all(uploadFilePromises).then(() => {
            resolve(true);
          });
        });
    }
}
