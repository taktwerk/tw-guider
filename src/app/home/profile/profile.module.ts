import { NgModule } from '@angular/core';
import { ProfilePage } from './profile';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [
    ProfilePage,
  ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProfilePage
            }
        ]),
        TranslateModule,
        ComponentsModule
    ]
})
export class ProfilePageModule {}
