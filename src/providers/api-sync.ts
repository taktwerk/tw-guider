import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '../services/http-client';
import {AppSetting} from '../services/app-setting';
import {UserDb} from '../models/db/user-db';
import {DbProvider} from './db-provider';
import {Platform, Events} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from './api/base/api-service';
import {DbApiModel} from '../models/base/db-api-model';

import {GuiderService} from './api/guider-service';
import {DownloadService} from '../services/download-service';
import 'rxjs/add/observable/forkJoin';
import {GuideCategoryService} from './api/guide-category-service';
import {GuideCategoryBindingService} from './api/guide-category-binding-service';
import {GuideStepService} from './api/guide-step-service';
import {Network} from '@ionic-native/network/ngx';

@Injectable()
/**
 * This Service provides a sync of all registered API Services under apiService.
 * Make sure to add this Instance to the constructor of your page, that should first call this ApiSync.
 */
export class ApiSync {
    private isBusy: boolean = false;

    /**
     * Contains all services to sync.
     * Use for each service a key that matches the received key from the API in 'models'.
     * @type {{reason: ReasonService}}
     */
    apiServices: any = {
        guide: this.guideService,
        guide_category: this.guideCategoryService,
        guide_category_binding: this.guideCategoryBindingService,
        guide_step: this.guideStepService
    };
    userDb: UserDb;

    isStartSyncBehaviorSubject: BehaviorSubject<boolean>;
    isStartPushBehaviorSubject: BehaviorSubject<boolean>;
    pushedItemsCount: BehaviorSubject<number>;
    pushedItemsPercent: BehaviorSubject<number>;
    pushProgressStatus: BehaviorSubject<string>;
    syncItemsCount: BehaviorSubject<number>;
    syncedItemsCount: BehaviorSubject<number>;
    syncProgressStatus: BehaviorSubject<string>;
    syncedItemsPercent: BehaviorSubject<number>;
    isPrepareSynData: BehaviorSubject<boolean>;

    /**
     * ApiSync Constructor
     */
    constructor(
        public http: HttpClient,
        private platform: Platform,
        private db: DbProvider,
        private events: Events,
        private guideService: GuiderService,
        private guideCategoryService: GuideCategoryService,
        private guideCategoryBindingService: GuideCategoryBindingService,
        private guideStepService: GuideStepService,
        private downloadService: DownloadService,
        private network: Network
    ) {
        this.isStartSyncBehaviorSubject = new BehaviorSubject<boolean>(false);
        this.isStartPushBehaviorSubject = new BehaviorSubject<boolean>(false);
        this.pushedItemsCount = new BehaviorSubject<number>(0);
        this.pushedItemsPercent = new BehaviorSubject<number>(0);
        this.pushProgressStatus = new BehaviorSubject<string>('initial');
        this.syncedItemsCount = new BehaviorSubject<number>(0);
        this.syncedItemsPercent = new BehaviorSubject<number>(0);
        this.syncProgressStatus = new BehaviorSubject<string>('initial');
        this.isPrepareSynData = new BehaviorSubject<boolean>(false);
        this.init();
        this.initializeEvents();
    }

    initializeEvents() {
        this.events.subscribe('UserDb:create', (userDb) => {
            this.userDb = userDb;
        });
        this.events.subscribe('UserDb:update', (userDb) => {
            this.userDb = userDb;
        });
    }

    /**
     * Loads the current logged in user.
     */
    private init(): Promise<any> {
        if (this.userDb) {
          return new Promise(resolve => {
              resolve(true);
          });
        }

        return new Promise(resolve => {
            new UserDb(this.platform, this.db, this.events, this.downloadService).getCurrent().then((userDb) => {
                if (userDb) {
                    this.userDb = userDb;
                    if (
                        this.userDb.userSetting.syncStatus &&
                        (
                          this.syncProgressStatus.getValue() !== 'progress' &&
                          this.syncProgressStatus.getValue() !== 'resume' &&
                          this.syncProgressStatus.getValue() !== 'not_sync'
                        )
                    ) {
                      this.syncProgressStatus.next(this.userDb.userSetting.syncStatus);
                    }
                    if (this.userDb.userSetting.syncPercent) {
                      this.syncedItemsPercent.next(this.userDb.userSetting.syncPercent);
                    }
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * Runs the sync for all registered api services in apiServices.
     */
    public runPull(withoutDate = false): Promise<any> {
        return new Promise(resolve => {
            resolve(false);
            this.init().then((data) => {
                if (data) {
                    this.pull(withoutDate).then((res) => {
                        if (!res) {
                            this.loadLocal();
                        }
                        resolve(res);
                    }).catch((err) => {
                        this.loadLocal();
                        resolve(false);
                    });
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * Starts the sync timer with pull and push calls.
     */
    public start() {
        this.runPull().then((data) => {})
            .catch((err) => console.error('ApiSync', 'Error', 'Pull', err));
    }

    public pushOneAtTime(): Promise<any> {
      this.isStartPushBehaviorSubject.next(true);
      return new Promise(resolve => {
        if (this.isBusy) {
          resolve(false);

          return;
        }

        this.isBusy = true;

        // iterate over all services
        let bodiesBatchAllPromises = [];
        for (let key of Object.keys(this.apiServices)) {

          // get registered api service for the current model
          let service: ApiService = this.apiServices[key];
          // let url = AppSetting.API_URL + service.loadUrl + '/batch';


          // make POST request
          const batchPromise = new Promise(resolve => {
            service.prepareBatchPost().then((bodies) => {
              if (bodies && bodies.length > 0) {
                let resolveObject = {};
                resolveObject[key] = bodies;
                resolve(resolveObject);
              } else {
                resolve(false);
              }
            });
          });
          bodiesBatchAllPromises.push(batchPromise);
        }
        let pushedItemsCount = 0;
        let countOfAllChangedItems = 0;
        Promise.all(bodiesBatchAllPromises).then(values => {
          let allServicesBodies = {};

            values.forEach(function(value) {
                if (value) {
                    allServicesBodies = {...allServicesBodies, ...value};
                    for (const models in value) {
                        countOfAllChangedItems += value[models].length;
                    }
                }
            });

          return allServicesBodies;
        }).then(allServicesBodies => {
          if (Object.keys(allServicesBodies).length === 0) {
            this.isStartPushBehaviorSubject.next(false);
            this.pushProgressStatus.next('no_push_data');
            this.isBusy = false;
            resolve(false);
            return;
          }
          this.isStartPushBehaviorSubject.next(false);
          this.pushProgressStatus.next('progress');
          this.isBusy = false;
          Object.keys(allServicesBodies).forEach((modelKey) => {
            let service: ApiService = this.apiServices[modelKey];
            let url = AppSetting.API_URL + service.loadUrl + '/batch';

            let promises = [];

            allServicesBodies[modelKey].forEach((body) => {
              if (!body) {
                return;
              }

              let jsonBody = JSON.stringify(body);

              promises.push(new Promise((resolve) => {
                if (this.pushProgressStatus.getValue() === 'failed') {
                  this.isBusy = false;
                  return;
                }

                return this.http.post(url, jsonBody)
                  .map(res => res.json())
                  .subscribe((data) => {
                    if (this.pushProgressStatus.getValue() === 'failed') {
                      this.isBusy = false;
                      return;
                    }
                    //iterate over all received records
                    let record = data[0];
                    if (record.errors) {
                      this.isStartPushBehaviorSubject.next(false);
                      this.pushProgressStatus.next('failed');
                      this.isBusy = false;
                      return;
                    }

                    //get model by local id and update received primary key from api
                    service.dbModelApi.findById(record._id, true).then((dbModel) => {
                      if (!dbModel) {
                        return;
                      }
                      //type parse DbBaseModel -> DbApiModel
                      let dbModelApi = <DbApiModel>dbModel;
                      //load id from api
                      dbModelApi.idApi = record[dbModelApi.apiPk];
                      dbModelApi.is_synced = true;
                      //update isSynced = true and save with special update-condition
                      dbModelApi.save(false, true, dbModelApi.COL_ID + '=' + record._id).then((res) => {
                        service.pushFiles(dbModelApi).then((result) => {
                          pushedItemsCount++;
                          const savedDataPercent = Math.round((pushedItemsCount / countOfAllChangedItems) * 100);
                          this.pushedItemsCount.next(pushedItemsCount);
                          this.pushedItemsPercent.next(savedDataPercent);
                          this.downloadService.pushProgressFilesInfo.next({});
                        });
                      });
                    });
                  }, (err) => {
                    this.isStartPushBehaviorSubject.next(false);
                    this.pushProgressStatus.next('failed');
                    this.isBusy = false;
                  });
                })
              )
            });
            Promise.all(promises).then((data) => {
              if (!data) {

                this.isStartPushBehaviorSubject.next(false);
                this.pushProgressStatus.next('failed');
                this.isBusy = false;

                resolve(false);
                return;
              }
              this.isStartPushBehaviorSubject.next(false);
              this.pushProgressStatus.next('success');
              this.isBusy = false;

              resolve(true);
            },(err) => {
              this.isStartPushBehaviorSubject.next(false);
              this.pushProgressStatus.next('failed');
              this.isBusy = false;
            });
          });
        });



        this.isBusy = false;
        resolve(true);
      });
    }

    /**
     * Pushes not synced local records to remote api
     * and updates received primary keys in local db.
     *
     * @returns {Promise<T>}
     */
    public push(): Promise<any> {
        this.isStartPushBehaviorSubject.next(true);
        return new Promise(resolve => {
            if (this.isBusy) {
                console.warn('ApiSync', 'push', 'aborted', 'busy');
                this.isStartPushBehaviorSubject.next(false);
                resolve(false);

                return;
            }
            this.isBusy = true;

            //iterate over all services
            for (let key of Object.keys(this.apiServices)) {
                //get registered api service for the current model
                let service: ApiService = this.apiServices[key];
                let url = AppSetting.API_URL + service.loadUrl + '/batch';
                //make POST request
                service.prepareBatchPost().then((bodies) => {
                  if (!bodies || bodies.length <= 0) {
                    return;
                  }
                  let jsonBody = JSON.stringify(bodies);
                  this.http.post(url, jsonBody)
                      .map(res => res.json())
                      .subscribe((data) => {
                          //iterate over all received records
                          Object.keys(data).forEach(function (key) {
                              let record =  data[key];
                              if (record.errors) {
                                  return;
                              }
                              //get model by local id and update received primary key from api
                              service.dbModelApi.findById(record._id, true).then((dbModel) => {
                                  if (!dbModel) {
                                    return;
                                  }
                                  //type parse DbBaseModel -> DbApiModel
                                  let dbModelApi = <DbApiModel>dbModel;
                                  //load id from api
                                  dbModelApi.idApi = record[dbModelApi.apiPk];
                                  dbModelApi.is_synced = true;
                                  //update isSynced = true and save with special update-condition
                                  dbModelApi.save(false, true, dbModelApi.COL_ID + '=' + record._id).then((res) => {
                                      if (res) {
                                          //console.info('ApiSync', 'push', 'record', 'saved', record);
                                          service.dbModelApi.findById(record._id, true).then((m) => {
                                              //console.info('ApiSync', 'push', 'record', 'saved', 'object', m);
                                          });

                                          //console.warn('ApiSync', 'Push', 'Pushing and syncing', dbModelApi);
                                          service.pushFiles(dbModelApi);
                                      } else {
                                          console.warn('ApiSync', 'push', 'record', 'could not save record', record);
                                      }
                                  });
                              });
                          });
                      },(err) => {
                          this.isStartPushBehaviorSubject.next(false);
                          console.error('ApiSync', 'push', 'failed', {'error' : err});
                          this.isBusy = false;
                      });
                });
            }
            this.isStartPushBehaviorSubject.next(false);
            this.isBusy = false;
            resolve(true);
        });
    }

  private pushAll(): Promise<any> {
    this.isStartPushBehaviorSubject.next(true);
    return new Promise(resolve => {
      if (this.isBusy) {
        console.warn('ApiSync', 'push', 'aborted', 'busy');
        resolve(false);

        return;
      }
      this.isBusy = true;

      //iterate over all services
      let bodiesBatchAllPromises = [];
      for (let key of Object.keys(this.apiServices)) {
        //get registered api service for the current model
        let service: ApiService = this.apiServices[key];
        // let url = AppSetting.API_URL + service.loadUrl + '/batch';

        //make POST request
        const batchPromise = new Promise(resolve => {
          service.prepareBatchPost().then((bodies) => {
            if (bodies && bodies.length > 0) {
              let resolveObject = {};
              resolveObject[key] = bodies;
              resolve(resolveObject);
            } else {
              resolve(false);
            }
          });
        });
        bodiesBatchAllPromises.push(batchPromise);
      }
      Promise.all(bodiesBatchAllPromises).then(values => {
        let allServicesBodies = {};
        values.forEach(function(value) {
          if (value) {
            allServicesBodies = {...allServicesBodies, ...value};
          }
        });

        return allServicesBodies;
      }).then(allServicesBodies => {
        if (!Object.keys(allServicesBodies).length) {
          return;
        }
        let url = AppSetting.API_URL + '/sync/batch-all';
        let jsonBody = JSON.stringify(allServicesBodies);
        this.http.post(url, jsonBody)
          .map(res => res.json())
          .subscribe((models) => {
            //iterate over all received records
            Object.keys(models).forEach((modelKey) => {
              Object.keys(models[modelKey]).forEach((key) => {
                let record =  models[modelKey][key];
                if (record.errors) {
                  console.error('ApiSync', 'push', 'Error', {id: key, errors: record.errors});
                  return;
                }
                let modelService: ApiService = this.apiServices[modelKey];
                //get model by local id and update received primary key from api
                modelService.dbModelApi.findById(record._id, true).then((dbModel) => {
                  if (!dbModel) {
                    return;
                  }
                  //type parse DbBaseModel -> DbApiModel
                  let dbModelApi = <DbApiModel>dbModel;
                  //load id from api
                  dbModelApi.idApi = record[dbModelApi.apiPk];
                  dbModelApi.is_synced = true;
                  //update isSynced = true and save with special update-condition
                  dbModelApi.save(false, true, dbModelApi.COL_ID + '=' + record._id).then((res) => {
                    if (res) {
                      //console.info('ApiSync', 'push', 'record', 'saved', record);
                      modelService.dbModelApi.findById(record._id, true).then((m) => {
                        //console.info('ApiSync', 'push', 'record', 'saved', 'object', m);
                      });

                      //console.warn('ApiSync', 'Push', 'Pushing and syncing', dbModelApi);
                      modelService.pushFiles(dbModelApi);
                    } else {
                      console.warn('ApiSync', 'push', 'record', 'could not save record', record);
                    }
                  });
                });
              });
            });

          },(err) => {
            this.isStartPushBehaviorSubject.next(true);
            console.error('ApiSync', 'push', 'failed', {'error' : err});
            this.isBusy = false;
          });
      });

      this.isStartPushBehaviorSubject.next(true);
      this.isBusy = false;
      resolve(true);
    });
  }

    private getUTCDate(date: Date) {
        date.setTime(date.getTime());

        return date;
    }

    private willMakePause() {
        return !this.isStartSyncBehaviorSubject.getValue() &&
            (this.syncProgressStatus.getValue() === 'progress' || this.syncProgressStatus.getValue() === 'resume');
    }

    private willMakeCancel() {
      return !this.isStartSyncBehaviorSubject.getValue() && this.syncProgressStatus.getValue() === 'not_sync';
    }

    /**
     * Pulls records from remote API and stores into local db.
     *
     * @returns {Promise<T>}
     */
    private pull(withoutDate = false): Promise<any> {
        this.isPrepareSynData.next(true);

        return new Promise(resolve => {
            if (this.network.type === 'none') {
                this.unsetSyncProgressData();
                this.isBusy = false;
                resolve(false);
                return;
            }
            if (this.isBusy) {
                resolve(false);
                return;
            }
            if (this.syncMustBeEnd()) {
                resolve(false);
                return;
            }
            this.isBusy = true;
            let differences = 0;
            this.http.initHeaders();
            this.http.get(this.getSyncUrl()).subscribe(async (data) => {
                if (this.syncMustBeEnd()) {
                    resolve(false);
                    return;
                }
                differences = data.difference;
                data = data.models;
                if (!(this.userDb.userSetting.syncAllItemsCount && this.syncProgressStatus.getValue() === 'resume')) {
                    let countOfSyncedData = 0;
                    for (const key of Object.keys(data)) {
                        countOfSyncedData += data[key].length;
                    }
                    this.userDb.userSetting.syncAllItemsCount = countOfSyncedData;
                    this.userDb.save();
                }
                if (this.userDb.userSetting.syncAllItemsCount === 0) {
                    this.unsetSyncProgressData();
                    this.isBusy = false;
                    this.http.showToast('No data to sync.');
                    resolve(false);
                    return;
                }

                this.http.showToast('Sync started.');
                for (const key of Object.keys(data)) {
                    const apiService = this.apiServices[key];
                    if (!apiService) {
                        console.warn('ApiSync', 'Sync for ' + key + ' not supported for now.');
                        continue;
                    }
                    for (const model of data[key]) {
                        if (this.syncMustBeEnd()) {
                            resolve(false);
                            return;
                        }
                        await this.saveModel(apiService, model)
                            .then(() => {
                                if (this.isPrepareSynData.getValue() === true) {
                                    this.isPrepareSynData.next(false);
                                }
                                if (this.userDb.userSetting.syncAllItemsCount === 0) {
                                    this.syncProgressStatus.next('failed');
                                    this.userDb.userSetting.syncStatus = 'failed';
                                    this.userDb.save();
                                    this.isStartSyncBehaviorSubject.next(false);
                                    this.http.showToast('Sync failed.');
                                    this.isBusy = false;
                                    resolve(false);
                                    console.log('is 0000');
                                    return;
                                }
                                // apiService.addToList(obj);
                                this.userDb.userSetting.syncLastElementNumber++;
                                this.userDb.userSetting.syncPercent = Math.round(
                                    (this.userDb.userSetting.syncLastElementNumber / this.userDb.userSetting.syncAllItemsCount) * 100
                                );
                                this.syncedItemsPercent.next(this.userDb.userSetting.syncPercent);

                                if (this.userDb.userSetting.syncPercent === 100) {
                                    this.syncProgressStatus.next('success');
                                    this.isStartSyncBehaviorSubject.next(false);
                                    this.userDb.userSetting.lastSyncedAt = new Date();
                                    this.userDb.userSetting.lastSyncedDiff = differences;
                                    this.userDb.userSetting.syncStatus = 'success';
                                    this.userDb.userSetting.syncLastElementNumber = 0;
                                    this.userDb.userSetting.syncAllItemsCount = 0;
                                }

                                this.userDb.save().then(() => {
                                    if (this.userDb.userSetting.syncPercent === 100) {
                                        this.isBusy = false;
                                        this.http.showToast('Sync successful.');
                                        resolve(true);
                                        return;
                                    }
                                });
                            });
                    }
                }
            }, (err) => {
                this.syncProgressStatus.next('failed');
                this.userDb.userSetting.syncStatus = 'failed';
                this.userDb.save();
                this.isStartSyncBehaviorSubject.next(false);
                this.http.showToast('Sync failed.');
                this.isBusy = false;
                resolve(false);
            });
        });
    }

    private getSyncUrl() {
        let url = AppSetting.API_SYNC_URL;

        if (this.userDb.userSetting.lastSyncedAt) {
            // Need to recast the saved date to get the ISOString, which will give us the correct offset to sync with the ser
            const lastUpdatedAt = this.getUTCDate(new Date(this.userDb.userSetting.lastSyncedAt));
            url = url + '?lastUpdatedAt=' + lastUpdatedAt.toISOString();
        }
        if (this.userDb.userSetting.syncLastElementNumber && this.syncProgressStatus.getValue() === 'resume') {
            if (this.userDb.userSetting.lastSyncedAt) {
                url = url + '&lastUpdatedNumber=' + this.userDb.userSetting.syncLastElementNumber;
            }
        }

        return url;
    }

    async saveModel(apiService, model) {
        const obj = apiService.dbModelApi.loadFromApi(model);
        obj.is_synced = true;
        const oldModel = apiService.findById(obj.idApi);

        await obj.saveSynced();
        return await apiService.pullFiles(obj, oldModel);
    }

    public syncMustBeEnd() {
        if (this.willMakeCancel()) {
            this.isBusy = false;

            return true;
        }
        if (this.syncProgressStatus.getValue() === 'pause') {
            this.isBusy = false;

            return true;
        }
        if (this.willMakePause()) {
            this.syncProgressStatus.next('pause');
            this.userDb.userSetting.syncStatus = 'pause';
            this.userDb.save().then(() => {
                this.isBusy = false;
            });

            return true;
        }
    }

    public startSync(withoutDate = false) {
      this.isStartSyncBehaviorSubject.next(true);
      this.syncProgressStatus.next('progress');

      return new Promise(resolve => {
        this.init().then((data) => {
          if (data) {
            this.userDb.userSetting.syncPercent = 0;
            this.userDb.userSetting.syncLastElementNumber = 0;
            this.userDb.userSetting.syncAllItemsCount = 0;
            this.userDb.userSetting.syncStatus = 'progress';
            this.userDb.save().then(() => {
              this.pull(withoutDate).then((res) => {
                if (!res) {
                  this.loadLocal();
                }
                resolve(res);
              }).catch((err) => {
                this.isStartSyncBehaviorSubject.next(false);
                console.error('ApiSync', err);
                this.loadLocal();
                resolve(false);
              });
            });

          } else {
            this.isStartSyncBehaviorSubject.next(false);
            resolve(false);
          }
        });
      });
    }

    public resumeSync(withoutDate = false) {
      this.isStartSyncBehaviorSubject.next(true);
      this.syncProgressStatus.next('resume');
      this.runPull(withoutDate).then((data) => {
        this.isStartSyncBehaviorSubject.next(false);
      })
        .catch((err) => this.isStartSyncBehaviorSubject.next(false));
    }

    public unsetSyncProgressData() {
      return new Promise(resolve => {
        this.init().then((data) => {
          if (data && this.userDb) {
            this.syncProgressStatus.next('not_sync');
            this.isStartSyncBehaviorSubject.next(false);
            this.syncedItemsPercent.next(0);
            this.userDb.userSetting.syncStatus = 'not_sync';
            this.userDb.userSetting.syncPercent = 0;
            this.userDb.userSetting.syncLastElementNumber = 0;
            this.userDb.userSetting.syncAllItemsCount = 0;
            this.userDb.save();
          }
        });
      });
    }

    /**
     * Load data for each provider from local db if records are not yet loaded.
     * @return {Promise<T>}
     */
    private loadLocal() {
        // console.debug('ApiSync','loadLocal');
        for (let key of Object.keys(this.apiServices)) {
            let service: ApiService = this.apiServices[key];
            if (!service.data.length) {
                service.dbModelApi.findAll().then((res) => {
                    // console.debug('ApiSync', 'loadLocal', 'findAll', 'done');
                    service.data = res;
                });
            }
        }
    }

    resetSyncedData(): Promise<any> {
        const apiSyncServicesPromises = [];
        Object.keys(this.apiServices).forEach((modelKey) => {
            const service: ApiService = this.apiServices[modelKey];
            apiSyncServicesPromises.push(service.dbModelApi.removeAll());
        });

        return Promise.all(apiSyncServicesPromises);
    }
}

