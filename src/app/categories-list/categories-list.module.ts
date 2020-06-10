import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { CategoriesListPage } from './categories-list.page';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';
import {MainPipe} from '../../pipes/main-pipe.module';
import {HtmlDescriptionComponentModule} from '../../components/html-description/html-description-component.module';
import {LanguageSelectorComponentModule} from '../../components/language-selector-component/language-selector-component.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: CategoriesListPage
            }
        ]),
        SyncSpinnerComponentModule,
        MainPipe,
        HtmlDescriptionComponentModule,
        LanguageSelectorComponentModule,
        TranslateModule
    ],
  declarations: [CategoriesListPage]
})
export class CategoriesListModule {}
