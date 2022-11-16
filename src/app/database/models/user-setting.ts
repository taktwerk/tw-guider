/**
 * This Class contains user settings.
 * All member variable's default values are also the default values by the UserDb-Instance creation which happens
 * when the specific user is first logged in on a device.
 *
 * NOTE: Make sure to store only settings and that are not needed on multiple devices for the same user.
 */

import { TranslateConfigService } from "app/library/services/translate-config.service";

export class UserSetting {
  /** last known access token for a user */
  public accessToken!: string;
  /** last sync date */
  public lastSyncedAt!: Date | null;

  public lastModelUpdatedAt: any;
  /** last sync diff */
  public lastSyncedDiff!: number;

  public syncStatus!: string;

  public syncPercent!: number;

  public syncLastElementNumber!: number;

  public syncAllItemsCount!: number;

  public lastSyncProcessId: number | null = null;

  public isSyncAvailableData = false;

  public pushStatus!: string;

  public pushPercent!: number;

  public pushAllItemsCount!: number;

  public pushLastElementNumber!: number;

  public lastPushedModel!: string;

  public lastPushedModelId!: number;

  public isPushAvailableData = false;

  public syncMode!: number;

  public resumeMode = false;

  public language: string = TranslateConfigService.DEFAULT_LANGUAGE;

  public appSetting!: object;

  public appDataVersion = 0;
}
