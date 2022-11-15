/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClient as Http, HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { CommonModule, DatePipe } from '@angular/common';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { IonicStorageModule, } from '@ionic/storage-angular';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { VideoEditor } from '@awesome-cordova-plugins/video-editor/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { AppSettingsDb } from './database/models/db/app-settings-db';
import { AuthDb } from './database/models/db/auth-db';
import { ApiSync } from './library/providers/api-sync';
import { FeedbackService } from './library/providers/api/feedback-service';
import { GuideAssetPivotService } from './library/providers/api/guide-asset-pivot-service';
import { GuideAssetService } from './library/providers/api/guide-asset-service';
import { GuideCategoryBindingService } from './library/providers/api/guide-category-binding-service';
import { GuideCategoryService } from './library/providers/api/guide-category-service';
import { GuideChildService } from './library/providers/api/guide-child-service';
import { GuideStepService } from './library/providers/api/guide-step-service';
import { GuideViewHistoryService } from './library/providers/api/guide-view-history-service';
import { GuiderService } from './library/providers/api/guider-service';
import { MigrationService } from './library/providers/api/migration-service';
import { ProtocolCommentService } from './library/providers/api/protocol-comment-service';
import { ProtocolDefaultService } from './library/providers/api/protocol-default-service';
import { ProtocolService } from './library/providers/api/protocol-service';
import { ProtocolTemplateService } from './library/providers/api/protocol-template-service';
import { SyncIndexService } from './library/providers/api/sync-index-service';
import { WorkflowService } from './library/providers/api/workflow-service';
import { WorkflowStepService } from './library/providers/api/workflow-step-service';
import { WorkflowTransitionService } from './library/providers/api/workflow-transition-service';
import { CryptoProvider } from './library/providers/crypto-provider';
import { DbProvider } from './library/providers/db-provider';
import { AppSetting } from './library/services/app-setting';
import { AuthService } from './library/services/auth-service';
import { DownloadService } from './library/services/download-service';
import { DrawImageService } from './library/services/draw-image-service';
import { LoggerService } from './library/services/logger-service';
import { PictureService } from './library/services/picture-service';
import { SyncService } from './library/services/sync-service';
import { ToastService } from './library/services/toast-service';
import { UserService } from './library/services/user-service';
import { VideoService } from './library/services/video-service';
import { Viewer3dService } from './library/services/viewer-3d-service';
import { CKEditorPageModule } from 'components/ckeditor/ckeditor.module';
import { ImageEditorPageModule } from 'components/imageeditor/imageeditor.module';
import { PdfViewerComponentModule } from 'components/pdf-viewer-component/pdf-viewer-component.module';
import { SyncSpinnerComponentModule } from 'components/sync-spinner-component/sync-spinner-component.module';
import { MigrationProvider } from './library/providers/migration-provider';

export function languageLoader(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function initializeApp(logService: LoggerService) {
  return () => logService.getLogger();
}

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, IonicModule.forRoot({
            mode: 'md'
        }), AppRoutingModule,
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
        DocumentViewer,
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
        Chooser,
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
        InAppBrowser,
        AppVersion,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [LoggerService],
            multi: true,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
