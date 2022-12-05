import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SyncModalComponent } from './sync-modal-component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from "../components/components.module";

@NgModule({
    declarations: [SyncModalComponent],
    exports: [],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
        ComponentsModule
    ]
})
export class SyncModalComponentModule { }
