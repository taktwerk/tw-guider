import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ComponentsModule } from '../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/controller/auth/auth.service';
import { StateService } from 'src/controller/state/state.service';
import { AppSettingService } from 'src/controller/services/app-setting.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule,
    TranslateModule.forChild()
  ],
  declarations: [HomePage],
  providers: [StateService, AuthService, AppSettingService]
})
export class HomePageModule {}
