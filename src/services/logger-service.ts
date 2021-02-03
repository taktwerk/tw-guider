import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NGXLoggerMonitor, NGXLogInterface, NGXLogger } from 'ngx-logger';

export declare enum LoggerLevel {
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

@Injectable()
export class CustomLoggerMonitor implements NGXLoggerMonitor {
    constructor(private loggerService: LoggerService) { }

    onLog(log: NGXLogInterface) { this.loggerService.setLogs(log) }

    writeToFile() {

    }

    deleteLogFile() {

    }

    clearLogFile() {

    }
}

@Injectable()
export class LoggerService {
    Logs: NGXLogInterface[] = [];
    LogsSub = new BehaviorSubject<NGXLogInterface[]>(null);

    constructor(private logger: NGXLogger) {
        this.logger.registerMonitor(new CustomLoggerMonitor(this))
    }

    getLogger(): NGXLogger {
        return this.logger
    }

    public setLogs(log: NGXLogInterface) {
        this.Logs.push(log);
        this.LogsSub.next([...this.Logs])
    }

    // debug(message: string | any) {
    //     this.setLog({ message: message });
    // }

    // info(message: string | any) {
    //     this.setLog({ message: message, level: 'INFO', timeStamp: new Date() });
    // }

    // warn(message: string | any) {
    //     this.setLog({ message: message, level: 'WARN', timeStamp: new Date() });
    // }

    // error(message: string | any) {
    //     this.setLog({ message: message, level: 'ERROR', timeStamp: new Date() });
    // }
}
