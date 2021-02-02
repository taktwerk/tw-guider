import { Subscription } from 'rxjs/Subscription';
import { CustomLoggerMonitor, Log, LoggerService } from './../../services/logger-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { NGXLogInterface } from 'ngx-logger';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit, OnDestroy {
  constructor(private loggerMonitor: CustomLoggerMonitor, private loggerService: LoggerService) {

    this.logSubscription = this.loggerMonitor.LogsSub.subscribe((logs) => {
      this.logs = logs;
      console.log(this.logs)
    })
  }

  logs: NGXLogInterface[] = [];
  logSubscription: Subscription;

  ngOnInit() {


    setTimeout(() => {
      this.loggerService.getLogger().debug('getLogger Test');
      this.loggerService.getLogger().error('Test');
      this.loggerService.getLogger().info('Test');
      this.loggerService.getLogger().warn('Test');
      this.loggerService.getLogger().debug('Test2');
      this.loggerService.getLogger().error('Test2');
      this.loggerService.getLogger().info('Test2');
      this.loggerService.getLogger().warn('Test2');
    }, 3000)

  }

  ngOnDestroy(): void {
    this.logSubscription.unsubscribe();
  }

  segmentChanged(event: IonSegment) {
    console.log(event)
  }
}
