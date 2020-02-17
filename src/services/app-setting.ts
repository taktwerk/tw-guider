import {Injectable} from '@angular/core';
import { environment } from '../environments/environment';
import {UserService} from './user-service';
import {AppSettingsDb} from '../models/db/app-settings-db';
import {Events, Platform} from '@ionic/angular';
import {DbProvider} from '../providers/db-provider';
import {DownloadService} from './download-service';

export enum AppConfigurationModeEnum {
    ONLY_CONFIGURE,
    CONFIGURE_AND_DEVICE_LOGIN,
    CONFIGURE_AND_USER_LOGIN
}

@Injectable()
export class AppSetting {
    static DB_NAME: string = environment.dbName;

    public mode = AppConfigurationModeEnum.ONLY_CONFIGURE;
    public taktwerk = environment.taktwerk;
    public host = environment.host;

    private defaultData = {
        mode : AppConfigurationModeEnum.ONLY_CONFIGURE,
        taktwerk : environment.taktwerk,
        host : environment.host
    };

    appSetting: AppSettingsDb;

    constructor(private userService: UserService,
                public platform: Platform,
                public db: DbProvider,
                public events: Events,
                public downloadService: DownloadService
    ) {
        this.appSetting = new AppSettingsDb(platform, db, events, downloadService);
        this.appSetting.find().then((result) => {
            if (result) {
                Object.keys(result.settings).map((key) => {
                    if (this[key] === undefined) {
                        return;
                    }
                    this[key] = result.settings[key];
                });
            } else {
                this.appSetting.settings = this.defaultData;
                this.appSetting.save();
            }
        });
    }

    validateData(data) {
        if (!data) {
            return false;
        }
        if (!data.host) {
            return false;
        }
        if (!data.taktwerk) {
            return false;
        }
        if (data.taktwerk !== 'guider') {
            return false;
        }
        if (data.mode === undefined || !Object.values(AppConfigurationModeEnum).includes(data.mode)) {
            return false;
        }

        return true;
    }

    public getApiUrl() {
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

        const user = await this.userService.getUser();
        this.appSetting.settings = userSettingsObject;
        this.appSetting.find().then((result) => {
            if (result) {
                result.settings = userSettingsObject;
                result.save();
            } else {
                this.appSetting.create();
            }
        });
        if (user) {
            user.userSetting.appSetting = userSettingsObject;
            user.save();
        }

        return true;
    }
}

