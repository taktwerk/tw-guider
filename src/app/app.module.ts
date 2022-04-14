/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule, } from '@ionic/storage-angular';
import { DbProvider } from 'src/providers/db-provider';
import { DownloadService } from 'src/services/download-service';
import { HttpClientModule, HttpClient as Http } from '@angular/common/http';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { VideoEditor } from '@awesome-cordova-plugins/video-editor/ngx';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ApiSync } from 'src/providers/api-sync';
import { HttpClient } from 'src/services/http-client';
import { AuthService } from 'src/services/auth-service';
import { CryptoProvider } from 'src/providers/crypto-provider';
import { AppSetting } from 'src/services/app-setting';
import { AppSettingsDb } from 'src/models/db/app-settings-db';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { UserService } from 'src/services/user-service';
import { ToastService } from 'src/services/toast-service';
import { Network } from '@ionic-native/network/ngx';
import { GuiderService } from 'src/providers/api/guider-service';
import { GuideCategoryService } from 'src/providers/api/guide-category-service';
import { GuideCategoryBindingService } from 'src/providers/api/guide-category-binding-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideAssetPivotService } from 'src/providers/api/guide-asset-pivot-service';
import { FeedbackService } from 'src/providers/api/feedback-service';
import { WorkflowService } from 'src/providers/api/workflow-service';
import { WorkflowStepService } from 'src/providers/api/workflow-step-service';
import { WorkflowTransitionService } from 'src/providers/api/workflow-transition-service';
import { ProtocolDefaultService } from 'src/providers/api/protocol-default-service';
import { ProtocolTemplateService } from 'src/providers/api/protocol-template-service';
import { ProtocolService } from 'src/providers/api/protocol-service';
import { DrawImageService } from 'src/services/draw-image-service';
import { ProtocolCommentService } from 'src/providers/api/protocol-comment-service';
import { GuideChildService } from 'src/providers/api/guide-child-service';
import { GuideViewHistoryService } from 'src/providers/api/guide-view-history-service';
import { SyncIndexService } from 'src/providers/api/sync-index-service';
import { SyncService } from 'src/services/sync-service';
import { MigrationService } from 'src/providers/api/migration-service';
import { MigrationProvider } from 'src/providers/migration-provider';
import { AuthDb } from 'src/models/db/auth-db';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
// import { DatePipe } from '@angular/common';
import { DatePipe } from 'src/pipes/date-pipe/date-pipe';
import { Insomnia } from '@ionic-native/insomnia/ngx';
// import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { VideoService } from 'src/services/video-service';
import { Viewer3dService } from 'src/services/viewer-3d-service';
import { PictureService } from 'src/services/picture-service';
import { PdfViewerComponentModule } from 'src/components/pdf-viewer-component/pdf-viewer-component.module';
// import { DatePipe } from './date-pipe/date-pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CKEditorPageModule } from 'src/components/ckeditor/ckeditor.module';
import { SharedModule } from './shared/shared.module';
import { LoggerService } from 'src/services/logger-service';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonModule } from '@angular/common';
import { ImageEditorPageModule } from 'src/components/imageeditor/imageeditor.module';

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
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
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
    AppVersion,
    Device,
    AppSettingsDb,
    AppSetting,
    CryptoProvider,
    AuthService,
    HttpClient,
    ApiSync,
    VideoEditor,
    Camera,
    MediaCapture,
    FilePath,
    IOSFilePicker,
    FileChooser,
    WebView,
    File,
    DownloadService,
    DbProvider,
    QRScanner,
    BarcodeScanner,
    DatePipe,
    Insomnia,
    PhotoViewer,
    VideoService,
    Viewer3dService,
    PictureService,
    StreamingMedia,
    LoggerService,
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
