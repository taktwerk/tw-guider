import { LoggerService } from './../../services/logger-service';
import { DbBaseModel } from '../base/db-base-model';
import { Platform } from '@ionic/angular';
import { DbProvider } from '../../providers/db-provider';
import { UserSetting } from '../user-setting';
import { AuthDb } from './auth-db';
import { DownloadService } from '../../services/download-service';
import { MiscService } from '../../services/misc-service';

export class UserDb extends DbBaseModel {
    /** @inheritDoc */
    TAG: string = 'UserDb';

    userId: number;
    /** user settings */
    userSetting: UserSetting;

    static COL_USER_SETTING = 'user_setting';
    static COL_USER_ID = 'user_id';

    /** @inheritDoc */
    TABLE_NAME: string = 'user';
    /** @inheritDoc */
    TABLE: any = [
        [UserDb.COL_USER_SETTING, 'TEXT', DbBaseModel.TYPE_OBJECT, 'userSetting'],
        [UserDb.COL_USER_ID, 'INT UNIQUE', DbBaseModel.TYPE_NUMBER, 'userId'],
    ];

    /**
     * Constructor
     * @param {Platform} platform
     * @param {DbProvider} db
     * @param {Events} events
     * @param {DownloadService} downloadService
     */
    constructor(
    ) {
        super();
    }

    /**
     * Returns the current logged in user.
     * @returns {Promise<DbBaseModel | UserDb | boolean>}
     */
    public getCurrent(): Promise<any | boolean> {
        return new Promise((resolve) => {
            new AuthDb().loadLast().then((authDb) => {
                if (!authDb) {
                    resolve(null);
                } else {
                    this.findWhere(['user_id', authDb.userId]).then((userDb) => {
                        if (userDb) {
                            resolve(userDb);
                        } else {
                            resolve(false);
                        }
                    });
                }
            });
        });
    }
}
