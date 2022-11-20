import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import {TranslateModule} from '@ngx-translate/core';
import { LanguageSelectorComponentModule } from 'components/language-selector-component/language-selector-component.module';
import { LoginPage } from './login/login.page';
import { FormsModule } from '@angular/forms';
import { ionMenuWithSyncIndicatorComponentModule } from 'components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    AuthRoutingModule,
    LanguageSelectorComponentModule,
    TranslateModule,
    IonicModule,
    FormsModule,
    ionMenuWithSyncIndicatorComponentModule
  ]
})
export class AuthModule { }
