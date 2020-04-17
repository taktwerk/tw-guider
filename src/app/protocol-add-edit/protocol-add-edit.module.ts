import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';
import {MainPipe} from '../../pipes/main-pipe.module';
import {HtmlDescriptionComponentModule} from '../../components/html-description/html-description-component.module';
import {LanguageSelectorComponentModule} from '../../components/language-selector-component/language-selector-component.module';
import {TranslateModule} from '@ngx-translate/core';
import {ProtocolAddEditPage} from './protocol-add-edit.page';
import {ProtocolDefaultComponentModule} from '../../components/protocol-form-components/protocol-default-component/protocol-default-component.module';

@NgModule({
  declarations: [
      ProtocolAddEditPage
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
        SyncSpinnerComponentModule,
        ProtocolDefaultComponentModule,
        HtmlDescriptionComponentModule,
        MainPipe,
        LanguageSelectorComponentModule,
        TranslateModule
    ],
})

export class ProtocolAddEditModule {}
