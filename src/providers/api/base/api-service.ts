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
    public lastQuery: null;

    /** API URL to load data from the remote server */
    abstract loadUrl: string;
    /** new instance of a DbHelperApi Model to load records into model instances */
    abstract dbModelApi: DbApiModel;

    private isReady: boolean = true;
    userDb: UserDb;

    /**
     * Version of the data
     * @type {number}
     */
    public dataVersion: number = 0;

    constructor(public http: HttpClient, public events: Events) {
        this.data = [];
        this.currentData = [];
    }

    public load(): Promise<any[]> {
        return this.loadApi();
    }

    public loadRefresh(): Promise<any[]> {
        return this.loadApi(true);
    }

    public loadRefreshSave(): Promise<any[]> {
        return this.loadApi(true, true);
    }

    /**
     * Return a new model
     * @returns {DbApiModel}
     */
    public newModel(): any {
        // Override in each service to create proper service
    }

    /**
     * Return the data sorted
     * @param property
     * @returns {DbApiModel[]}
     */
    public sorted(property: string) {
        return this.data.sort((a, b) => {
            return a[property] > b[property] ? 1 : a[property] < b[property] ? -1 : 0;
        });
    }

    /**
     * Return the data asorted by a property
     * @param property
     * @returns {DbApiModel[]}
     */
    public asorted(property: string) {
        return this.data.sort((a, b) => {
            return a[property] < b[property] ? 1 : a[property] > b[property] ? -1 : 0;
        });
    }

    /**
     * Filter the data
     * @param key
     * @param value
     * @returns {DbApiModel[]}
     */
    public filtered(key, value) {
        return this.data.filter(model => {
            //console.log('ApiService', 'Does ' + key + ' (' + model[key] + ') = ' + value + '?', model);
            return model[key] == value;
        });
    }

    /**
     * Filter the modal to available (non-deleted) entries.
     * @returns {DbApiModel[]}
     */
    public available() {
        return this.data.filter(model => {
            return model[model.COL_DELETED_AT] === '';
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
            console.warn('ApiService', 'loadApi', 'Service is busy... Abort HTTP-Request...');
            return Promise.resolve(this.data);
        }

        //clean data if forceReload required
        if (forceReload) this.data = [];

        if (this.data.length > 0) {
            //already loaded data
            return Promise.resolve(this.data);
        }

        //don't have the data yet
        return new Promise(resolve => {
            this.isReady = false;
            this.http.get(AppSetting.API_URL + this.loadUrl)
                .map(res => res.json())
                .subscribe(data => {
                    this.isReady = true;
                    //console.log('ApiService', 'loaded', data);
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
            let validation: boolean = true;
            //return current data if service is busy
            if (!this.isReady) {
                console.warn('ApiService', 'saveApi', 'Service is busy... Abort HTTP-Request...');
                validation = false;
                resolve(false);
            }

            if (validation && this.data.length == 0) {
                //data not yet loaded
                //console.warn('ApiService', 'saveApi', 'no data loaded... Abort HTTP-Request...');
                validation = false;
                resolve(false);
            }

            if (validation) {
              this.dbModelApi.searchAll(
                'WHERE ' + this.dbModelApi.parseWhere([this.dbModelApi.COL_IS_SYNCED, 0])
              )
                .then((models) => {
                  if (!models || models.length == 0) {
                    //console.warn('ApiService', 'saveApi', 'no not synced data found');
                    resolve(false);
                  } else {
                    this.dbModelApi.prepareBatchPost(<DbApiModel[]>models).then((res) => {
                      console.info('ApiService', 'saveApi', 'done');
                      resolve(res);
                    });
                  }
                });
            }
        });
    }

    /**
     * Returns a promise with all DbApiModels of this service's
     * DbApiModel-Object that are stored in local db.
     * @return {Promise<T>}
     */
    public loadFromDb(): Promise<any> {
        return new Promise(resolve => {
            this.dbModelApi.findAll().then((data) => {
                if (data) {
                    this.data = data;
                    resolve(data);
                } else {
                    resolve(false);
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

        console.log('add to list');

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
            //update list item
            //console.log(model.TAG, 'Api-Service', 'RemoveFromList', 'update', 'API', indexApi);
            this.data.splice(indexApi, 1);
        } else if (indexDB !== -1) {
            //update list item
            //console.log(model.TAG, 'Api-Service', 'RemoveFromList', 'update', 'DB', indexDB);
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
                    console.log(model.TAG, 'Service Save', 'Add to list ready', model);
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
                model[model.COL_DELETED_AT] = new Date();
                model.save().then(res => {
                    resolve(res);
                })
            }
        });
    }

    /**
     * Get an object based on ID (first by api id, then by internal id)
     * @param id
     * @returns Any
     */
    public findById(id: number): any {
        const indexApi = this.data.findIndex(record => record.idApi === id);
        const indexDb = this.data.findIndex(record => record.id === id);
        if (indexApi !== -1) {
            return this.data[indexApi];
        } else if (indexDb !== -1) {
            return this.data[indexDb];
        } else {
            return null;
        }
    }

    /**
     * Sync the files of a model. Download or upload new files.
     *
     * @param {DbApiModel} model
     * @returns {boolean}
     */
    public pushFiles(model: DbApiModel) : Promise<boolean>
    {
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
          let url = AppSetting.API_URL + this.loadUrl + '/' + model.idApi + '/upload';
          let authToken = this.http.getAuthorizationToken();
          let uploadFilePromises = [];
          for (let fields of model.downloadMapping) {
            // If we have a local path but no api path, we need to upload the file!
            if (model[fields[2]] && !model[fields[1]]) {
              let fieldUrl = url + '?fileAttribute=' + fields[0];
              uploadFilePromises.push(
                  model.downloadService.upload(
                    fields[0],
                    model[fields[0]],
                    model[fields[2]],
                    fieldUrl,
                    authToken
                  )
                .then((result) => {
                  console.log('uploadFilePromises push then');
                  resolve(result);
                })
              );
            }
          }

          Promise.all(uploadFilePromises).then(() => {
            console.log('all promises');
            resolve(true);
          });
        });
    }
}
