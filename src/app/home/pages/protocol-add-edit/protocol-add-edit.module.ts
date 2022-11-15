import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProtocolAddEditPage } from './protocol-add-edit.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HtmlDescriptionComponentModule } from 'src/components/html-description/html-description-component.module';
import { ionMenuWithSyncIndicatorComponentModule } from 'src/components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { LanguageSelectorComponentModule } from 'src/components/language-selector-component/language-selector-component.module';
import { ProtocolDefaultComponentModule } from 'src/components/protocol-form-components/protocol-default-component/protocol-default-component.module';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
import { DateAgoPipe } from 'app/library/pipes/date-ago.pipe';
import { MainPipe } from 'app/library/pipes/main-pipe.module';

@NgModule({
    declarations: [
        ProtocolAddEditPage,
        DateAgoPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProtocolAddEditPage
            }
        ]),
        FontAwesomeModule,
        SyncSpinnerComponentModule,
        ionMenuWithSyncIndicatorComponentModule,

        ProtocolDefaultComponentModule,
        HtmlDescriptionComponentModule,
        MainPipe,
        LanguageSelectorComponentModule,
        TranslateModule
    ],
})

export class ProtocolAddEditModule { }
