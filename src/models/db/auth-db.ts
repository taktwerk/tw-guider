import {DbBaseModel} from '../base/db-base-model';
import {Platform, Events} from '@ionic/angular';
import {DbProvider} from '../../providers/db-provider';
import {DownloadService} from '../../services/download-service';

/**
 * Db Model for 'Auth'
 *
 * Holds information about the last auths and its credentials incl
 * the received auth token from the API.
 *
 * @augments DbBaseModel
 */
export class AuthDb extends DbBaseModel {
  /** @inheritDoc */
  TAG: string = 'AuthDb';

  userId: number;
  clientId: number;
  /** auth token from API */
  authToken: string;
  /** username */
  username: string;

  /** password */
  password: string;
  /** login date */
  loginDate: Date = new Date();

  static COL_ID = '_id';
  static COL_USER_ID = 'user_id';
  static COL_AUTH_TOKEN = 'auth_token';
  static COL_USERNAME = 'username';
  static COL_PASSWORD = 'password';
  static COL_LOGIN_DATE = 'login_at';
  static COL_IS_LAST_USER = 'is_last_user';

  /** @inheritDoc */
  TABLE_NAME: string = 'auth';
  /** @inheritDoc */
  TABLE: any = [
    [AuthDb.COL_USER_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER, 'userId' ],
    [AuthDb.COL_USERNAME, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, 'username' ],
    [AuthDb.COL_PASSWORD, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, 'password' ],
    [AuthDb.COL_AUTH_TOKEN, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, 'authToken' ],
    [AuthDb.COL_LOGIN_DATE, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP', DbBaseModel.TYPE_DATE, 'loginDate' ],
  ];

  /**
   * @inheritDoc
   */
  constructor(
      public platform: Platform,
      public db: DbProvider,
      public events: Events,
      public downloadService: DownloadService
  ) {
    super(platform, db, events, downloadService);
  }

  /**
   * Return the last entry from this Db Model.
   * @returns {Promise<AuthDb>}
   */
  public loadLast(): Promise<any> {
    return this.findWhere(['login_at IS NOT NULL'], AuthDb.COL_LOGIN_DATE + ' DESC, ' + AuthDb.COL_ID + ' DESC');
  }

  public save(forceCreation?: boolean): Promise<any> {
    return new Promise((resolve) => {
      console.log('forceCreation', forceCreation);
      if (this.userId && forceCreation) {
        this.update().then(() => resolve(true));
      } else {
        this.create().then(() => resolve(true));
      }
    });
  }
}
