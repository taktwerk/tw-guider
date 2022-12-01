import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartRoutingModule } from './start-routing.module';
import { StartComponent } from './start.component';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppSettingService } from 'src/controller/services/app-setting.service';


@NgModule({
  declarations: [StartComponent],
  imports: [
    CommonModule,
    StartRoutingModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild()
  ],
  providers: [AppSettingService]
})
export class StartModule { }
