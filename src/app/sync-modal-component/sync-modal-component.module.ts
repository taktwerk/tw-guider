import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SyncModalComponent } from './sync-modal-component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from "../components/components.module";
import { RouterModule } from '@angular/router';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';

@NgModule({
    declarations: [SyncModalComponent],
    exports: [],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([
          {
            path: '',
            component: SyncModalComponent
          }
        ]),
        TranslateModule,
        ComponentsModule
    ],
    providers: [Insomnia]
})
export class SyncModalComponentModule { }
