/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { DbBaseModel } from '../base/db-base-model';
import { UserSetting } from '../user-setting';
import { AuthDb } from './auth-db';

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

    constructor(
    ) {
        super();
    }

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
