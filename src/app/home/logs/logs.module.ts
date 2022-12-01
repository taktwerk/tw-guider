import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogsPageRoutingModule } from './logs-routing.module';
import { LogsPage } from './logs.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { LoggerService } from 'src/controller/services/logger-service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogsPageRoutingModule,
    TranslateModule,
    ComponentsModule,
  ],
  declarations: [LogsPage],
  providers: [LoggerService]
})
export class LogsPageModule { }
