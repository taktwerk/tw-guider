import { GuideViewHistoryService } from 'src/providers/api/guide-view-history-service';
import { GuiderModel } from './../models/db/api/guider-model';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '../services/http-client';
import { AppSetting } from '../services/app-setting';
import { DbProvider } from './db-provider';
import { Platform, Events } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from './api/base/api-service';

import { GuiderService } from './api/guider-service';
import { DownloadService } from '../services/download-service';
import 'rxjs/add/observable/forkJoin';
import { GuideCategoryService } from './api/guide-category-service';
import { GuideCategoryBindingService } from './api/guide-category-binding-service';
import { GuideStepService } from './api/guide-step-service';
import { GuideChildService } from './api/guide-child-service';
import { Network } from '@ionic-native/network/ngx';
import { GuideAssetService } from './api/guide-asset-service';
import { GuideAssetPivotService } from './api/guide-asset-pivot-service';
import { FeedbackService } from './api/feedback-service';
import { UserService } from '../services/user-service';
import { ProtocolTemplateService } from './api/protocol-template-service';
import { DbApiModel } from '../models/base/db-api-model';
import { ProtocolService } from './api/protocol-service';
import { ProtocolDefaultService } from './api/protocol-default-service';
import { WorkflowService } from './api/workflow-service';
import { WorkflowStepService } from './api/workflow-step-service';
import { ProtocolCommentService } from './api/protocol-comment-service';
import { WorkflowTransitionService } from './api/workflow-transition-service';

@Injectable()
/**
 * This Service provides a sync of all registered API Services under apiService.
 * Make sure to add this Instance to the constructor of your page, that should first call this ApiSync.
 */
export class ApiSync {
    private isBusy: boolean = false;
    public syncData: any;
    public lastModelUpdatedAt: any;

    // public guideViewHistories: any;
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
        guide_child: this.guideChildService,
        protocol_template: this.protocolTemplateService,
        protocol: this.protocolService,
        protocol_default: this.protocolDefaultService,
        workflow: this.workflowService,
        workflow_step: this.workflowStepService,
        workflow_transition: this.workflowTransitionService,
        protocol_comment: this.protocolCommentService,
        feedback: this.feedbackService,
        guide_view_history: this.guideViewHistoryService
    };

    isStartSyncBehaviorSubject: BehaviorSubject<boolean>;
    syncedItemsCount: BehaviorSubject<number>;
    syncProgressStatus: BehaviorSubject<string>;
    syncedItemsPercent: BehaviorSubject<number>;
    syncAllItemsCount: BehaviorSubject<number>;
    isPrepareSynData: BehaviorSubject<boolean>;
    noDataForSync: BehaviorSubject<boolean>;
    isAvailableForSyncData: BehaviorSubject<boolean>;

    /// push
    private isBusyPush: boolean = false;
    isStartPushBehaviorSubject: BehaviorSubject<boolean>;
    isStartPushDataBehaviorSubject: BehaviorSubject<boolean>;
    pushedItemsCount: BehaviorSubject<number>;
    pushedItemsPercent: BehaviorSubject<number>;
    pushProgressStatus: BehaviorSubject<string>;
    isAvailableForPushData: BehaviorSubject<boolean>;
    pushedItemsCountNumber = 0;
    countOfAllChangedItems = 0;

    apiPushServices: any = {
        protocol: this.protocolService,
        protocol_default: this.protocolDefaultService,
        protocol_comment: this.protocolCommentService,
        feedback: this.feedbackService,
        guide_step: this.guideStepService,
        guide_view_history: this.guideViewHistoryService
    };

    allServicesBodiesForPush: any;

    /**
     * ApiSync Constructor
     */
    constructor(
        public http: HttpClient,
        private platform: Platform,
        private db: DbProvider,
        private events: Events,
        private downloadService: DownloadService,
        private network: Network,
        private appSetting: AppSetting,
        private userService: UserService,
        /// sync services injection
        private guideService: GuiderService,
        private guideCategoryService: GuideCategoryService,
        private guideCategoryBindingService: GuideCategoryBindingService,
        private guideStepService: GuideStepService,
        private guideAssetService: GuideAssetService,
        private guideAssetPivotService: GuideAssetPivotService,
        private feedbackService: FeedbackService,
        private workflowService: WorkflowService,
        private workflowStepService: WorkflowStepService,
        private protocolTemplateService: ProtocolTemplateService,
        private protocolService: ProtocolService,
        private protocolDefaultService: ProtocolDefaultService,
        private protocolCommentService: ProtocolCommentService,
        private workflowTransitionService: WorkflowTransitionService,
        private guideChildService: GuideChildService,
        private guideViewHistoryService: GuideViewHistoryService
    ) {
        this.isStartSyncBehaviorSubject = new BehaviorSubject<boolean>(false);
        this.syncedItemsCount = new BehaviorSubject<number>(0);
        this.syncAllItemsCount = new BehaviorSubject<number>(0);
        this.syncedItemsPercent = new BehaviorSubject<number>(0);
        this.syncProgressStatus = new BehaviorSubject<string>('initial');
        this.isPrepareSynData = new BehaviorSubject<boolean>(false);
        this.noDataForSync = new BehaviorSubject<boolean>(false);
        this.isAvailableForSyncData = new BehaviorSubject<boolean>(false);

        /// push
        this.isStartPushBehaviorSubject = new BehaviorSubject<boolean>(false);
        this.isStartPushDataBehaviorSubject = new BehaviorSubject<boolean>(false);
        this.isAvailableForPushData = new BehaviorSubject<boolean>(false);
        this.pushedItemsCount = new BehaviorSubject<number>(0);
        this.pushedItemsPercent = new BehaviorSubject<number>(0);
        this.pushProgressStatus = new BehaviorSubject<string>('initial');

        this.init();
        this.initializeEvents();
    }

    initializeEvents() {
        this.events.subscribe('UserDb:create', (userDb) => {
            this.userService.userDb = userDb;
        });
        this.events.subscribe('UserDb:update', (userDb) => {
            this.userService.userDb = userDb;
        });
    }

    /**
     * Loads the current logged in user.
     */
    private init(): Promise<any> {
        return new Promise(resolve => {
            this.userService.getUser().then(userDb => {
                if (userDb) {
                    this.userService.userDb = userDb;
                    if (
                        this.userService.userDb.userSetting.syncStatus &&
                        (
                            this.syncProgressStatus.getValue() !== 'progress' &&
                            this.syncProgressStatus.getValue() !== 'resume' &&
                            this.syncProgressStatus.getValue() !== 'not_sync'
                        )
                    ) {
                        this.syncProgressStatus.next(this.userService.userDb.userSetting.syncStatus);
                    }
                    if (this.userService.userDb.userSetting.syncPercent) {
                        this.syncedItemsPercent.next(this.userService.userDb.userSetting.syncPercent);
                    }

                    console.log("syncedItemsPercent ", this.userService.userDb.userSetting.syncPercent)
                    console.log("syncedItemsCount ", this.userService.userDb.userSetting.syncLastElementNumber)
                    console.log("syncAllItemsCount ", this.userService.userDb.userSetting.syncAllItemsCount)

                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    private getUTCDate(date: Date) {
        // date.setTime(date.getTime());
        return new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
        );
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
            this.isBusyPush = false;

            return true;
        }
        if (this.syncProgressStatus.getValue() === 'pause') {
            this.isStartSyncBehaviorSubject.next(false);
            this.isPrepareSynData.next(false);
            this.isBusy = false;
            this.isBusyPush = false;

            return true;
        }

        return false;
    }

    /**
     * Pulls records from remote API and stores into local db.
     *
     * @returns {Promise<T>}
     */
    public pull(status = 'progress'): Promise<any> {
        return new Promise(async (resolve) => {
            try {
                /// TODO separete method and move to the make sync process
                const isSavedSyncData = this.saveModels(this.syncData);
                if (this.lastModelUpdatedAt) {
                    this.userService.userDb.userSetting.lastModelUpdatedAt = this.lastModelUpdatedAt;
                    this.userService.userDb.save();
                }
                console.log("Pull Function >>>>>>>>>>>>>>>>>", isSavedSyncData)
                resolve(isSavedSyncData);
            } catch (err) {
                this.failSync(err);
                resolve(false);
                return;
            }
        });
    }

    protected async prepareDataForSavingPullData(countOfSyncedData) {
        if (this.syncMustBeEnd()) {
            this.isBusy = false;
            return false;
        }
        if (this.syncProgressStatus.getValue() === 'resume') {
            if (!countOfSyncedData || countOfSyncedData < this.userService.userDb.userSetting.syncLastElementNumber) {
                console.log("!countOfSyncedData || countOfSyncedData < this.userService.userDb.userSetting.syncLastElementNumber", !countOfSyncedData || countOfSyncedData < this.userService.userDb.userSetting.syncLastElementNumber)
                this.unsetSyncProgressData().then(() => {
                    this.userService.userDb.userSetting.lastSyncedAt = new Date();
                    if (this.lastModelUpdatedAt) {
                        this.userService.userDb.userSetting.lastModelUpdatedAt = this.lastModelUpdatedAt;
                    }
                    this.userService.userDb.save();
                });
                this.isBusy = false;
                return false;
            }
            if (countOfSyncedData !== this.userService.userDb.userSetting.syncAllItemsCount) {
                this.userService.userDb.userSetting.syncPercent = Math.round(
                    (this.userService.userDb.userSetting.syncLastElementNumber / countOfSyncedData) * 100
                );
            }
        }
        if (countOfSyncedData === 0) {
            this.isStartSyncBehaviorSubject.next(false);
            this.syncProgressStatus.next('success');
            this.userService.userDb.userSetting.syncStatus = 'success';
            this.userService.userDb.userSetting.lastSyncedAt = new Date();
            if (this.lastModelUpdatedAt) {
                this.userService.userDb.userSetting.lastModelUpdatedAt = this.lastModelUpdatedAt;
            }
            this.userService.userDb.save();
            this.isBusy = false;
            this.noDataForSync.next(true);

            // console.log("syncedItemsPercent ", this.userService.userDb.userSetting.syncPercent)
            // console.log("syncedItemsCount ", this.userService.userDb.userSetting.syncLastElementNumber)
            // console.log("syncAllItemsCount ", this.userService.userDb.userSetting.syncAllItemsCount)

            return false;
        }

        this.noDataForSync.next(false);
        this.userService.userDb.userSetting.syncAllItemsCount = countOfSyncedData;
        await this.userService.userDb.save();
        this.syncAllItemsCount.next(this.userService.userDb.userSetting.syncAllItemsCount);

        if (this.syncProgressStatus.getValue() === 'progress') {
            this.userService.userDb.userSetting.syncPercent = 0;
            this.userService.userDb.userSetting.syncLastElementNumber = 0;
            this.syncedItemsCount.next(this.userService.userDb.userSetting.syncLastElementNumber);
            this.syncAllItemsCount.next(this.userService.userDb.userSetting.syncAllItemsCount);
            this.syncedItemsPercent.next(this.userService.userDb.userSetting.syncPercent);
        }

        // console.log("syncedItemsPercent ", this.userService.userDb.userSetting.syncPercent)
        // console.log("syncedItemsCount ", this.userService.userDb.userSetting.syncLastElementNumber)
        // console.log("syncAllItemsCount ", this.userService.userDb.userSetting.syncAllItemsCount)
        this.isStartSyncBehaviorSubject.next(true);
        return true;
    }

    private async saveModels(data) {
        let savedDataCount = 0;
        for (const key of Object.keys(data)) {
            if (this.syncMustBeEnd()) {
                return false;
            }
            const apiService = this.apiServices[key];
            if (!apiService) {
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
                if (this.userService.userDb.userSetting.syncAllItemsCount === 0) {
                    this.failSync('this.userService.userDb.userSetting.syncAllItemsCount is 0');
                    return false;
                }
                savedDataCount++;
                if (this.syncProgressStatus.getValue() === 'resume' &&
                    savedDataCount <= this.userService.userDb.userSetting.syncLastElementNumber) {
                    continue;
                }
                if (this.isPrepareSynData.getValue() === true &&
                    this.syncProgressStatus.getValue() === 'resume' &&
                    savedDataCount > this.userService.userDb.userSetting.syncLastElementNumber
                ) {
                    this.isPrepareSynData.next(false);
                }
                await this.saveSyncProgress().then(() => {
                    return true;
                });
            }
        }

        return true;
    }

    private saveSyncProgress(): Promise<boolean> {
        if (!this.willMakeCancel()) {
            this.userService.userDb.userSetting.syncLastElementNumber++;
            this.syncedItemsCount.next(this.userService.userDb.userSetting.syncLastElementNumber);
            this.userService.userDb.userSetting.syncPercent = Math.round(
                (this.userService.userDb.userSetting.syncLastElementNumber / this.userService.userDb.userSetting.syncAllItemsCount) * 100
            );
            this.syncedItemsPercent.next(this.userService.userDb.userSetting.syncPercent);
        }

        if (this.isAllItemsSynced()) {
            this.syncProgressStatus.next('success');
            this.isStartSyncBehaviorSubject.next(false);
            this.isAvailableForSyncData.next(false);
            this.userService.userDb.userSetting.lastSyncedAt = new Date();
            this.userService.userDb.userSetting.syncStatus = 'success';
            this.userService.userDb.userSetting.isSyncAvailableData = false;
            this.sendSyncProgress();
            //  console.log('is all items synced');
        }
        // console.log("syncedItemsPercent ", this.userService.userDb.userSetting.syncPercent)
        // console.log("syncedItemsCount ", this.userService.userDb.userSetting.syncLastElementNumber)
        // console.log("syncAllItemsCount ", this.userService.userDb.userSetting.syncAllItemsCount)

        return this.userService.userDb.save().then(() => {
            // this.sendSyncProgress();
            if (this.isAllItemsSynced()) {
                this.isBusy = false;
                return true;
            }
        });
    }

    public checkAvailableChanges() {
        return new Promise(async resolve => {
            await this.init();
            if (this.isAvailableForSyncData.getValue()) {
                resolve(true);
                return;
            }
            if (this.network.type === 'none' && !this.appSetting.isEnabledUsb) {
                resolve(false);
                return;
            }
            this.http.get(this.getSyncUrl(true)).subscribe(async (response) => {
                const isAvailableData = !!response.result;
                this.isAvailableForSyncData.next(isAvailableData);
                this.userService.userDb.userSetting.isSyncAvailableData = isAvailableData;
                this.userService.userDb.save();
                resolve(isAvailableData);
                return;
            }, (err) => {
                this.isAvailableForSyncData.next(false);
                resolve(false);
                return;
            });
        });
    }

    public isAllItemsSynced(): boolean {
        return this.syncAllItemsCount.getValue() !== 0 && this.syncedItemsCount.getValue() !== 0 &&
            this.syncAllItemsCount.getValue() === this.syncedItemsCount.getValue();
    }

    private async failSync(error?: string) {
        this.syncProgressStatus.next('failed');
        this.userService.userDb.userSetting.syncStatus = 'failed';
        this.userService.userDb.userSetting.lastSyncProcessId = null;
        await this.userService.userDb.save();
        this.sendSyncProgress(error);
        this.isStartSyncBehaviorSubject.next(false);
        this.isBusy = false;
    }

    public sendSyncProgress(description?: string, isCancel = false) {
        return new Promise(resolve => {
            if (!this.userService.userDb.userSetting.lastSyncProcessId ||
                (this.network.type === 'none' && !this.appSetting.isEnabledUsb)
            ) {
                resolve(false);
                return;
            }
            let url = this.appSetting.getApiUrl() + '/sync/save-progress';
            url += '?syncProcessId=' + this.userService.userDb.userSetting.lastSyncProcessId;

            let data = null;
            if (isCancel) {
                data = {
                    id: this.userService.userDb.userSetting.lastSyncProcessId,
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
            id: this.userService.userDb.userSetting.lastSyncProcessId,
            uuid: this.http.deviceInfo.uuid,
            progress: this.userService.userDb.userSetting.syncPercent,
            all_items_count: this.userService.userDb.userSetting.syncAllItemsCount,
            synced_items_count: this.userService.userDb.userSetting.syncLastElementNumber,
            status: this.userService.userDb.userSetting.syncStatus,
            description: null
        };
    }

    private getSyncUrl(isCheckAvailableData = false): string {
        let url = this.appSetting.getApiUrl() + '/sync';

        if (isCheckAvailableData) {
            url += '/check-available-data';
            if (this.userService.userDb.userSetting.appDataVersion) {
                url += '?appDataVersion=' + this.userService.userDb.userSetting.appDataVersion;
            }
            return url;
        }

        if (this.userService.userDb.userSetting.lastModelUpdatedAt) {
            // Need to recast the saved date to get the ISOString, which will give us the correct offset to sync with the ser
            const lastModelUpdatedAt = new Date(this.userService.userDb.userSetting.lastModelUpdatedAt.replace(/-/g, '/'));
            //   console.log(typeof this.userService.userDb.userSetting.lastModelUpdatedAt);
            // const lastUpdatedAt = this.getUTCDate(new Date(this.userService.userDb.userSetting.lastModelUpdatedAt));
            const lastUpdatedAt = this.getUTCDate(lastModelUpdatedAt);
            //  console.log(this.userService.userDb.userSetting.lastModelUpdatedAt);
            //  console.log('new Date(lastModelUpdatedAt)', new Date(lastModelUpdatedAt));
            // const lastUpdatedAt = new Date(this.userService.userDb.userSetting.lastModelUpdatedAt).getTime();
            //  console.log('lastUpdatedAt', lastUpdatedAt);
            //  console.log('new Date(this.userService.userDb.userSetting.lastModelUpdatedAt)', this.userService.userDb.userSetting.lastModelUpdatedAt);
            //   console.log('lastUpdatedAt.toISOString()', lastUpdatedAt.toISOString());
            url += '?lastUpdatedAt=' + lastUpdatedAt.toISOString();
        }
        if (!isCheckAvailableData && this.userService.userDb.userSetting.lastSyncProcessId) {
            url += !this.userService.userDb.userSetting.lastModelUpdatedAt ? '?' : '&';
            url += 'syncProcessId=' + this.userService.userDb.userSetting.lastSyncProcessId;
        }
        return url;
    }

    async saveModel(apiService, newModel) {
        return apiService.saveSyncedModel(newModel);
    }

    public isOffNetwork(): boolean {
        if (this.network.type === 'none' && !this.appSetting.isEnabledUsb) {
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
            this.userService.userDb.userSetting.syncStatus = 'pause';
            this.isPrepareSynData.next(false);
            this.userService.userDb.save().then(() => {
                this.sendSyncProgress();
                resolve(true);
            });
        });
    }

    public makeSyncProcess(syncStatus = 'progress') {
        return new Promise(async resolve => {
            const data = await this.init();
            console.log("Init Status ", data)
            if (!data) {
                this.isStartSyncBehaviorSubject.next(false);
                resolve(false);
                return;
            }
            if (!this.appSetting.isMigratedDatabase()) {
                resolve(false);
                return;
            }
            if (this.isOffNetwork() || this.isBusy) {
                resolve(false);
                return;
            }

            this.userService.userDb.userSetting.syncStatus = syncStatus;
            await this.userService.userDb.save();
            this.syncProgressStatus.next(this.userService.userDb.userSetting.syncStatus);
            this.isPrepareSynData.next(true);
            let isCanPullData = false;
            let countOfSyncedData = 0;
            await this.preparePushData();
            countOfSyncedData = this.countOfAllChangedItems;
            // check data available for sync
            if (!this.userService.userDb.userSetting.isSyncAvailableData) {
                this.noDataForSync.next(true);
                this.lastModelUpdatedAt
                isCanPullData = await this.prepareDataForSavingPullData(countOfSyncedData);
                console.log('isCanPullData', isCanPullData);
                console.log('this.countOfAllChangedItems', this.countOfAllChangedItems);
                if (!isCanPullData) {
                    // no pull data
                    this.isAvailableForSyncData.next(false);
                }
                // there is data for sync
            } else {
                try {
                    this.isBusy = true;
                    if (this.syncMustBeEnd()) {
                        resolve(false);
                        return;
                    }

                    const pullData = await this.http.get(this.getSyncUrl()).toPromise();
                    // this.guideViewHistories = pullData.models.guide_view_history;
                    console.log('pullData', pullData);

                    if (!pullData.syncProcessId) {
                        this.failSync('There was no property syncProcessId in the response');
                        resolve(false);
                        return;
                    }

                    this.syncData = pullData.models;
                    console.log("Sync Data ", this.syncData);

                    for (const key of Object.keys(this.syncData)) {
                        countOfSyncedData += this.syncData[key].length;
                    }

                    console.log("countOfSyncedData", countOfSyncedData)

                    this.userService.userDb.userSetting.lastSyncProcessId = pullData.syncProcessId;

                    await this.userService.userDb.save();

                    if (!countOfSyncedData) {
                        console.log("count Of Synced Data with !countOfSyncedData", countOfSyncedData)

                        this.isStartSyncBehaviorSubject.next(false);
                        this.syncProgressStatus.next('success');
                        this.userService.userDb.userSetting.syncStatus = 'success';
                        this.userService.userDb.userSetting.lastSyncedAt = new Date();
                        if (this.lastModelUpdatedAt) {
                            this.userService.userDb.userSetting.lastModelUpdatedAt = this.lastModelUpdatedAt;
                        }
                        this.userService.userDb.save();
                        this.isBusy = false;
                        this.isBusyPush = false;
                        this.noDataForSync.next(true);
                        this.isPrepareSynData.next(false);
                        resolve(false);
                        return;
                    }

                    isCanPullData = await this.prepareDataForSavingPullData(countOfSyncedData);
                    console.log("isCanPullData", isCanPullData)
                    if (!isCanPullData) {
                        this.isAvailableForSyncData.next(false);
                    }

                    const isSavedSyncData = await this.pull(syncStatus);

                    console.log('isSavedSyncData', isSavedSyncData);

                    if (isSavedSyncData) {
                        this.userService.userDb.userSetting.lastModelUpdatedAt = pullData.lastModelUpdatedAt;
                        this.userService.userDb.userSetting.appDataVersion = pullData.version;
                        await this.userService.userDb.save();
                    }
                } catch (err) {
                    console.log('sync errrrorrrr', err);
                    this.failSync();
                    this.isStartSyncBehaviorSubject.next(false);
                    resolve(false);
                    return;
                }
            }
            await this.pushOneAtTime();
        });
    }

    /**
     * Returns history for all Guides
     */
    // getGuideViewHistories(): Promise<any> {
    //     return new Promise(async resolve => {
    //         this.http.get(this.getSyncUrl()).subscribe(async (res) => {
    //             this.guideViewHistories = res.models.guide_view_history;
    //             console.log(res)
    //             resolve(this.guideViewHistories);
    //         })
    //     })
    // }

    /**
     * Returns history for single Guide
     */
    // getGuideViewHistory(id): Promise<any> {
    //     return new Promise(async resolve => {
    //         this.getGuideViewHistories().then((res) => {
    //             console.log(res)
    //             const guideHistory = res.filter(h => h.guide_id == id);
    //             resolve(guideHistory);
    //         })
    //     })
    // }

    // public async saveGuideHistory(guide_id, last_seen_step) {
    //     console.log(guide_id)
    //     this.getGuideViewHistory(guide_id).then(async (res) => {
    //         console.log(res)

    //         let history = res[0];
    //         let stepHistory = {};
    //         let Url = "";
    //         console.log("Guide History " + history)

    //         // existing history
    //         if (history != undefined) {
    //             stepHistory = {
    //                 client_id: history.client_id,
    //                 created_at: history.created_at,
    //                 deleted_at: history.deleted_at,
    //                 deleted_by: history.deleted_by,
    //                 guide_id: history.guide_id,
    //                 id: history.id,
    //                 metadata: { step_order_number: last_seen_step },
    //                 updated_at: this.getUTCDate(new Date),
    //                 updated_by: history.updated_by,
    //                 user_id: history.user_id
    //             }
    //             Url = this.appSetting.getApiUrl() + '/guide/view-history/' + history.guide_id;
    //         }
    //         else {
    //             // new history
    //             stepHistory = {
    //                 client_id: (await this.userService.getUser()).id,
    //                 created_at: this.getUTCDate(new Date),
    //                 deleted_at: false,
    //                 deleted_by: null,
    //                 guide_id: guide_id,
    //                 id: null,
    //                 metadata: { step_order_number: last_seen_step },
    //                 updated_at: this.getUTCDate(new Date),
    //                 updated_by: (await this.userService.getUser()).id,
    //                 user_id: (await this.userService.getUser()).id
    //             }
    //             Url = this.appSetting.getApiUrl() + '/guide/view-history/' + guide_id;
    //         }

    //         console.log("Step History " + stepHistory)

    //         console.log("Api Url >> " + Url)

    //         const jsonBody = JSON.stringify(stepHistory);
    //         console.log("jsonBody " + jsonBody)

    //         this.http.post(Url, stepHistory).subscribe((response) => {
    //             console.log(response)
    //             return;
    //         }, (err) => {
    //             console.log(err)
    //             return;
    //         });
    //     })
    // }

    public unsetSyncProgressData(): Promise<true> {
        return new Promise(resolve => {
            this.init().then((data) => {
                if (data && this.userService.userDb) {
                    this.syncProgressStatus.next('not_sync');
                    this.userService.userDb.userSetting.syncStatus = 'not_sync';
                    this.syncedItemsPercent.next(0);
                    this.userService.userDb.userSetting.syncPercent = 0;
                    this.userService.userDb.userSetting.syncLastElementNumber = 0;
                    this.userService.userDb.userSetting.syncAllItemsCount = 0;
                    this.userService.userDb.userSetting.lastSyncProcessId = null;
                    this.userService.userDb.save().then(() => {
                        this.syncedItemsCount.next(this.userService.userDb.userSetting.syncLastElementNumber);
                        this.syncAllItemsCount.next(this.userService.userDb.userSetting.syncAllItemsCount);
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
                condition.push(['user_id', this.userService.userDb.userId]);
            }
            apiSyncServicesPromises.push(service.dbModelApi.removeAll(condition));
        });

        return Promise.all(apiSyncServicesPromises);
    }

    /// push

    public setIsPushAvailableData(isAvailable: boolean) {
        this.userService.userDb.userSetting.isPushAvailableData = isAvailable;
        this.userService.userDb.save().then(() => {
            this.isAvailableForPushData.next(isAvailable);
        });
    }

    /**
     * Pushes not synced local records to remote api
     * and updates received primary keys in local db.
     *
     * @returns {Promise<any>}
     */
    public pushOneAtTime(): Promise<any> {
        return new Promise(async resolve => {
            // console.log('pushOneAtTime');
            if (this.isOffNetwork()) {
                resolve(false);

                return;
            }
            //  console.log('this.isBusyPushthis.isBusyPush', this.isBusyPush);
            if (this.isBusyPush) {
                resolve(false);

                return;
            }

            // console.log('pushOneAtTime after is busy push');
            this.isBusyPush = true;

            // iterate over all services
            if (this.syncProgressStatus.getValue() === 'resume') {
                this.pushedItemsCountNumber = this.userService.userDb.userSetting.pushLastElementNumber;
            } else {
                this.pushedItemsCountNumber = 0;
            }

            console.log(Object.keys(this.allServicesBodiesForPush))
            if (Object.keys(this.allServicesBodiesForPush).length === 0) {
                this.isStartPushBehaviorSubject.next(false);
                this.pushProgressStatus.next('no_push_data');
                this.userService.userDb.userSetting.pushStatus = 'no_push_data';
                await this.userService.userDb.save();
                this.setIsPushAvailableData(false);
                this.isBusyPush = false;
                this.monitorSyncProgress();
                resolve(false);
                return;
            }

            this.isStartPushBehaviorSubject.next(true);
            this.pushProgressStatus.next('progress');
            this.userService.userDb.userSetting.pushStatus = 'progress';
            await this.userService.userDb.save();
            this.isBusyPush = true;
            for (const modelKey of Object.keys(this.allServicesBodiesForPush)) {
                const service: ApiService = this.apiPushServices[modelKey];
                const url = this.appSetting.getApiUrl() + service.loadUrl + '/batch';

                for (const model of this.allServicesBodiesForPush[modelKey]) {
                    if (!model) {
                        continue;
                    }
                    if (this.syncMustBeEnd()) {
                        return false;
                    }
                    const isPushedData = await this.pushDataToServer(url, model, service);
                    if (!isPushedData) {
                        this.isStartPushBehaviorSubject.next(false);
                        this.pushProgressStatus.next('failed');
                        this.userService.userDb.userSetting.pushStatus = 'failed';
                        await this.userService.userDb.save();
                        this.isBusyPush = false;

                        resolve(false);
                        return;
                    }
                }
            }
            this.isStartPushBehaviorSubject.next(false);
            this.pushProgressStatus.next('success');
            this.userService.userDb.userSetting.pushStatus = 'success';
            await this.userService.userDb.save();
            this.isBusyPush = false;
            this.setIsPushAvailableData(false);
            resolve(true);

            this.isBusyPush = false;
            resolve(true);
        });
    }

    private async preparePushData() {
        this.allServicesBodiesForPush = {};
        const bodiesBatchAllPromises = [];
        this.countOfAllChangedItems = 0;
        for (const key of Object.keys(this.apiPushServices)) {
            // get registered api service for the current model
            const service: ApiService = this.apiPushServices[key];
            const bodies = await service.prepareBatchPost();
            if (bodies && bodies.length > 0) {
                const modelBody = {};
                modelBody[key] = bodies;
                this.allServicesBodiesForPush = { ...this.allServicesBodiesForPush, ...modelBody };
                console.log("allServicesBodiesForPush", this.allServicesBodiesForPush);
                this.countOfAllChangedItems += modelBody[key].length;
            }
        }
        if (this.syncProgressStatus.getValue() === 'resume') {
            this.countOfAllChangedItems += this.userService.userDb.userSetting.pushLastElementNumber;
        } else {
            this.userService.userDb.userSetting.pushLastElementNumber = 0;
            this.userService.userDb.userSetting.pushAllItemsCount = 0;
            await this.userService.userDb.save();
        }
        this.userService.userDb.userSetting.pushAllItemsCount = this.countOfAllChangedItems;
        await this.userService.userDb.save();
    }

    private pushDataToServer(url, model, service, isAdditionalData = false) {
        console.log(url, model, service, isAdditionalData)
        return new Promise(async resolve => {
            if (this.pushProgressStatus.getValue() === 'failed') {
                this.isBusyPush = false;
                resolve(false);
                return;
            }

            const isInsert = !!!model.idApi;
            await model.beforePushDataToServer(isInsert);

            const jsonBody = JSON.stringify(model.getBodyJson());

            return this.http
                .post(url, jsonBody)
                .toPromise()
                .then(async (data) => {
                    if (this.pushProgressStatus.getValue() === 'failed') {
                        this.isBusyPush = false;
                        resolve(false);
                        return;
                    }
                    // search error
                    let isError = false;
                    Object.keys(data).forEach((key) => {
                        const recordResponse = data[key];
                        if (recordResponse.errors) {
                            isError = true;
                        }
                    });
                    if (isError) {
                        resolve(false);
                        return;
                    }
                    const record = data[0];
                    // get model by local id and update received primary key from api
                    try {
                        const dbModel = await service.dbModelApi.findById(record._id, true);
                        if (!dbModel) {
                            resolve(false);
                            return;
                        }
                        if (dbModel.deleted_at || dbModel.local_deleted_at) {
                            dbModel.remove().then(async () => {
                                this.userService.userDb.userSetting.appDataVersion++;
                                await this.userService.userDb.save();
                            });
                            this.saveSuccessPushedDataStatistic();
                            resolve(true);
                            return;
                        }
                        const dbModelApi = dbModel as DbApiModel;
                        dbModelApi.idApi = record[dbModelApi.apiPk];
                        dbModelApi.updateCondition = [[dbModelApi.COL_ID, record._id]];
                        await dbModelApi.save(
                            false,
                            true,
                            dbModelApi.COL_ID + '=' + record._id,
                            false
                        );
                        this.userService.userDb.userSetting.appDataVersion++;
                        await this.userService.userDb.save();
                        await service.pushFiles(dbModel, this.userService.userDb);
                        const additionalModelsForPushDataToServer = await dbModelApi.afterPushDataToServer(isInsert);
                        for (let i = 0; i < additionalModelsForPushDataToServer.length; i++) {
                            const additionalModel = additionalModelsForPushDataToServer[i];
                            const urlForAddtinoalPush = this.appSetting.getApiUrl() + additionalModel.loadUrl + '/batch';
                            const serviceForAdditionalModel = this.apiPushServices[additionalModel.TABLE_NAME];
                            if (serviceForAdditionalModel) {
                                const isPushedData = await this.pushDataToServer(
                                    urlForAddtinoalPush,
                                    additionalModelsForPushDataToServer[i],
                                    serviceForAdditionalModel,
                                    true
                                );
                                if (!isPushedData) {
                                    resolve(false);
                                    return;
                                }
                            }
                        }

                        if (!isAdditionalData) {
                            this.saveSuccessPushedDataStatistic();
                        }
                        resolve(true);
                    } catch (e) {
                        resolve(false);
                    }
                });
        });
    }

    private async saveSuccessPushedDataStatistic() {
        this.pushedItemsCountNumber++;
        const savedDataPercent = Math.round((this.pushedItemsCountNumber / this.countOfAllChangedItems) * 100);
        this.pushedItemsCount.next(this.pushedItemsCountNumber);
        this.pushedItemsPercent.next(savedDataPercent);
        this.userService.userDb.userSetting.pushLastElementNumber = this.pushedItemsCountNumber;
        this.userService.userDb.userSetting.pushPercent = savedDataPercent;
        await this.userService.userDb.save();
        await this.saveSyncProgress();
    }

    private monitorSyncProgress() {
        // sync stops at 96%
        // stop and resume
        // this.syncProgressStatus.next('pause');
        // this.makeSyncProcess();
        this.pushProgressStatus.subscribe((status) => {
            console.log("pushProgressStatus", status);
            console.log(this.userService.userDb.userSetting.syncLastElementNumber, this.userService.userDb.userSetting.syncAllItemsCount);
            console.log(this.userService.userDb.userSetting.syncLastElementNumber != this.userService.userDb.userSetting.syncAllItemsCount)
            if (this.userService.userDb.userSetting.syncLastElementNumber != this.userService.userDb.userSetting.syncAllItemsCount) {
                // pause
                console.log("need to stop or resume and resync data");
                this.makeSyncPause().then(() => {
                    this.isBusy = false;
                    // resume
                    this.makeSyncProcess("resume").then(() => {
                        // resync
                        this.makeSyncProcess();
                    })
                });
            }
            this.syncProgressStatus.next('success');
            this.userService.userDb.userSetting.syncStatus = 'success';
            this.userService.userDb.userSetting.lastSyncedAt = new Date();

            if (this.lastModelUpdatedAt) {
                this.userService.userDb.userSetting.lastModelUpdatedAt = this.lastModelUpdatedAt;
            }
            this.userService.userDb.save();
            this.isBusy = false;
            this.noDataForSync.next(true);
        })
    }
}

