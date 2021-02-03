import { Subscription } from 'rxjs/Subscription';
import { CustomLoggerMonitor, Log, LoggerService } from './../../services/logger-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { NGXLogInterface } from 'ngx-logger';
import { debug, info, warn } from 'console';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit, OnDestroy {
  constructor(private loggerService: LoggerService) { }

  currentSegment = 'All'

  allLogs: NGXLogInterface[] = [];
  debugLogs: NGXLogInterface[] = [];
  infoLogs: NGXLogInterface[] = [];
  warnLogs: NGXLogInterface[] = [];
  errorLogs: NGXLogInterface[] = [];

  logSubscription: Subscription;

  ngOnInit() {
    this.logSubscription = this.loggerService.LogsSub.subscribe((logs) => {
      this.allLogs = logs;
      if (logs) {
        this.debugLogs = logs.filter(l => l.level == 1);
        this.infoLogs = logs.filter(l => l.level == 2);
        this.warnLogs = logs.filter(l => l.level == 4);
        this.errorLogs = logs.filter(l => l.level == 5);
      }
    })

    setTimeout(() => {
      var d = new Error('some debug Test');
      this.loggerService.getLogger().debug('getLogger Test', d.stack);

      var e = new Error('some error');
      this.loggerService.getLogger().error('Test', e.stack);

      var i = new Error('some info Test');
      this.loggerService.getLogger().info('Test', i.stack);

      var w = new Error('some warning Test');
      this.loggerService.getLogger().warn('Test', w.stack);

    }, 3000)

  }

  ngOnDestroy(): void {
    this.logSubscription.unsubscribe();
  }

  segmentChanged(event: IonSegment) {
    this.currentSegment = event.value;
  }

  getDebugLevel(level: number) {
    switch (level) {
      case 0:
        return 'TRACE'
      case 1:
        return 'DEBUG'
      case 2:
        return 'INFO'
      case 3:
        return 'LOG'
      case 4:
        return 'WARN'
      case 5:
        return 'ERROR'
      case 6:
        return 'FATAL'
      case 7:
        return 'OFF'
    }
  }

  trackLog(log: NGXLogInterface) {
    return log;
  }
}
