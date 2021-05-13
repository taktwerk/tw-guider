import { LoggerService } from './logger-service';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { UserService } from './user-service';
import { AppSettingsDb } from '../models/db/app-settings-db';
import { AlertController, Platform } from '@ionic/angular';
import { DbProvider } from '../providers/db-provider';
import { DownloadService } from './download-service';
import { BehaviorSubject } from 'rxjs';
import { TranslateConfigService } from './translate-config.service';
import config from '../environments/config.json';
import { MiscService } from './misc-service';

export enum AppConfigurationModeEnum {
    ONLY_CONFIGURE,
    CONFIGURE_AND_DEVICE_LOGIN,
    CONFIGURE_AND_USER_LOGIN,
    CONFIGURE_AND_DEFAULT_LOGIN_BY_CLIENT
}

@Injectable()
export class AppSetting {
    static DB_NAME: string = environment.dbName;

    public mode = AppConfigurationModeEnum.ONLY_CONFIGURE;
    public taktwerk = environment.taktwerk;
    public host = null;
    public usbHost = environment.usbHost;
    public isEnabledUsb = false;
    public isWasQrCodeSetup = false;
    public isWasQrCodeSetupSubscribtion: BehaviorSubject<boolean>;
    public dbMigrationVersion = '1';

    private defaultData = {
        mode: AppConfigurationModeEnum.ONLY_CONFIGURE,
        taktwerk: environment.taktwerk,
        isWasQrCodeSetup: false,
        dbMigrationVersion: '1',
        usbHost: environment.usbHost,
        isEnabledUsb: false
    };

    appSetting: AppSettingsDb;

    constructor(private userService: UserService,
        public platform: Platform,
        public db: DbProvider,
        public downloadService: DownloadService,
        public alertController: AlertController,
        private translateConfigService: TranslateConfigService,
        private loggerService: LoggerService
        ,private miscService: MiscService
    ) {
        this.isWasQrCodeSetupSubscribtion = new BehaviorSubject<boolean>(false);
        this.appSetting = new AppSettingsDb(platform, db, downloadService, loggerService, miscService);
        this.appSetting.find().then(async (result) => {
            if (result) {
                Object.keys(result.settings).map((key) => {
                    if (this[key] === undefined) {
                        return;
                    }
                    this[key] = result.settings[key];
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

    validateData(data) {
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

    async save(data) {
        let userSettingsObject = {};
        Object.keys(data).map((key) => {
            if (this[key] === undefined) {
                return;
            }
            this[key] = data[key];
            userSettingsObject[key] = data[key];
        });
        if (!userSettingsObject) {
            userSettingsObject = this.defaultData;
        }
        userSettingsObject['isEnabledUsb'] = this.isEnabledUsb;
        userSettingsObject['usbHost'] = environment.usbHost;
        this.usbHost = environment.usbHost;
        let databaseVersion = '0.0.1';
        if (config.databaseVersion) {
            databaseVersion = config.databaseVersion;
        } else if (environment.dbMigrationVersion) {
            databaseVersion = '' + environment.dbMigrationVersion;
        }
        userSettingsObject['dbMigrationVersion'] = databaseVersion;
        this.dbMigrationVersion = '' + databaseVersion;

        const user = await this.userService.getUser();
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
}

