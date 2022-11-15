import { LoggerService } from './logger-service';
import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { DownloadService } from './download-service';
import { BehaviorSubject } from 'rxjs';
import { TranslateConfigService } from './translate-config.service';
import { config } from '../../../environments/config';
import { MiscService } from './misc-service';
import { AppSettingsDb } from 'app/database/models/db/app-settings-db';
import { environment } from 'environments/environment';

export enum AppConfigurationModeEnum {
    ONLY_CONFIGURE,
    CONFIGURE_AND_DEVICE_LOGIN,
    CONFIGURE_AND_USER_LOGIN,
    CONFIGURE_AND_DEFAULT_LOGIN_BY_CLIENT
}

@Injectable()
export class AppSetting {

    public mode = AppConfigurationModeEnum.ONLY_CONFIGURE;
    public taktwerk = environment.taktwerk;
    public host = null;
    public usbHost = environment.usbHost;
    public isEnabledUsb = false;
    public isWasQrCodeSetup = false;
    public isWasQrCodeSetupSubscribtion: BehaviorSubject<boolean>;
    public dbMigrationVersion = '1';
    public isActivity = false;

    private defaultData = {
        mode: AppConfigurationModeEnum.ONLY_CONFIGURE,
        taktwerk: environment.taktwerk,
        isWasQrCodeSetup: false,
        dbMigrationVersion: '1',
        usbHost: environment.usbHost,
        isEnabledUsb: false
    };

    // appSetting: AppSettingsDb;

    constructor(
        public platform: Platform,
        // public db: DbProvider,
        public appSetting: AppSettingsDb,
        public downloadService: DownloadService,
        public alertController: AlertController,
        private translateConfigService: TranslateConfigService,
    ) {
        this.isWasQrCodeSetupSubscribtion = new BehaviorSubject<boolean>(false);
        // this.appSetting = new AppSettingsDb(platform, db, downloadService, loggerService, miscService);
        this.appSetting.find().then(async (result) => {
            if (result) {
                Object.keys(result.settings).map((key) => {
                    if ((this as any)[key] === undefined) {
                        return;
                    }
                    (this as any)[key] = result.settings[key];
                });
                this.isWasQrCodeSetupSubscribtion.next(result.settings.isWasQrCodeSetup);
            } else {
                this.appSetting.settings = this.defaultData;
                this.isWasQrCodeSetupSubscribtion.next(this.defaultData.isWasQrCodeSetup);
                await this.appSetting.save();
                this.appSetting = await this.appSetting.find();
                // console.log('this.appSetting', this.appSetting);
            }
        });
    }

    validateData(data: any) {
        const errors = [];
        if (!data) {
            errors.push('Empty data');
        }
        if (!data.host) {
            errors.push('Property \'host\' is required');
        }
        if (this.isWasQrCodeSetup && this.host !== data.host) {
            errors.push('Data from another server');
        }
        if (!data.taktwerk) {
            errors.push('Property \'taktwerk\' is required');
        }
        if (data.taktwerk !== 'guider') {
            errors.push('Wrong value of the property \'taktwerk\'');
        }
        if (data.mode === undefined || !Object.values(AppConfigurationModeEnum).includes(data.mode)) {
            errors.push('Undefined mode');
        }

        return errors;
    }

    public getApiUrl() {
        if (this.isEnabledUsb && this.usbHost) {
            return this.usbHost + environment.apiUrlPath;
        }

        return this.host + environment.apiUrlPath;
    }

    async save(data: any, user: any) {
        let userSettingsObject = {};
        Object.keys(data).map((key) => {
            if ((this as any)[key] === undefined) {
                return;
            }
            (this as any)[key] = data[key];
            (userSettingsObject as any)[key] = data[key];
        });
        if (!userSettingsObject) {
            userSettingsObject = this.defaultData;
        }
        (userSettingsObject as any)['isEnabledUsb'] = this.isEnabledUsb;
        (userSettingsObject as any)['usbHost'] = environment.usbHost;
        this.usbHost = environment.usbHost;
        let databaseVersion = '0.0.1';
        if (config.databaseVersion) {
            databaseVersion = config.databaseVersion;
        } else if (environment.dbMigrationVersion) {
            databaseVersion = '' + environment.dbMigrationVersion;
        }
        (userSettingsObject as any)['dbMigrationVersion'] = databaseVersion;
        this.dbMigrationVersion = '' + databaseVersion;

        //  const user = await this.userService.getUser();
        this.appSetting.settings = userSettingsObject;
        this.appSetting.find().then(async (result) => {
            // console.log('app setting result', result);
            if (result) {
                result.settings = userSettingsObject;
                await result.save();
            } else {
                await this.appSetting.create();
            }
        });
        if (user) {
            user.userSetting.appSetting = userSettingsObject;
            user.save();
        }

        return true;
    }

    public isMigratedDatabase() {
        let databaseVersion = '0.0.1';
        if (config.databaseVersion) {
            databaseVersion = '' + config.databaseVersion;
        } else if (environment.dbMigrationVersion) {
            databaseVersion = '' + environment.dbMigrationVersion;
        }
        return this.dbMigrationVersion === databaseVersion;
    }

    async showIsNotMigratedDbPopup() {
        if (!this.isWasQrCodeSetup) {
            return;
        }
        const alert = await this.alertController.create({
            message: this.translateConfigService.translateWord('app.You need to swipe data and reinstall app'),
            buttons: [
                {
                    text: 'Ok',
                    cssClass: 'primary',
                }
            ]
        });

        await alert.present();
    }

    isFile(base64Data: any) {
        if (base64Data == null) return false;
        if (base64Data?.includes('application/pdf')) {
            return true
        }
        return false
    }


    isImage(base64Data: any) {
        if (base64Data == null) return false;

        let mimeType = base64Data?.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/);
        if (mimeType == null) return false;

        mimeType = mimeType[0]?.split('/')[0];
        if (mimeType == 'image') {
            return true
        }
        return false
    }

    isVideo(base64Data: any) {
        if (base64Data == null) return false;

        let mimeType = base64Data.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/);
        if (mimeType == null) return false;

        mimeType = mimeType[0]?.split('/')[0];

        if (mimeType == 'video') {
            return true
        }
        return false
    }

    isValidHttpUrl(string: any) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    };
}

