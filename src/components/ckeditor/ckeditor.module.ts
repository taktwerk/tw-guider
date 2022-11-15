import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CKEditorComponent } from './ckeditor.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    CKEditorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CKEditorModule
  ],
  exports: [CKEditorComponent],

})
export class CKEditorPageModule { }
