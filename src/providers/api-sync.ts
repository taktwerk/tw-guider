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
import {FeedbackService} from './api/feedback-service';

@Injectable()
/**
 * This Service provides a sync of all registered API Services under apiService.
 * Make sure to add this Instance to the constructor of your page, that should first call this ApiSync.
 */
export class ApiSync {
    private isBusy: boolean = false;
    public syncData: any;

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
        guide_asset_pivot: this.guideAssetPivotService,
        feedback: this.feedbackService
    };

    userDb: UserDb;

    isStartSyncBehaviorSubject: BehaviorSubject<boolean>;
    syncedItemsCount: BehaviorSubject<number>;
    syncProgressStatus: BehaviorSubject<string>;
    syncedItemsPercent: BehaviorSubject<number>;
    syncAllItemsCount: BehaviorSubject<number>;
    isPrepareSynData: BehaviorSubject<boolean>;
    noDataForSync: BehaviorSubject<boolean>;
    isAvailableForSyncData: BehaviorSubject<boolean>;

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
        private feedbackService: FeedbackService,
        private downloadService: DownloadService,
        private network: Network,
        private appSetting: AppSetting
    ) {
        this.isStartSyncBehaviorSubject = new BehaviorSubject<boolean>(false);
        this.syncedItemsCount = new BehaviorSubject<number>(0);
        this.syncAllItemsCount = new BehaviorSubject<number>(0);
        this.syncedItemsPercent = new BehaviorSubject<number>(0);
        this.syncProgressStatus = new BehaviorSubject<string>('initial');
        this.isPrepareSynData = new BehaviorSubject<boolean>(false);
        this.noDataForSync = new BehaviorSubject<boolean>(false);
        this.isAvailableForSyncData = new BehaviorSubject<boolean>(false);
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

    private getUTCDate(date: Date) {
        date.setTime(date.getTime());

        return date;
    }

    private willMakeCancel(): boolean {
      return this.syncProgressStatus.getValue() === 'not_sync';
    }

    public syncMustBeEnd(): boolean {
        if (this.isOffNetwork()) {
            return true;
        }
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

        return false;
    }

    /**
     * Pulls records from remote API and stores into local db.
     *
     * @returns {Promise<T>}
     */
    private pull(status = 'progress'): Promise<any> {
        return new Promise(resolve => {
            if (this.isOffNetwork() || this.isBusy) {
                resolve(false);
                return;
            }
            this.isBusy = true;
            this.syncProgressStatus.next(status);
            this.isPrepareSynData.next(true);
            if (this.syncMustBeEnd()) {
                resolve(false);
                return;
            }
            this.http.get(this.getSyncUrl()).subscribe(async (data) => {
                if (!data.syncProcessId) {
                    this.failSync('There was no property syncProcessId in the response');
                    resolve(false);
                    return;
                }
                this.userDb.userSetting.lastSyncProcessId = data.syncProcessId;
                await this.userDb.save();
                this.syncData = await this.prepareDataForSavingSyncData(data);
                if (!this.syncData) {
                    resolve(false);
                }
                const isSavedSyncData = this.saveModels(this.syncData);
                if (!isSavedSyncData) {
                    resolve(false);
                }
            }, (err) => {
                this.failSync(err);
                resolve(false);
                return;
            });
        });
    }

    protected async prepareDataForSavingSyncData(dataFromApi) {
        const data = dataFromApi.models;
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

                return false;
            }
            if (countOfSyncedData !== this.userDb.userSetting.syncAllItemsCount) {
                this.userDb.userSetting.syncPercent = Math.round(
                    (this.userDb.userSetting.syncLastElementNumber / countOfSyncedData) * 100
                );
            }
        }
        if (countOfSyncedData === 0) {
            this.isStartSyncBehaviorSubject.next(false);
            this.syncProgressStatus.next('success');
            this.userDb.userSetting.syncStatus = 'success';
            this.userDb.userSetting.lastSyncedAt = new Date();
            this.userDb.save();
            this.isBusy = false;
            this.noDataForSync.next(true);

            return false;
        }
        this.noDataForSync.next(false);
        this.userDb.userSetting.syncAllItemsCount = countOfSyncedData;
        await this.userDb.save();
        this.syncAllItemsCount.next(this.userDb.userSetting.syncAllItemsCount);

        if (this.syncProgressStatus.getValue() === 'progress') {
            this.userDb.userSetting.syncPercent = 0;
            this.userDb.userSetting.syncLastElementNumber = 0;
            this.syncedItemsCount.next(this.userDb.userSetting.syncLastElementNumber);
            this.syncAllItemsCount.next(this.userDb.userSetting.syncAllItemsCount);
            this.syncedItemsPercent.next(this.userDb.userSetting.syncPercent);
        }
        this.isStartSyncBehaviorSubject.next(true);

        return data;
    }

    public checkAvailableChanges() {
        return new Promise(resolve => {
            if (this.isAvailableForSyncData.getValue()) {
                resolve(true);
                return;
            }
            if (this.isOffNetwork()) {
                this.isAvailableForSyncData.next(false);

                resolve(false);
                return;
            }
            this.http.get(this.getSyncUrl(true)).subscribe(async (response) => {
                const isAvailableData = !!response.result;
                this.isAvailableForSyncData.next(isAvailableData);
                this.userDb.userSetting.isSyncAvailableData = isAvailableData;
                this.userDb.save();
                resolve(isAvailableData);
                return;
            }, (err) => {
                this.isAvailableForSyncData.next(false);
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
                    this.failSync('this.userDb.userSetting.syncAllItemsCount is 0');
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
        this.syncedItemsCount.next(this.userDb.userSetting.syncLastElementNumber);
        this.userDb.userSetting.syncPercent = Math.round(
            (this.userDb.userSetting.syncLastElementNumber / this.userDb.userSetting.syncAllItemsCount) * 100
        );
        this.syncedItemsPercent.next(this.userDb.userSetting.syncPercent);

        if (this.isAllItemsSynced()) {
            this.syncProgressStatus.next('success');
            this.isStartSyncBehaviorSubject.next(false);
            this.isAvailableForSyncData.next(false);
            this.userDb.userSetting.lastSyncedAt = new Date();
            this.userDb.userSetting.syncStatus = 'success';
            this.userDb.userSetting.isSyncAvailableData = false;
        }

        return this.userDb.save().then(() => {
            this.sendSyncProgress();
            if (this.isAllItemsSynced()) {
                this.isBusy = false;

                return true;
            }
        });
    }

    public isAllItemsSynced(): boolean {
        return this.syncAllItemsCount.getValue() !== 0 && this.syncedItemsCount.getValue() !== 0 &&
            this.syncAllItemsCount.getValue() === this.syncedItemsCount.getValue();
    }

    private async failSync(error?: string) {
        this.syncProgressStatus.next('failed');
        this.userDb.userSetting.syncStatus = 'failed';
        this.userDb.userSetting.lastSyncProcessId = null;
        await this.userDb.save();
        this.sendSyncProgress(error);
        this.isStartSyncBehaviorSubject.next(false);
        this.isBusy = false;
    }

    public sendSyncProgress(description?: string, isCancel = false) {
        return new Promise(resolve => {
            if (!this.userDb.userSetting.lastSyncProcessId) {
                resolve(false);
                return;
            }

            let url = this.appSetting.apiUrl + '/sync/save-progress';
            url += '?syncProcessId=' + this.userDb.userSetting.lastSyncProcessId;

            let data = null;
            if (isCancel) {
                data = {
                    id: this.userDb.userSetting.lastSyncProcessId,
                    uuid: this.http.deviceInfo.uuid,
                    status: 'cancel'
                };
            } else {
                data = this.getSyncProcessInfo();
                if (description) {
                    data.description = description;
                }
            }

            this.http.post(url, data).subscribe((response) => {
                resolve(true);
                return;
            }, (err) => {
                resolve(false);
                return;
            });
        });
    }

    public getSyncProcessInfo() {
        return {
            id: this.userDb.userSetting.lastSyncProcessId,
            uuid: this.http.deviceInfo.uuid,
            progress: this.userDb.userSetting.syncPercent,
            all_items_count: this.userDb.userSetting.syncAllItemsCount,
            synced_items_count: this.userDb.userSetting.syncLastElementNumber,
            status: this.userDb.userSetting.syncStatus,
            description: null
        };
    }

    private getSyncUrl(isCheckAvailableData = false): string {
        let url = this.appSetting.apiUrl + '/sync';

        if (isCheckAvailableData) {
            url += '/check-available-data';
        }

        if (this.userDb.userSetting.lastSyncedAt) {
            // Need to recast the saved date to get the ISOString, which will give us the correct offset to sync with the ser
            const lastUpdatedAt = this.getUTCDate(new Date(this.userDb.userSetting.lastSyncedAt));
            url += '?lastUpdatedAt=' + lastUpdatedAt.toISOString();
        }
        if (!isCheckAvailableData && this.userDb.userSetting.lastSyncProcessId) {
            url += !this.userDb.userSetting.lastSyncedAt ? '?' : '&';
            url += 'syncProcessId=' + this.userDb.userSetting.lastSyncProcessId;
        }
        // if (this.userDb.userSetting.syncLastElementNumber && this.syncProgressStatus.getValue() === 'resume') {
        //     if (this.userDb.userSetting.lastSyncedAt) {
        //         url = url + '&lastUpdatedNumber=' + this.userDb.userSetting.syncLastElementNumber;
        //     }
        // }

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
            this.makeSyncPause().then(() => {
                this.isBusy = false;
            });

            return true;
        }

        return false;
    }

    public makeSyncPause() {
        return new Promise((resolve) => {
            this.isStartSyncBehaviorSubject.next(false);
            this.syncProgressStatus.next('pause');
            this.userDb.userSetting.syncStatus = 'pause';
            this.isPrepareSynData.next(false);
            this.userDb.save().then(() => {
                this.sendSyncProgress();
                resolve(true);
            });
        });
    }

    public makeSyncProcess(syncStatus = 'progress') {
        return new Promise(resolve => {
            if (this.isOffNetwork() || this.isBusy) {
                resolve(false);
                return;
            }
            this.init().then((data) => {
                if (!data) {
                    this.isStartSyncBehaviorSubject.next(false);
                    resolve(false);
                    return;
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
            this.userDb.userSetting.syncStatus = 'not_sync';
            this.syncedItemsPercent.next(0);
            this.userDb.userSetting.syncPercent = 0;
            this.userDb.userSetting.syncLastElementNumber = 0;
            this.userDb.userSetting.syncAllItemsCount = 0;
            this.userDb.userSetting.lastSyncProcessId = null;
            this.userDb.save().then(() => {
                this.syncedItemsCount.next(this.userDb.userSetting.syncLastElementNumber);
                this.syncAllItemsCount.next(this.userDb.userSetting.syncAllItemsCount);
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
            const condition = [];
            if (service.dbModelApi.hasOwnProperty('user_id')) {
                condition.push(['user_id', this.userDb.userId]);
            }
            apiSyncServicesPromises.push(service.dbModelApi.removeAll(condition));
        });

        return Promise.all(apiSyncServicesPromises);
    }
}

