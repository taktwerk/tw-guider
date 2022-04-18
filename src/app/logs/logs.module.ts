import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogsPageRoutingModule } from './logs-routing.module';

import { LogsPage } from './logs.page';
import { TranslateModule } from '@ngx-translate/core';
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { MainPipe } from '../../pipes/main-pipe.module';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { MultipleDocumentsPicker } from '@awesome-cordova-plugins/multiple-document-picker/ngx';
// import { FileChooser } from '@ionic-native/file-chooser/ngx';
// import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
// import { FilePath } from '@ionic-native/file-path/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogsPageRoutingModule,
    ionMenuWithSyncIndicatorComponentModule,
    TranslateModule,
    MainPipe,
    // FileChooser,
    // IOSFilePicker,
    // FilePath
  ],
  declarations: [LogsPage],
  providers: [File]
})
export class LogsPageModule { }
