import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Device } from '@ionic-native/device';

import { AppVersion } from "@ionic-native/app-version";
import { Toast } from '@ionic-native/toast';
import { IonicStorageModule } from "@ionic/storage";
import { QRScanner } from "@ionic-native/qr-scanner";
import { HttpClientModule } from '@angular/common/http';
//import * as Sentry from 'sentry-cordova';

// Sentry.init({ dsn: 'https://06e0276028a24c4eacf3f1018809916c@sentry.io/1398173' });
//
// export class SentryIonicErrorHandler extends IonicErrorHandler {
//     handleError(error) {
//         super.handleError(error);
//         try {
//             Sentry.captureException(error.originalError || error);
//         } catch (e) {
//             console.error(e);
//         }
//     }
// }

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    AppVersion,
    Toast,
    Device,
    QRScanner
    //{provide: ErrorHandler, useClass: SentryIonicErrorHandler}
  ]
})
export class AppModule {}
