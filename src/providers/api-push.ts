// import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';
// import {HttpClient} from '../services/http-client';
// import {AppSetting} from '../services/app-setting';
// import {UserDb} from '../models/db/user-db';
// import {DbProvider} from './db-provider';
// import {Platform, Events} from '@ionic/angular';
// import {BehaviorSubject} from 'rxjs';
// import {ApiService} from './api/base/api-service';
// import {DbApiModel} from '../models/base/db-api-model';
//
// import {GuiderService} from './api/guider-service';
// import {DownloadService} from '../services/download-service';
// import 'rxjs/add/observable/forkJoin';
// import {GuideCategoryService} from './api/guide-category-service';
// import {GuideCategoryBindingService} from './api/guide-category-binding-service';
// import {GuideStepService} from './api/guide-step-service';
//
// @Injectable()
// /**
//  * This Service provides a sync of all registered API Services under apiService.
//  * Make sure to add this Instance to the constructor of your page, that should first call this ApiSync.
//  */
// export class ApiPush {
//     private isBusy: boolean = false;
//
//     apiServices: any = {
//         guide: this.guideService,
//         guide_category: this.guideCategoryService,
//         guide_category_binding: this.guideCategoryBindingService,
//         guide_step: this.guideStepService
//     };
//     userDb: UserDb;
// ``
//     isStartPushBehaviorSubject: BehaviorSubject<boolean>;
//     pushedItemsCount: BehaviorSubject<number>;
//     pushedItemsPercent: BehaviorSubject<number>;
//     pushProgressStatus: BehaviorSubject<string>;
//
//     /**
//      * ApiSync Constructor
//      */
//     constructor(
//         public http: HttpClient,
//         private platform: Platform,
//         private db: DbProvider,
//         private events: Events,
//         private guideService: GuiderService,
//         private guideCategoryService: GuideCategoryService,
//         private guideCategoryBindingService: GuideCategoryBindingService,
//         private guideStepService: GuideStepService,
//         private downloadService: DownloadService
//     ) {
//         this.pushedItemsCount = new BehaviorSubject<number>(0);
//         this.pushedItemsPercent = new BehaviorSubject<number>(0);
//         this.pushProgressStatus = new BehaviorSubject<string>('initial');
//         this.init();
//         this.initializeEvents();
//     }
//
//     initializeEvents() {
//         this.events.subscribe('UserDb:create', (userDb) => {
//             this.userDb = userDb;
//         });
//         this.events.subscribe('UserDb:update', (userDb) => {
//             this.userDb = userDb;
//         });
//     }
//
//     /**
//      * Loads the current logged in user.
//      */
//     private init(): Promise<any> {
//         if (this.userDb) {
//           return new Promise(resolve => {
//               resolve(true);
//           });
//         }
//
//         return new Promise(resolve => {
//             new UserDb(this.platform, this.db, this.events, this.downloadService).getCurrent().then((userDb) => {
//                 if (userDb) {
//                     this.userDb = userDb;
//                     resolve(true);
//                 } else {
//                     resolve(false);
//                 }
//             });
//         });
//     }
//
//     public pushOneAtTime(): Promise<any> {
//         this.isStartPushBehaviorSubject.next(true);
//         return new Promise(resolve => {
//             if (this.isBusy) {
//                 resolve(false);
//
//                 return;
//             }
//
//             this.isBusy = true;
//
//             // iterate over all services
//             const bodiesBatchAllPromises = [];
//             for (const key of Object.keys(this.apiServices)) {
//
//                 // get registered api service for the current model
//                 const service: ApiService = this.apiServices[key];
//                 // let url = AppSetting.API_URL + service.loadUrl + '/batch';
//
//
//                 // make POST request
//                 const batchPromise = new Promise(resolve => {
//                     service.prepareBatchPost().then((bodies) => {
//                         if (bodies && bodies.length > 0) {
//                             let resolveObject = {};
//                             resolveObject[key] = bodies;
//                             resolve(resolveObject);
//                         } else {
//                             resolve(false);
//                         }
//                     });
//                 });
//                 bodiesBatchAllPromises.push(batchPromise);
//             }
//             let pushedItemsCount = 0;
//             let countOfAllChangedItems = 0;
//             Promise.all(bodiesBatchAllPromises).then(values => {
//                 let allServicesBodies = {};
//
//                 values.forEach(function(value) {
//                     if (value) {
//                         allServicesBodies = {...allServicesBodies, ...value};
//                         for (const models in value) {
//                             countOfAllChangedItems += value[models].length;
//                         }
//                     }
//                 });
//
//                 return allServicesBodies;
//             }).then(allServicesBodies => {
//                 if (Object.keys(allServicesBodies).length === 0) {
//                     this.isStartPushBehaviorSubject.next(false);
//                     this.pushProgressStatus.next('no_push_data');
//                     this.isBusy = false;
//                     resolve(false);
//                     return;
//                 }
//                 this.isStartPushBehaviorSubject.next(false);
//                 this.pushProgressStatus.next('progress');
//                 this.isBusy = false;
//                 Object.keys(allServicesBodies).forEach((modelKey) => {
//                     let service: ApiService = this.apiServices[modelKey];
//                     let url = AppSetting.API_URL + service.loadUrl + '/batch';
//
//                     let promises = [];
//
//                     allServicesBodies[modelKey].forEach((body) => {
//                         if (!body) {
//                             return;
//                         }
//
//                         let jsonBody = JSON.stringify(body);
//
//                         promises.push(new Promise((resolve) => {
//                                 if (this.pushProgressStatus.getValue() === 'failed') {
//                                     this.isBusy = false;
//                                     return;
//                                 }
//
//                                 return this.http.post(url, jsonBody)
//                                     .map(res => res.json())
//                                     .subscribe((data) => {
//                                         if (this.pushProgressStatus.getValue() === 'failed') {
//                                             this.isBusy = false;
//                                             return;
//                                         }
//                                         //iterate over all received records
//                                         let record = data[0];
//                                         if (record.errors) {
//                                             this.isStartPushBehaviorSubject.next(false);
//                                             this.pushProgressStatus.next('failed');
//                                             this.isBusy = false;
//                                             return;
//                                         }
//
//                                         //get model by local id and update received primary key from api
//                                         service.dbModelApi.findById(record._id, true).then((dbModel) => {
//                                             if (!dbModel) {
//                                                 return;
//                                             }
//                                             //type parse DbBaseModel -> DbApiModel
//                                             let dbModelApi = <DbApiModel>dbModel;
//                                             //load id from api
//                                             dbModelApi.idApi = record[dbModelApi.apiPk];
//                                             dbModelApi.is_synced = true;
//                                             //update isSynced = true and save with special update-condition
//                                             dbModelApi.save(false, true, dbModelApi.COL_ID + '=' + record._id).then((res) => {
//                                                 service.pushFiles(dbModelApi).then((result) => {
//                                                     pushedItemsCount++;
//                                                     const savedDataPercent = Math.round((pushedItemsCount / countOfAllChangedItems) * 100);
//                                                     this.pushedItemsCount.next(pushedItemsCount);
//                                                     this.pushedItemsPercent.next(savedDataPercent);
//                                                     this.downloadService.pushProgressFilesInfo.next({});
//                                                 });
//                                             });
//                                         });
//                                     }, (err) => {
//                                         this.isStartPushBehaviorSubject.next(false);
//                                         this.pushProgressStatus.next('failed');
//                                         this.isBusy = false;
//                                     });
//                             })
//                         )
//                     });
//                     Promise.all(promises).then((data) => {
//                         if (!data) {
//
//                             this.isStartPushBehaviorSubject.next(false);
//                             this.pushProgressStatus.next('failed');
//                             this.isBusy = false;
//
//                             resolve(false);
//                             return;
//                         }
//                         this.isStartPushBehaviorSubject.next(false);
//                         this.pushProgressStatus.next('success');
//                         this.isBusy = false;
//
//                         resolve(true);
//                     },(err) => {
//                         this.isStartPushBehaviorSubject.next(false);
//                         this.pushProgressStatus.next('failed');
//                         this.isBusy = false;
//                     });
//                 });
//             });
//
//             this.isBusy = false;
//             resolve(true);
//         });
//     }
//
//     /**
//      * Pushes not synced local records to remote api
//      * and updates received primary keys in local db.
//      *
//      * @returns {Promise<T>}
//      */
//     public push(): Promise<any> {
//         this.isStartPushBehaviorSubject.next(true);
//         return new Promise(resolve => {
//             if (this.isBusy) {
//                 this.isStartPushBehaviorSubject.next(false);
//                 resolve(false);
//
//                 return;
//             }
//             this.isBusy = true;
//
//             //iterate over all services
//             for (let key of Object.keys(this.apiServices)) {
//                 //get registered api service for the current model
//                 let service: ApiService = this.apiServices[key];
//                 let url = AppSetting.API_URL + service.loadUrl + '/batch';
//                 //make POST request
//                 service.prepareBatchPost().then((bodies) => {
//                     if (!bodies || bodies.length <= 0) {
//                         return;
//                     }
//                     let jsonBody = JSON.stringify(bodies);
//                     this.http.post(url, jsonBody)
//                         .map(res => res.json())
//                         .subscribe((data) => {
//                             //iterate over all received records
//                             Object.keys(data).forEach(function (key) {
//                                 let record =  data[key];
//                                 if (record.errors) {
//                                     return;
//                                 }
//                                 //get model by local id and update received primary key from api
//                                 service.dbModelApi.findById(record._id, true).then((dbModel) => {
//                                     if (!dbModel) {
//                                         return;
//                                     }
//                                     //type parse DbBaseModel -> DbApiModel
//                                     let dbModelApi = <DbApiModel>dbModel;
//                                     //load id from api
//                                     dbModelApi.idApi = record[dbModelApi.apiPk];
//                                     dbModelApi.is_synced = true;
//                                     //update isSynced = true and save with special update-condition
//                                     dbModelApi.save(false, true, dbModelApi.COL_ID + '=' + record._id).then((res) => {
//                                         if (res) {
//                                             service.dbModelApi.findById(record._id, true).then((m) => {
//                                             });
//                                             service.pushFiles(dbModelApi);
//                                         } else {
//                                             console.warn('ApiSync', 'push', 'record', 'could not save record', record);
//                                         }
//                                     });
//                                 });
//                             });
//                         },(err) => {
//                             this.isStartPushBehaviorSubject.next(false);
//                             console.error('ApiSync', 'push', 'failed', {'error' : err});
//                             this.isBusy = false;
//                         });
//                 });
//             }
//             this.isStartPushBehaviorSubject.next(false);
//             this.isBusy = false;
//             resolve(true);
//         });
//     }
//
//     private pushAll(): Promise<any> {
//       this.isStartPushBehaviorSubject.next(true);
//       return new Promise(resolve => {
//         if (this.isBusy) {
//           resolve(false);
//
//           return;
//         }
//         this.isBusy = true;
//
//         //iterate over all services
//         let bodiesBatchAllPromises = [];
//         for (let key of Object.keys(this.apiServices)) {
//           //get registered api service for the current model
//           let service: ApiService = this.apiServices[key];
//           // let url = AppSetting.API_URL + service.loadUrl + '/batch';
//
//           //make POST request
//           const batchPromise = new Promise(resolve => {
//             service.prepareBatchPost().then((bodies) => {
//               if (bodies && bodies.length > 0) {
//                 let resolveObject = {};
//                 resolveObject[key] = bodies;
//                 resolve(resolveObject);
//               } else {
//                 resolve(false);
//               }
//             });
//           });
//           bodiesBatchAllPromises.push(batchPromise);
//         }
//         Promise.all(bodiesBatchAllPromises).then(values => {
//           let allServicesBodies = {};
//           values.forEach(function(value) {
//             if (value) {
//               allServicesBodies = {...allServicesBodies, ...value};
//             }
//           });
//
//           return allServicesBodies;
//         }).then(allServicesBodies => {
//           if (!Object.keys(allServicesBodies).length) {
//             return;
//           }
//           let url = AppSetting.API_URL + '/sync/batch-all';
//           let jsonBody = JSON.stringify(allServicesBodies);
//           this.http.post(url, jsonBody)
//             .map(res => res.json())
//             .subscribe((models) => {
//               //iterate over all received records
//               Object.keys(models).forEach((modelKey) => {
//                 Object.keys(models[modelKey]).forEach((key) => {
//                   let record =  models[modelKey][key];
//                   if (record.errors) {
//                     console.error('ApiSync', 'push', 'Error', {id: key, errors: record.errors});
//                     return;
//                   }
//                   let modelService: ApiService = this.apiServices[modelKey];
//                   //get model by local id and update received primary key from api
//                   modelService.dbModelApi.findById(record._id, true).then((dbModel) => {
//                     if (!dbModel) {
//                       return;
//                     }
//                     //type parse DbBaseModel -> DbApiModel
//                     let dbModelApi = <DbApiModel>dbModel;
//                     //load id from api
//                     dbModelApi.idApi = record[dbModelApi.apiPk];
//                     dbModelApi.is_synced = true;
//                     //update isSynced = true and save with special update-condition
//                     dbModelApi.save(false, true, dbModelApi.COL_ID + '=' + record._id).then((res) => {
//                       if (res) {
//                         //console.info('ApiSync', 'push', 'record', 'saved', record);
//                         modelService.dbModelApi.findById(record._id, true).then((m) => {
//                           //console.info('ApiSync', 'push', 'record', 'saved', 'object', m);
//                         });
//
//                         //console.warn('ApiSync', 'Push', 'Pushing and syncing', dbModelApi);
//                         modelService.pushFiles(dbModelApi);
//                       } else {
//                         console.warn('ApiSync', 'push', 'record', 'could not save record', record);
//                       }
//                     });
//                   });
//                 });
//               });
//
//             },(err) => {
//               this.isStartPushBehaviorSubject.next(true);
//               console.error('ApiSync', 'push', 'failed', {'error' : err});
//               this.isBusy = false;
//             });
//         });
//
//         this.isStartPushBehaviorSubject.next(true);
//         this.isBusy = false;
//         resolve(true);
//       });
//     }
// }
//