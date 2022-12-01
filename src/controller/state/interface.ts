export enum AppConfigurationModeEnum {
  ONLY_CONFIGURE,
  CONFIGURE_AND_DEVICE_LOGIN,
  CONFIGURE_AND_USER_LOGIN,
  CONFIGURE_AND_DEFAULT_LOGIN_BY_CLIENT
}


export enum LoggerLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  LOG = 3,
  WARN = 4,
  ERROR = 5,
  FATAL = 6,
  OFF = 7
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
