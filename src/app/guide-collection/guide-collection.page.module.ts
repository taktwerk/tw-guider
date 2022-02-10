import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GuideCollectionPage } from './guide-collection.page';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { LanguageSelectorComponentModule } from '../../components/language-selector-component/language-selector-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { MainPipe } from '../../pipes/main-pipe.module';
import { GuideListComponentModule } from "../../components/guide-list-component/guide-list-component.module";
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';

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
