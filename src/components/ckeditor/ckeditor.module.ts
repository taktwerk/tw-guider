import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CKEditorPageRoutingModule } from './ckeditor-routing.module';

import { CKEditorComponent } from './ckeditor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CKEditorPageRoutingModule,
    
  ],
  exports: [CKEditorComponent],
  declarations: [CKEditorComponent]
})
export class CKEditorPageModule { }
