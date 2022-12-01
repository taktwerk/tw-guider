import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from './constant';
import { AppConfigurationModeEnum } from './interface';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  default = {
    mode: AppConfigurationModeEnum.ONLY_CONFIGURE,
    taktwerk: environment.taktwerk,
    QrCodeSetup: false,
    MigrationVersion: '0.0.0',
    usbHost: environment.usbHost,
    isEnabledUsb: false,
    authToken: null,
    isLoggedin: false,
    user_id: null,
    synced: false
  }

  //isLoggedin
  get isLoggedin() {
    return StoreService.get(Constants.IS_LOGGED_IN) ?? this.default.isLoggedin;
  }

  set isLoggedin(val) {
    StoreService.set(Constants.IS_LOGGED_IN, val);
  }

  //user_id
  get user_id() {
    return StoreService.get(Constants.USER_ID) ?? this.default.user_id;
  }

  set user_id(val) {
    StoreService.set(Constants.USER_ID, val);
  }

  //user_id
  get synced() {
    return StoreService.get(Constants.SYNCED) ?? this.default.user_id;
  }

  set synced(val) {
    StoreService.set(Constants.SYNCED, val);
  }



  // mode
  get mode() {
    return StoreService.get(Constants.MODE) ?? this.default.mode;
  }

  set mode(val) {
    StoreService.set(Constants.MODE, val);
  }

  // taktwerk
  get taktwerk() {
    return StoreService.get(Constants.TAKTWERK) ?? this.default.taktwerk;
  }

  set taktwerk(val) {
    StoreService.set(Constants.TAKTWERK, val);
  }

  // qrCodeSetup
  get qrCodeSetup() {
    return StoreService.get(Constants.QrCodeSetup) ?? this.default.QrCodeSetup;
  }

  set qrCodeSetup(val) {
    StoreService.set(Constants.QrCodeSetup, val);
  }

  // migrationVersion
  get migrationVersion() {
    return StoreService.get(Constants.MigrationVersion) ?? this.default.MigrationVersion;
  }

  set migrationVersion(val) {
    StoreService.set(Constants.MigrationVersion, val);
  }

  // usbHost
  get usbHost() {
    return StoreService.get(Constants.UsbHost) ?? this.default.usbHost;
  }

  set usbHost(val) {
    StoreService.set(Constants.UsbHost, val);
  }

  //isEnabledUsb
  get isEnabledUsb() {
    return StoreService.get(Constants.isEnabledUsb) ?? this.default.isEnabledUsb;
  }

  set isEnabledUsb(val) {
    StoreService.set(Constants.isEnabledUsb, val);
  }


  //authToken
  get authToken() {
    return StoreService.get(Constants.TOKEN) ?? this.default.authToken;
  }

  set authToken(val) {
    StoreService.set(Constants.TOKEN, val);
  }

}
