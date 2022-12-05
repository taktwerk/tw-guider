import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ConnectionService } from 'src/localServer/services/connection.service';
import { LoggerService } from 'src/controller/services/logger.service';
import { AppSettingService } from 'src/controller/services/app-setting.service';
import { AuthService } from 'src/controller/auth/auth.service';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';

export const languageLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export const initializeApp = (logService: LoggerService) => {
  return () => logService.getLogger();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: languageLoader,
        deps: [HttpClient],
      },
    }),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }),
    HttpClientModule
  ],

  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConnectionService, AppSettingService, AuthService,
    LoggerService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [LoggerService],
      multi: true,
    },
    Insomnia
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
