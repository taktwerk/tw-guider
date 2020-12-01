import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CKEditorComponent } from './ckeditor.page';
import { TranslateModule } from '@ngx-translate/core';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    CKEditorModule
  ],
  exports: [CKEditorComponent],
  declarations: [CKEditorComponent]
})
export class CKEditorPageModule { }
