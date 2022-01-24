
import { LoggerService } from './../../services/logger-service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { delay } from 'rxjs/operators';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit, OnDestroy, AfterViewInit {
  constructor(private loggerService: LoggerService, public file: File, public actionSheetController: ActionSheetController) { }

  currentSegment = 'All'

  allLogs: NGXLogger[] = [];
  debugLogs: NGXLogger[] = [];
  infoLogs: NGXLogger[] = [];
  warnLogs: NGXLogger[] = [];
  errorLogs: NGXLogger[] = [];

  // allLogs: NGXLogInterface[] = [];
  // debugLogs: NGXLogInterface[] = [];
  // infoLogs: NGXLogInterface[] = [];
  // warnLogs: NGXLogInterface[] = [];
  // errorLogs: NGXLogInterface[] = [];

  logSubscription: Subscription;

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.logSubscription = this.loggerService.LogsSub.pipe(delay(0)).subscribe((logs) => {
      console.log("check logs here =>", logs);
      if (logs !== null) {
        this.allLogs = logs;
        this.debugLogs = this.allLogs.filter(l => l.level == 1);
        this.infoLogs = this.allLogs.filter(l => l.level == 2);
        this.warnLogs = this.allLogs.filter(l => l.level == 4);
        this.errorLogs = this.allLogs.filter(l => l.level == 5);
      }
      else {
        this.allLogs = [];
        this.debugLogs = this.allLogs.filter(l => l.level == 1);
        this.infoLogs = this.allLogs.filter(l => l.level == 2);
        this.warnLogs = this.allLogs.filter(l => l.level == 4);
        this.errorLogs = this.allLogs.filter(l => l.level == 5);
      }
    })
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

  // trackLog(log: NGXLogInterface) {
  trackLog(log: NGXLogger) {
    return log;
  }

  async onLogMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Log',
      buttons: [
        {
          text: 'Clear Log',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.loggerService.clearLogFile();
          }
        },
      ]
    });
    await actionSheet.present();
  }
}
