import { DbBaseModel } from '../base/db-base-model';
import { Platform } from '@ionic/angular';
import { DbProvider } from '../../providers/db-provider';
import { DownloadService } from '../../services/download-service';
import { LoggerService } from '../../services/logger-service';
import { MiscService } from '../../services/misc-service';
import { Injectable } from '@angular/core';

/**
 * Db Model for 'Auth'
 * Holds information about the last auths and its credentials incl
 * the received auth token from the API.
 *
 * @augments DbBaseModel
 */
@Injectable()
export class AuthDb extends DbBaseModel {
  /** @inheritDoc */
  TAG: string = 'AuthDb';

  userId: number;
  client_id: number;
  /** auth token from API */
  authToken: string;
  /** username */
  username: string;
  isAuthority: boolean;

  /** password */
  password: string;
  /** login date */
  loginDate: Date = new Date();
  lastAuthItemChangedAt: number;
  additionalInfo: any;
  groups: any;

  static COL_ID = '_id';
  static COL_USER_ID = 'user_id';
  static COL_CLIENT_ID = 'client_id';
  static COL_IS_AUTHORITY = 'is_authority';
  static COL_AUTH_TOKEN = 'auth_token';
  static COL_USERNAME = 'username';
  static COL_PASSWORD = 'password';
  static COL_LOGIN_DATE = 'login_at';
  static LAST_AUTH_ITEM_CHANGED_AT = 'last_auth_item_changed_at';
  static COL_ADDITIONAL_INFO = 'additional_info';
  static COL_GROUPS = 'groups';

  /** @inheritDoc */
  TABLE_NAME: string = 'auth';

  public migrations = ['AddGroupColumnToUserTableMigration'];
  // add new columns to list to fetch the required data from Authentication API
  // public columnsForMigrations = ['groups'];

  /** @inheritDoc */
  TABLE: any = [
    [AuthDb.COL_USER_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER, 'userId'],
    [AuthDb.COL_CLIENT_ID, 'INT(11)', DbBaseModel.TYPE_NUMBER],
    [AuthDb.COL_IS_AUTHORITY, 'TINYINT(1) DEFAULT 0', DbBaseModel.TYPE_BOOLEAN, 'isAuthority'],
    [AuthDb.COL_USERNAME, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, 'username'],
    [AuthDb.COL_PASSWORD, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, 'password'],
    [AuthDb.COL_AUTH_TOKEN, 'VARCHAR(255)', DbBaseModel.TYPE_STRING, 'authToken'],
    [AuthDb.COL_LOGIN_DATE, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP', DbBaseModel.TYPE_DATE, 'loginDate'],
    [AuthDb.LAST_AUTH_ITEM_CHANGED_AT, 'INT(11)', DbBaseModel.TYPE_NUMBER, 'lastAuthItemChangedAt'],
    [AuthDb.COL_ADDITIONAL_INFO, 'TEXT', DbBaseModel.TYPE_OBJECT, 'additionalInfo'],
    [AuthDb.COL_GROUPS, 'TEXT', DbBaseModel.TYPE_OBJECT, 'groups'],
  ];

  /**
   * @inheritDoc
   */
  constructor() {
    super();
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
      if (this.userId && forceCreation) {
        this.update().then(() => resolve(true));
      } else {
        this.create().then(() => resolve(true));
      }
    });
  }

  public can(permissionName): boolean {
    if (!this.additionalInfo || !this.additionalInfo.permissions) {
      return false;
    }
    if (this.additionalInfo.permissions.hasAllPermissions) {
      return true;
    }
    return this.additionalInfo.permissions.list && this.additionalInfo.permissions.list.includes(permissionName);
  }
}
