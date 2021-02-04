import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NGXLoggerMonitor, NGXLogInterface, NGXLogger } from 'ngx-logger';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';
import { resolve } from 'url';

const { Filesystem } = Plugins;

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
}

@Injectable()
export class LoggerService {
    Logs: NGXLogInterface[] = [];
    LogsSub = new BehaviorSubject<NGXLogInterface[]>(null);

    constructor(private logger: NGXLogger, public file: File,
    ) {
        this.logger.registerMonitor(new CustomLoggerMonitor(this))
    }

    getLogger(): NGXLogger {
        return this.logger
    }

    public setLogs(log: NGXLogInterface) {
        this.Logs.push(log);
        this.LogsSub.next([...this.Logs]);
        this.writeToFile(log)
    }

    /**
     * appends log message to file
     * @param log 
     */
    async writeToFile(log) {
        this.logDir('TaktwerkLogs').then(async () => {
            this.file.writeFile(this.file.dataDirectory + '/TaktwerkLogs', 'log.txt', log, { append: true })
                .then(async (res) => {
                    console.log(res)
                    // add ,
                    this.file.writeFile(this.file.dataDirectory + '/TaktwerkLogs', 'log.txt', ',', { append: true })
                    // .catch((e) => {
                    //     console.log('error', e)
                    // });
                })
            // .catch((e) => {
            //     console.log('error', e)
            // });
        })
    }

    logDir(dir) {
        return new Promise((resolve) => {
            this.file
                .checkDir(this.file.dataDirectory, dir)
                .then((e) => {
                    resolve(true);
                })
                .catch((e) => {
                    console.log('File not exit', e)
                    this.file.createDir(this.file.dataDirectory, dir, false).then((e) => {
                        resolve(true);
                    }).catch((e) => {
                        console.log('createDir error', e)
                    })
                });
        });
    }

    async downloadLog() {
        const contents = await Filesystem.readFile({
            path: '/TaktwerkLogs/log.txt',
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        });
        console.log(contents);

        let blob = new Blob([JSON.stringify(contents)], { type: 'application/json' });

    }



    async clearLogFile() {
        try {
            const contents = await Filesystem.writeFile({
                path: '/TaktwerkLogs/log.txt',
                data: "",
                directory: FilesystemDirectory.Data,
                encoding: FilesystemEncoding.UTF8
            });
        } catch (e) {
            console.error('Unable to clear log file', e);
        }

        this.LogsSub.next(null);
    }

    async deleteLogFile() {
        await Filesystem.deleteFile({
            path: '/TaktwerkLogs/log.txt',
            directory: FilesystemDirectory.Data
        });
    }
}
