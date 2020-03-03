import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {LanguageSelectorComponent} from './language-selector-component';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    LanguageSelectorComponent,
  ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslateModule,
    ],
  exports: [
    LanguageSelectorComponent
  ],
})
export class LanguageSelectorComponentModule {}
