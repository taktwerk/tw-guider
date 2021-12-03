import { Injectable } from '@angular/core';
import { LoggerService } from '../services/logger-service';
import { Platform } from '@ionic/angular';
import { DbProvider } from '../providers/db-provider';
import { DownloadService } from '../services/download-service';
import { MiscService } from '../services/misc-service';

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
