import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {ApiSync} from '../providers/api-sync';
import {GuiderService} from '../providers/api/guider-service';
import {DbProvider} from '../providers/db-provider';
import {AuthService} from '../services/auth-service';
import {HttpClient} from '../services/http-client';
import {DownloadService} from '../services/download-service';
import { File } from '@ionic-native/file/ngx';
import {Network} from '@ionic-native/network/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {GuideCategoryService} from '../providers/api/guide-category-service';
import {GuideCategoryBindingService} from '../providers/api/guide-category-binding-service';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {GuideStepService} from '../providers/api/guide-step-service';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import {SyncService} from '../services/sync-service';
import {UserService} from '../services/user-service';
import {DatePipe} from '@angular/common';
import {GuideAssetService} from '../providers/api/guide-asset-service';
import {GuideAssetPivotService} from '../providers/api/guide-asset-pivot-service';
import {GuideAssetTextModalComponent} from '../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import {CryptoProvider} from '../providers/crypto-provider';
import {FeedbackService} from '../providers/api/feedback-service';
import {SyncSpinnerComponentModule} from '../components/sync-spinner-component/sync-spinner-component.module';
import {ApiPush} from '../providers/api-push';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {MainPipe} from '../pipes/main-pipe.module';
import {HtmlDescriptionComponentModule} from '../components/html-description/html-description-component.module';
import {SyncModalComponent} from '../components/sync-modal-component/sync-modal-component';
import {IOSFilePicker} from '@ionic-native/file-picker';

@NgModule({
  declarations: [
    AppComponent,
    GuideAssetTextModalComponent,
    SyncModalComponent,
  ],
  entryComponents: [GuideAssetTextModalComponent, SyncModalComponent],
    imports: [
        BrowserModule,
        FormsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        SyncSpinnerComponentModule,
        MainPipe,
        HtmlDescriptionComponentModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    GuiderService,
    GuiderService,
    GuideCategoryService,
    GuideCategoryBindingService,
    GuideStepService,
    GuideAssetService,
    GuideAssetPivotService,
    FeedbackService,
    DbProvider,
    AuthService,
    HttpClient,
    DownloadService,
    ApiSync,
    ApiPush,
    Storage,
    File,
    Toast,
    WebView,
    Network,
    StreamingMedia,
    PhotoViewer,
    VideoPlayer,
    SyncService,
    UserService,
    DatePipe,
    CryptoProvider,
    FilePath,
    FileChooser,
    IOSFilePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
