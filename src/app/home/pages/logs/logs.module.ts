import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogsPageRoutingModule } from './logs-routing.module';
import { LogsPage } from './logs.page';
import { TranslateModule } from '@ngx-translate/core';
import { File } from '@ionic-native/file/ngx';
import { ionMenuWithSyncIndicatorComponentModule } from 'src/components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { MainPipe } from 'src/app/library/pipes/main-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogsPageRoutingModule,
    ionMenuWithSyncIndicatorComponentModule,
    TranslateModule,
    MainPipe,
    // Chooser,
    // IOSFilePicker,
    // FilePath
  ],
  declarations: [LogsPage],
  providers: [File]
})
export class LogsPageModule { }
