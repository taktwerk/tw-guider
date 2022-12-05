export enum AppConfigurationModeEnum {
  ONLY_CONFIGURE,
  CONFIGURE_AND_DEVICE_LOGIN,
  CONFIGURE_AND_USER_LOGIN,
  CONFIGURE_AND_DEFAULT_LOGIN_BY_CLIENT
}

export enum LoggerLevel {
  TRACE,
  DEBUG,
  INFO,
  LOG,
  WARN,
  ERROR,
  FATAL,
  OFF
}

export enum SyncMode {
  Manual,
  NetworkConnect,
  Periodic
}

export interface Log {
  level: LoggerLevel;
  timestamp: string;
  fileName: string;
  lineNumber: string;
  message: string;
  additional: any[];
}

export enum AppSettingKey {
  'mode' = 'mode', 'taktwerk' = 'taktwerk', 'QrCodeSetup' = 'QrCodeSetup',
  'MigrationVersion' = 'MigrationVersion', 'usbHost' = 'usbHost', 'isEnabledUsb' = 'isEnabledUsb',
  'host' = 'host'
}

export enum SyncStatusEnum {
  'unsynced' = 'unsynced',
  'progress' = 'progress',
  'synced'   = 'synced',
  'pause'    = 'pause',
  'failed'   = 'failed',
  'wifi-icon'= 'wifi-icon',
  'success'  = 'success',
  'resume'   = 'resume',
}
