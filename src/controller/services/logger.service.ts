import { INGXLoggerMonitor, NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';


@Injectable({ providedIn: 'root' })
export class CustomLoggerMonitor implements INGXLoggerMonitor {

  constructor(private loggerService: LoggerService) { }

  onLog(log: NGXLogger) { this.loggerService.setLogs(log); }
}

@Injectable({ providedIn: 'root' })
export class LoggerService {

  public Logs: NGXLogger[] = [];
  public LogsSub = new BehaviorSubject<NGXLogger[]>([]);


  constructor(private logger: NGXLogger, private platform: Platform) {
    this.logger.registerMonitor(new CustomLoggerMonitor(this));
  }

  getLogger(): NGXLogger {
    return this.logger;
  }

  setLogs(log: NGXLogger) {
    this.Logs.push(log);
    this.LogsSub.next(this.Logs);
    this.writeToFile(log);
  }

  stringify(circObj: any) {
    const replacerFunc = () => {
      const visited = new WeakSet();
      return (key: any, value: any) => {
        if (typeof value === 'object' && value !== null) {
          if (visited.has(value)) {
            return;
          }
          visited.add(value);
        }
        return value;
      };
    };
    return JSON.stringify(circObj, replacerFunc());
  }


  writeToFile(log: any) {
    if (this.platform.is('capacitor')) {
      if (typeof log != 'string') {
        log = this.stringify(log);
      }
      Filesystem.appendFile({ path: 'TaktwerkLogs/log.txt', data: log, directory: Directory.External, encoding: Encoding.UTF8 }).catch(e => {
        console.error('Unable to write log file', e);
      });
    }
  }

  createLogFile() {
    if (this.platform.is('capacitor')) {
      Filesystem.readdir({ path: 'TaktwerkLogs/log.txt', directory: Directory.External }).catch(async e => {
        Filesystem.writeFile({
          path: '/TaktwerkLogs/log.txt', data: '',
          directory: Directory.External, encoding: Encoding.UTF8, recursive: true
        }).then(() => {
        });
      });
    }
  }

  clearLogFile() {
    try {
      Filesystem.writeFile({
        path: 'TaktwerkLogs/log.txt',
        data: '',
        directory: Directory.External,
        encoding: Encoding.UTF8,
        recursive: true
      });
    } catch (e) {
      console.error('Unable to clear log file', e);
    }
    this.LogsSub.next([]);
  }

  deleteLogFile() {
    Filesystem.deleteFile({
      path: 'TaktwerkLogs/log.txt',
      directory: Directory.External
    });
  }
}
