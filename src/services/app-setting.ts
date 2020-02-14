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

    constructor(private userService: UserService) {
    }

    private validateData(data) {
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
        if (!this.validateData(data)) {
            return false;
        }
        const userSettingsObject = {};
        Object.keys(data).map((key) => {
            if (this[key] === undefined) {
                return;
            }
            this[key] = data[key];
            userSettingsObject[key] = data[key];
        });

        const user = await this.userService.getUser();
        user.userSetting.appSetting = userSettingsObject;
        user.save();

        return true;
    }
}

