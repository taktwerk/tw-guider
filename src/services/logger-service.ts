/* eslint-disable @typescript-eslint/naming-convention */
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { INGXLoggerMonitor, NGXLogger } from 'ngx-logger';
import { File } from '@awesome-cordova-plugins/file/ngx';


import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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

@Injectable({ providedIn: 'root' })
export class CustomLoggerMonitor implements INGXLoggerMonitor {
    constructor(private loggerService: LoggerService) { }

    onLog(log: NGXLogger) { this.loggerService.setLogs(log); }

    // onLog(log: NGXLogInterface) { this.loggerService.setLogs(log) }
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
    public Logs: NGXLogger[] = [];
    public LogsSub = new BehaviorSubject<NGXLogger[]>(null);
    // public Logs: NGXLogInterface[] = [];
    // public LogsSub = new BehaviorSubject<NGXLogInterface[]>(null);

    constructor(private logger: NGXLogger, public file: File) {
        this.logger.registerMonitor(new CustomLoggerMonitor(this));
    }

    public getLogger(): NGXLogger {
        return this.logger;
    }

    // public setLogs(log: NGXLogInterface) {
    public setLogs(log: NGXLogger) {
        this.Logs.push(log);
        this.LogsSub.next(this.Logs);
        this.writeToFile(log);
    }

    /**
     * appends log message to file
     */
    public async writeToFile(log) {
        const contents = await Filesystem.appendFile({
            path: '/TaktwerkLogs/log.txt',
            data: log,
            directory: Directory.External,
            encoding: Encoding.UTF8,
        }).catch(e => {
            console.error('Unable to write log file', e);
        });
    }

    public createLogFile() {
        this.logDir().then(async e => { });
    }

    public logDir() {
        return new Promise(async (resolve) => {
            const dir = await Filesystem.readdir({
                path: '/TaktwerkLogs/log.txt',
                directory: Directory.External,
            }).then(e => {
                resolve(true);
            }).catch(async e => {
                // create dir
                const contents = await Filesystem.writeFile({
                    path: '/TaktwerkLogs/log.txt',
                    data: '',
                    directory: Directory.External,
                    encoding: Encoding.UTF8,
                    recursive: true
                }).then(() => {
                    resolve(true);
                });
            });
        });
    }

    public async clearLogFile() {
        try {
            const contents = await Filesystem.writeFile({
                path: '/TaktwerkLogs/log.txt',
                data: '',
                directory: Directory.External,
                encoding: Encoding.UTF8,
                recursive: true
            });
        } catch (e) {
            console.error('Unable to clear log file', e);
        }
        this.LogsSub.next(null);
    }

    public async deleteLogFile() {
        await Filesystem.deleteFile({
            path: '/TaktwerkLogs/log.txt',
            directory: Directory.External
        });
    }
}
