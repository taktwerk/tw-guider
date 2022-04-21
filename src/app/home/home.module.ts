import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { IonicModule } from '@ionic/angular';
import { LanguageSelectorComponentModule } from '../../components/language-selector-component/language-selector-component.module';
import { NgModule } from '@angular/core';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { RouterModule } from '@angular/router';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ]),
        SyncSpinnerComponentModule,
        ionMenuWithSyncIndicatorComponentModule,

        LanguageSelectorComponentModule,
        TranslateModule.forChild()
    ],
    declarations: [HomePage],
    providers: [QRScanner, PhotoViewer]
})
export class HomePageModule { }
