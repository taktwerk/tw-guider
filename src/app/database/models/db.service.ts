import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DbProvider } from 'app/library/providers/db-provider';
import { DownloadService } from 'app/library/services/download-service';
import { LoggerService } from 'app/library/services/logger-service';
import { MiscService } from 'app/library/services/misc-service';

declare var window;

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    public platform: Platform,
    public db: DbProvider,
    public downloadService: DownloadService,
    public loggerService: LoggerService,
    public miscService: MiscService) {
      window.DbService = this;
    }
}
