import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CKEditorComponent } from './ckeditor.page';

const routes: Routes = [
  {
    path: '',
    component: CKEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CKEditorPageRoutingModule { }
