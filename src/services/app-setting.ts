import {Injectable} from '@angular/core';
import { environment } from '../environments/environment';
import {UserService} from './user-service';

export enum AppConfigurationModeEnum {
    ONLY_CONFIGURE,
    CONFIGURE_AND_DEVICE_LOGIN,
    CONFIGURE_AND_USER_LOGIN
}

@Injectable()
export class AppSetting {
    static DB_NAME: string = environment.dbName;

    public apiUrl = environment.apiUrl;
    public mode = AppConfigurationModeEnum.ONLY_CONFIGURE;
    public taktwerk = environment.taktwerk;
    public host = environment.host;
    private defaultData = {
        apiUrl : environment.apiUrl,
        mode : AppConfigurationModeEnum.ONLY_CONFIGURE,
        taktwerk : environment.taktwerk,
        host : environment.host
    };

    constructor(private userService: UserService) {
    }

    validateData(data) {
        if (!data) {
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

    async save(data) {
        const userSettingsObject = {};
        Object.keys(data).map((key) => {
            if (this[key] === undefined) {
                return;
            }
            this[key] = data[key];
            userSettingsObject[key] = data[key];
        });

        const user = await this.userService.getUser();
        console.log('user for app setting', user);
        console.log('userSettingsObject for app setting', userSettingsObject);
        user.userSetting.appSetting = userSettingsObject;
        user.save();

        return true;
    }
}

