import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {AboutPage} from './about.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
      AboutPage,
  ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: AboutPage
            }
        ]),
        TranslateModule,
        ComponentsModule
    ]
})
export class AboutPageModule {}
