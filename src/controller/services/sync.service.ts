import { Injectable } from '@angular/core';
import { Constants } from '../state/constant';
import { SyncStatusEnum } from '../state/interface';
import { StoreService } from '../state/store.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  isStartSync = false;

  default = {
    synced: false,
    syncStatus: 'unsynced',
    isAvailableForPushData: false,
    isAvailableForSyncData: false
  }

  constructor() { }

  //Synced
  get synced() {
    return StoreService.get(Constants.SYNCED) ?? this.default.synced;
  }

  set synced(val) {
    StoreService.set(Constants.SYNCED, val);
  }

  get syncStatus(): SyncStatusEnum {
    return StoreService.get(Constants.SYNC_STATUS) ?? this.default.syncStatus;
  }

  set syncStatus(val: SyncStatusEnum) {
    StoreService.set(Constants.SYNC_STATUS, val);
  }

  //isAvailableForPushData
  get isAvailableForPushData() {
    return StoreService.get(Constants.isAvailableForPushData) ?? this.default.isAvailableForPushData;
  }

  set isAvailableForPushData(val) {
    StoreService.set(Constants.isAvailableForPushData, val);
  }

  //isAvailableForSyncData
  get isAvailableForSyncData() {
    return StoreService.get(Constants.isAvailableForSyncData) ?? this.default.isAvailableForSyncData;
  }

  set isAvailableForSyncData(val) {
    StoreService.set(Constants.isAvailableForSyncData, val);
  }

}
