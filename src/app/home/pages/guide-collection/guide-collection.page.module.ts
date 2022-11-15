import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GuideCollectionPage } from './guide-collection.page';
import { TranslateModule } from '@ngx-translate/core';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { GuideListComponentModule } from 'src/components/guide-list-component/guide-list-component.module';
import { ionMenuWithSyncIndicatorComponentModule } from 'src/components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { LanguageSelectorComponentModule } from 'src/components/language-selector-component/language-selector-component.module';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
import { MainPipe } from 'app/library/pipes/main-pipe.module';

@NgModule({
  declarations: [
    GuideCollectionPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: GuideCollectionPage
      }
    ]),
    SyncSpinnerComponentModule,
    ionMenuWithSyncIndicatorComponentModule,

    LanguageSelectorComponentModule,
    TranslateModule,
    MainPipe,
    GuideListComponentModule
  ],
  providers: [File, PhotoViewer],
  exports: [
  ],
})
export class GuideCollectionModule { }
