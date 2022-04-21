/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClient as Http, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ApiSync } from 'src/providers/api-sync';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppSetting } from 'src/services/app-setting';
import { AppSettingsDb } from 'src/models/db/app-settings-db';
import { AuthDb } from 'src/models/db/auth-db';
import { AuthService } from 'src/services/auth-service';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CKEditorPageModule } from 'src/components/ckeditor/ckeditor.module';
import { CommonModule } from '@angular/common';
import { CryptoProvider } from 'src/providers/crypto-provider';
import { DatePipe } from 'src/pipes/date-pipe/date-pipe';
import { DbProvider } from 'src/providers/db-provider';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { DownloadService } from 'src/services/download-service';
import { DrawImageService } from 'src/services/draw-image-service';
import { FeedbackService } from 'src/providers/api/feedback-service';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { GuideAssetPivotService } from 'src/providers/api/guide-asset-pivot-service';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideCategoryBindingService } from 'src/providers/api/guide-category-binding-service';
import { GuideCategoryService } from 'src/providers/api/guide-category-service';
import { GuideChildService } from 'src/providers/api/guide-child-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { GuideViewHistoryService } from 'src/providers/api/guide-view-history-service';
import { GuiderService } from 'src/providers/api/guider-service';
import { HttpClient } from 'src/services/http-client';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { ImageEditorPageModule } from 'src/components/imageeditor/imageeditor.module';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { IonicStorageModule, } from '@ionic/storage-angular';
import { LoggerService } from 'src/services/logger-service';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { MigrationProvider } from 'src/providers/migration-provider';
import { MigrationService } from 'src/providers/api/migration-service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { PdfViewerComponentModule } from 'src/components/pdf-viewer-component/pdf-viewer-component.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { PictureService } from 'src/services/picture-service';
import { ProtocolCommentService } from 'src/providers/api/protocol-comment-service';
import { ProtocolDefaultService } from 'src/providers/api/protocol-default-service';
import { ProtocolService } from 'src/providers/api/protocol-service';
import { ProtocolTemplateService } from 'src/providers/api/protocol-template-service';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
import { SyncIndexService } from 'src/providers/api/sync-index-service';
import { SyncService } from 'src/services/sync-service';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
import { ToastService } from 'src/services/toast-service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserService } from 'src/services/user-service';
import { VideoEditor } from '@awesome-cordova-plugins/video-editor/ngx';
import { VideoService } from 'src/services/video-service';
import { Viewer3dService } from 'src/services/viewer-3d-service';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { WorkflowService } from 'src/providers/api/workflow-service';
import { WorkflowStepService } from 'src/providers/api/workflow-step-service';
import { WorkflowTransitionService } from 'src/providers/api/workflow-transition-service';

export function languageLoader(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function initializeApp(logService: LoggerService) {
  return () => logService.getLogger();
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: languageLoader,
        deps: [Http],
      },
    }),
    SyncSpinnerComponentModule,
    PdfViewerComponentModule,
    PdfViewerModule,
    CKEditorPageModule,
    CKEditorModule,
    SharedModule,
    CommonModule,
    ImageEditorPageModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MigrationService,
    AuthDb,
    MigrationProvider,
    SyncService,
    SyncIndexService,
    GuideViewHistoryService,
    GuideChildService,
    ProtocolCommentService,
    DrawImageService,
    ProtocolService,
    ProtocolTemplateService,
    ProtocolDefaultService,
    WorkflowTransitionService,
    WorkflowStepService,
    WorkflowService,
    FeedbackService,
    GuideAssetPivotService,
    GuideAssetService,
    GuideStepService,
    GuideCategoryBindingService,
    GuideCategoryService,
    GuiderService,
    Network,
    ToastService,
    UserService,
    Device,
    AppSettingsDb,
    AppSetting,
    CryptoProvider,
    AuthService,
    HttpClient,
    ApiSync,
    VideoEditor,
    MediaCapture,
    FilePath,
    IOSFilePicker,
    FileChooser,
    WebView,
    File,
    DownloadService,
    DbProvider,
    QRScanner,
    DatePipe,
    PhotoViewer,
    VideoService,
    Viewer3dService,
    PictureService,
    StreamingMedia,
    LoggerService,
    Insomnia,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [LoggerService],
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
