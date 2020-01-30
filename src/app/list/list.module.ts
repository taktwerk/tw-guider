import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ListPage } from './list.page';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';
import {MainPipe} from '../../pipes/main-pipe.module';
import {HtmlDescriptionComponentModule} from '../../components/html-description/html-description-component.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ListPage
            }
        ]),
        SyncSpinnerComponentModule,
        MainPipe,
        HtmlDescriptionComponentModule
    ],
  declarations: [ListPage]
})
export class ListPageModule {}
