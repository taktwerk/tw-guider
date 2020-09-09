import {ErrorHandler, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import * as Sentry from 'sentry-cordova';
import { File } from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { PdfViewerService } from './services/pdf-viewer-service'
import { PdfViewerComponent } from './components/pdf-viewer-component/pdf-viewer-component'

Sentry.init({ dsn: 'https://06e0276028a24c4eacf3f1018809916c@sentry.io/1398173' });

export class SentryIonicErrorHandler extends ErrorHandler {
    handleError(error) {
        super.handleError(error);
        try {
            Sentry.captureException(error.originalError || error);
        } catch (e) {
            console.error(e);
        }
    }
}


@NgModule({
  declarations: [
    AppComponent,
    PdfViewerComponent
  ],
  entryComponents: [
    PdfViewerComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    PdfJsViewerModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: SentryIonicErrorHandler },
    HTTP,
    File,
    FileOpener,
    FileTransfer,
    DocumentViewer,
    PdfViewerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
