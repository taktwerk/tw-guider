import { MiscService } from './../services/misc-service';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, ɵDomSanitizerImpl } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ApiSync } from '../providers/api-sync';
import { GuiderService } from '../providers/api/guider-service';
import { DbProvider } from '../providers/db-provider';
import { MigrationProvider } from '../providers/migration-provider';
import { AuthService } from '../services/auth-service';
import { HttpClient } from '../services/http-client';
import { DownloadService } from '../services/download-service';
import { File } from '@ionic-native/file/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { FormsModule } from '@angular/forms';
import { HttpClient as Http, HttpClientModule } from '@angular/common/http';
import { GuideCategoryService } from '../providers/api/guide-category-service';
import { GuideCategoryBindingService } from '../providers/api/guide-category-binding-service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { GuideChildService } from '../providers/api/guide-child-service';
import { GuideStepService } from '../providers/api/guide-step-service';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { SyncService } from '../services/sync-service';
import { UserService } from '../services/user-service';
import { DatePipe as BaseDatePipe } from '@angular/common';
import { GuideAssetService } from '../providers/api/guide-asset-service';
import { GuideAssetPivotService } from '../providers/api/guide-asset-pivot-service';
import { GuideAssetTextModalComponent } from '../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import { CryptoProvider } from '../providers/crypto-provider';
import { FeedbackService } from '../providers/api/feedback-service';
import { SyncSpinnerComponentModule } from '../components/sync-spinner-component/sync-spinner-component.module';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { MainPipe } from '../pipes/main-pipe.module';
import { HtmlDescriptionComponentModule } from '../components/html-description/html-description-component.module';
import { SyncModalComponent } from '../components/sync-modal-component/sync-modal-component';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from '../services/translate-config.service';

import { LanguageSelectorComponentModule } from '../components/language-selector-component/language-selector-component.module';
import { Device } from '@ionic-native/device/ngx';
import * as Sentry from 'sentry-cordova';

import { DatePipe } from '../pipes/date-pipe/date-pipe';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AppSetting } from '../services/app-setting';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { IonicImageLoader } from 'ionic-image-loader';
import { Camera } from '@ionic-native/camera/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { VideoService } from '../services/video-service';
import { DrawImageService } from '../services/draw-image-service';
import { VideoModalComponent } from '../components/modals/video-modal-component/video-modal-component';
import { DrawImageModalComponent } from '../components/modals/draw-image-modal-component/draw-image-modal-component';
import { ToastService } from '../services/toast-service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PdftronModalComponent } from '../components/modals/pdftron-modal-component/pdftron-modal-component';
import { PictureService } from '../services/picture-service';
import { ProtocolTemplateService } from '../providers/api/protocol-template-service';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { environment } from '../environments/environment';
import { SentryIonicErrorHandler } from '../providers/sentry-ionic-error-handler';
import { ProtocolService } from '../providers/api/protocol-service';
import { ProtocolDefaultService } from '../providers/api/protocol-default-service';
import { WorkflowService } from '../providers/api/workflow-service';
import { WorkflowStepService } from '../providers/api/workflow-step-service';
import { ProtocolDefaultComponent } from '../components/protocol-form-components/protocol-default-component/protocol-default-component';
import { ProtocolDefaultComponentModule } from '../components/protocol-form-components/protocol-default-component/protocol-default-component.module';
import { WorkflowTransitionService } from '../providers/api/workflow-transition-service';
import { ProtocolCommentService } from '../providers/api/protocol-comment-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Media } from '@ionic-native/media/ngx';
import { AudioService } from '../services/audio-service';
import { GuideListComponentModule } from "../components/guide-list-component/guide-list-component.module";
import { Viewer3dService } from "../services/viewer-3d-service";
import { Viewer3dModalComponent } from "../components/modals/viewer-3d-modal-component/viewer-3d-modal-component";
import { Viewer3dModelComponentModule } from "../components/viewer-3d-model-component/viewer-3d-model-component.module";
import { IonicStorageModule } from '@ionic/storage';

import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { MigrationService } from '../providers/api/migration-service';
import { PdfViewerComponent } from '../components/pdf-viewer-component/pdf-viewer-component';
import { PdfViewerComponentModule } from '../components/pdf-viewer-component/pdf-viewer-component.module';

import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ProgressBarModule } from '../components/progress-bar/progress-bar.module';
import { ListviewComponentModule } from 'src/components/listview/listview.module';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { CKEditorModule } from 'ng2-ckeditor';
import { CKEditorComponent } from 'src/components/ckeditor/ckeditor.page';


export function LanguageLoader(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

Sentry.init({ dsn: environment.sentryDsn });

@NgModule({
  declarations: [
    AppComponent,
    GuideAssetTextModalComponent,
    CKEditorComponent,
    SyncModalComponent,
    VideoModalComponent,
    DrawImageModalComponent,
    Viewer3dModalComponent,
    PdftronModalComponent
  ],
  entryComponents: [
    GuideAssetTextModalComponent,
    CKEditorComponent,
    SyncModalComponent,
    VideoModalComponent,
    DrawImageModalComponent,
    Viewer3dModalComponent,
    PdftronModalComponent,
    PdfViewerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb', 'websql', 'sqlite']
    }),
    AppRoutingModule,
    HttpClientModule,
    ProgressBarModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (LanguageLoader),
        deps: [Http]
      }
    }),
    SyncSpinnerComponentModule,
    GuideListComponentModule,
    ListviewComponentModule,
    PdfViewerComponentModule,
    ProtocolDefaultComponentModule,
    LanguageSelectorComponentModule,
    MainPipe,
    HtmlDescriptionComponentModule,
    VirtualScrollerModule,
    IonicImageLoader.forRoot(),
    Viewer3dModelComponentModule,
    PdfJsViewerModule,
    CKEditorModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GuiderService,
    GuiderService,
    GuideCategoryService,
    GuideCategoryBindingService,
    GuideStepService,
    GuideChildService,
    GuideAssetService,
    GuideAssetPivotService,
    FeedbackService,
    ProtocolTemplateService,
    ProtocolService,
    ProtocolDefaultService,
    ProtocolCommentService,
    WorkflowService,
    WorkflowStepService,
    WorkflowTransitionService,
    DbProvider,
    MigrationProvider,
    AuthService,
    MiscService,
    HttpClient,
    DownloadService,
    VideoService,
    DrawImageService,
    AudioService,
    Viewer3dService,
    PictureService,
    ToastService,
    ApiSync,
    File,
    Toast,
    WebView,
    Network,
    StreamingMedia,
    PhotoViewer,
    VideoPlayer,
    SyncService,
    UserService,
    BaseDatePipe,
    DateAgoPipe,
    CryptoProvider,
    FilePath,
    FileChooser,
    IOSFilePicker,
    TranslateConfigService,
    Device,
    DatePipe,
    QRScanner,
    BarcodeScanner,
    AppSetting,
    AppVersion,
    Camera,
    MediaCapture,
    VideoEditor,
    ɵDomSanitizerImpl,
    AppVersion,
    FileOpener,
    Insomnia,
    NativeAudio,
    Media,
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: SentryIonicErrorHandler },
    MigrationService,
    Base64ToGallery
  ],
  exports: [
    ProtocolDefaultComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
