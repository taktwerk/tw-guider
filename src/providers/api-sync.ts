import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from '../services/http-client';
import {AppSetting} from '../services/app-setting';
import {UserDb} from '../models/db/user-db';
import {DbProvider} from './db-provider';
import {Platform, Events} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from './api/base/api-service';

import {GuiderService} from './api/guider-service';
import {DownloadService} from '../services/download-service';
import 'rxjs/add/observable/forkJoin';
import {GuideCategoryService} from './api/guide-category-service';
import {GuideCategoryBindingService} from './api/guide-category-binding-service';
import {GuideStepService} from './api/guide-step-service';
import {Network} from '@ionic-native/network/ngx';
import {GuideAssetService} from './api/guide-asset-service';
import {GuideAssetPivotService} from './api/guide-asset-pivot-service';

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
        guide_step: this.guideStepService,
        guide_asset: this.guideAssetService,
        guide_asset_pivot: this.guideAssetPivotService
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
        private guideAssetService: GuideAssetService,
        private guideAssetPivotService: GuideAssetPivotService,
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
    public runPull(): Promise<any> {
        return new Promise(resolve => {
            resolve(false);
            this.init().then((data) => {
                if (data) {
                    this.pull().then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        resolve(false);
                    });
                } else {
                    resolve(false);
                }
            });
        });
    }

    private getUTCDate(date: Date) {
        date.setTime(date.getTime());

        return date;
    }

    private willMakeCancel(): boolean {
      return this.syncProgressStatus.getValue() === 'not_sync';
    }

    public syncMustBeEnd(): boolean {
        if (this.willMakeCancel()) {
            this.isStartSyncBehaviorSubject.next(false);
            this.isPrepareSynData.next(false);
            this.isBusy = false;

            return true;
        }
        if (this.syncProgressStatus.getValue() === 'pause') {
            this.isStartSyncBehaviorSubject.next(false);
            this.isPrepareSynData.next(false);
            this.isBusy = false;

            return true;
        }
        if (this.isOffNetwork()) {
            return true;
        }

        return false;
    }

    /**
     * Pulls records from remote API and stores into local db.
     *
     * @returns {Promise<T>}
     */
    private pull(status = 'progress'): Promise<any> {
        return new Promise(resolve => {
            console.log('run pull', status);
            if (this.isOffNetwork() || this.isBusy) {
                resolve(false);
                return;
            }
            console.log('after network pull', status);
            this.isPrepareSynData.next(true);
            this.isBusy = true;
            this.http.initHeaders();
            this.http.get(this.getSyncUrl()).subscribe(async (data) => {
                this.syncProgressStatus.next(status);
                console.log('this.syncMustBeEnd() in get', this.syncMustBeEnd(), status);
                if (this.syncMustBeEnd()) {
                    resolve(false);
                    return;
                }
                data = data.models;
                let countOfSyncedData = 0;
                for (const key of Object.keys(data)) {
                    countOfSyncedData += data[key].length;
                }
                if (this.syncProgressStatus.getValue() === 'resume') {
                    if (!countOfSyncedData || countOfSyncedData < this.userDb.userSetting.syncLastElementNumber) {
                        this.unsetSyncProgressData().then(() => {
                            this.userDb.userSetting.lastSyncedAt = new Date();
                            this.userDb.save();
                        });
                        this.isBusy = false;
                        this.http.showToast('Something went wrong.');
                        resolve(false);
                        return;
                    }
                    if (countOfSyncedData !== this.userDb.userSetting.syncAllItemsCount) {
                        this.userDb.userSetting.syncPercent = Math.round(
                            (this.userDb.userSetting.syncLastElementNumber / countOfSyncedData) * 100
                        );
                    }
                }
                this.userDb.userSetting.syncAllItemsCount = countOfSyncedData;
                this.userDb.save();

                if (this.userDb.userSetting.syncAllItemsCount === 0) {
                    this.unsetSyncProgressData().then(() => {
                        this.userDb.userSetting.lastSyncedAt = new Date();
                        this.userDb.save();
                    });
                    this.isBusy = false;
                    this.http.showToast('No data to sync.');
                    resolve(false);
                    return;
                }
                this.isStartSyncBehaviorSubject.next(true);
                this.http.showToast('Sync started.');
                const isSavedSyncData = this.saveModels(data);
                if (!isSavedSyncData) {
                    resolve(false);
                }
            }, (err) => {
                this.failSync();
                resolve(false);
                return;
            });
        });
    }

    private async saveModels(data) {
        let savedDataCount = 0;
        for (const key of Object.keys(data)) {
            if (this.syncMustBeEnd()) {
                return false;
            }
            const apiService = this.apiServices[key];
            if (!apiService) {
                console.warn('ApiSync', 'Sync for ' + key + ' not supported for now.');
                continue;
            }
            for (const model of data[key]) {
                if (this.isPrepareSynData.getValue() === true && this.syncProgressStatus.getValue() !== 'resume') {
                    this.isPrepareSynData.next(false);
                }
                if (this.syncMustBeEnd()) {
                    return false;
                }
                await this.saveModel(apiService, model);
                if (this.syncMustBeEnd()) {
                    return false;
                }
                if (this.userDb.userSetting.syncAllItemsCount === 0) {
                    this.failSync();
                    return false;
                }
                savedDataCount++;
                if (this.syncProgressStatus.getValue() === 'resume' && savedDataCount <= this.userDb.userSetting.syncLastElementNumber) {
                    continue;
                }
                if (this.isPrepareSynData.getValue() === true &&
                    this.syncProgressStatus.getValue() === 'resume' &&
                    savedDataCount > this.userDb.userSetting.syncLastElementNumber
                ) {
                    this.isPrepareSynData.next(false);
                }
                await this.saveSyncProgress().then(() => {
                    return true;
                });
            }
        }
    }

    private saveSyncProgress(): Promise<boolean> {
        this.userDb.userSetting.syncLastElementNumber++;
        this.userDb.userSetting.syncPercent = Math.round(
            (this.userDb.userSetting.syncLastElementNumber / this.userDb.userSetting.syncAllItemsCount) * 100
        );
        this.syncedItemsPercent.next(this.userDb.userSetting.syncPercent);

        if (this.userDb.userSetting.syncPercent === 100) {
            this.syncProgressStatus.next('success');
            this.isStartSyncBehaviorSubject.next(false);
            this.userDb.userSetting.lastSyncedAt = new Date();
            this.userDb.userSetting.syncStatus = 'success';
            this.userDb.userSetting.syncLastElementNumber = 0;
            this.userDb.userSetting.syncAllItemsCount = 0;
        }

        return this.userDb.save().then(() => {
            if (this.userDb.userSetting.syncPercent === 100) {
                this.isBusy = false;
                this.http.showToast('Sync successful.');

                return true;
            }
        });
    }

    private failSync() {
        this.syncProgressStatus.next('failed');
        this.userDb.userSetting.syncStatus = 'failed';
        this.userDb.save();
        this.isStartSyncBehaviorSubject.next(false);
        this.http.showToast('Sync failed.');
        this.isBusy = false;
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
        let oldModel = await apiService.dbModelApi.findFirst(['id', obj.idApi]);
        oldModel = oldModel[0] ? oldModel[0] : null;
        if (!oldModel || oldModel.updated_at !== obj.updated_at) {
            await obj.saveSynced();
        }
        return await obj.pullFiles(oldModel, this.http.getAuthorizationToken());
    }

    public isOffNetwork(): boolean {
        if (this.network.type === 'none') {
            this.http.showToast('No internet connection.');
            this.makeSyncPause().then(() => {
                this.isBusy = false;
            });

            return true;
        }

        return false;
    }

    public makeSyncPause() {
        return new Promise((resolve) => {
            this.syncProgressStatus.next('pause');
            this.userDb.userSetting.syncStatus = 'pause';
            this.isStartSyncBehaviorSubject.next(false);
            this.isPrepareSynData.next(false);
            this.userDb.save().then(() => {
                resolve(true);
            });
        });
    }

    public makeSyncProcess(syncStatus = 'progress') {
        if (this.isOffNetwork() || this.isBusy) {
            return new Promise(resolve => {
                resolve(false);
            });
        }

        return new Promise(resolve => {
            this.init().then((data) => {
                if (!data) {
                    this.isStartSyncBehaviorSubject.next(false);
                    resolve(false);
                    return;
                }
                if (syncStatus === 'progress') {
                    this.userDb.userSetting.syncPercent = 0;
                    this.userDb.userSetting.syncLastElementNumber = 0;
                }
                this.userDb.userSetting.syncStatus = syncStatus;
                this.userDb.save().then(() => {
                    this.pull(syncStatus).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        this.isStartSyncBehaviorSubject.next(false);
                        resolve(false);
                    });
                });
            });
        });
    }

    public unsetSyncProgressData(): Promise<true> {
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
            this.userDb.save().then(() => {
                resolve(true);
                return;
            });
          }
        });
      });
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

