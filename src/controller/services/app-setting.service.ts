
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppSetting } from 'src/localServer/models/app-setting';
import { Auth } from 'src/localServer/models/auth';
import { AppSettingKey } from '../state/interface';
import { StateService } from '../state/state.service';


@Injectable()
export class AppSettingService {

    host = null;
    isEnabledUsb = false;
    network = new Subject();

    constructor( private stateService: StateService) {
      this.loadSetting();
    }

    async loadSetting() {
      AppSetting.get(AppSettingKey.mode, this.stateService.default.mode).then(val => this.stateService.mode = val);
      AppSetting.get(AppSettingKey.taktwerk, this.stateService.default.taktwerk).then(val => this.stateService.taktwerk = val);;
      AppSetting.get(AppSettingKey.QrCodeSetup, this.stateService.default.QrCodeSetup).then(val => this.stateService.qrCodeSetup = val);;
      AppSetting.get(AppSettingKey.MigrationVersion, this.stateService.default.MigrationVersion).then(val => this.stateService.migrationVersion = val);;
      AppSetting.get(AppSettingKey.usbHost, this.stateService.default.usbHost).then(val => this.stateService.usbHost = val);;
      AppSetting.get(AppSettingKey.isEnabledUsb, this.stateService.default.isEnabledUsb).then(val => this.stateService.isEnabledUsb = val);;
    }


    changeUsbMode() {
      this.stateService.isEnabledUsb = !this.stateService.isEnabledUsb;
      AppSetting.set(AppSettingKey.usbHost, this.stateService.isEnabledUsb);
    }

    getApiUrl() {
        if (this.isEnabledUsb && environment.usbHost) {
            return environment.usbHost + environment.apiUrlPath;
        }

        return this.host + environment.apiUrlPath;
    }

    initalAfterLogin(user: Auth) {
      AppSetting.set(AppSettingKey.QrCodeSetup, this.stateService.qrCodeSetup);
    }

}

