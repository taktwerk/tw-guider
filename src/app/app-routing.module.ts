import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SyncModalComponent } from 'src/components/sync-modal-component/sync-modal-component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadChildren: () => import('./home/pages/about/about.page.module').then(m => m.AboutPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'guide-categories',
    loadChildren: () => import('./home/pages/categories-list/categories-list.module').then(m => m.CategoriesListModule)
  },
  {
    path: 'sync-model',
    component: SyncModalComponent
    // loadChildren: () => import('../components/sync-modal-component/sync-modal-component.module').then(m => m.SyncModalComponentModule)
  },
  {
    path: 'guides/:guideCategoryId',
    loadChildren: () => import('./home/pages/list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'guide/:guideId',
    loadChildren: () => import('./home/pages/guide/guide.module').then(m => m.GuidePageModule)
  },
  {
    path: 'guide/:guideId/:parentCollectionId',
    loadChildren: () => import('./home/pages/guide/guide.module').then(m => m.GuidePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./home/pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./home/pages/feedback/feedback.page.module').then(m => m.FeedbackPageModule)
  },
  {
    path: ':reference_model_alias/:reference_id/feedback',
    loadChildren: () => import('./home/pages/feedback/feedback.page.module').then(m => m.FeedbackPageModule)
  },
  /// add/edit feedback
  {
    path: 'feedback/save',
    loadChildren: () => import('./home/pages/feedback-add-edit/feedback-add-edit.module').then(m => m.FeedbackAddEditModule)
  },
  {
    path: ':reference_model_alias/:reference_id/feedback/save',
    loadChildren: () => import('./home/pages/feedback-add-edit/feedback-add-edit.module').then(m => m.FeedbackAddEditModule)
  },
  {
    path: 'feedback/save/:feedbackId',
    loadChildren: () => import('./home/pages/feedback-add-edit/feedback-add-edit.module').then(m => m.FeedbackAddEditModule)
  },
  {
    path: ':reference_model_alias/:reference_id/feedback/save/:feedbackId',
    loadChildren: () => import('./home/pages/feedback-add-edit/feedback-add-edit.module').then(m => m.FeedbackAddEditModule)
  },
  {
    path: 'protocol/save/:protocolId',
    loadChildren: () => import('./home/pages/protocol-add-edit/protocol-add-edit.module').then(m => m.ProtocolAddEditModule)
  },
  {
    path: 'protocol/save',
    loadChildren: () => import('./home/pages/protocol-add-edit/protocol-add-edit.module').then(m => m.ProtocolAddEditModule)
  },
  {
    path: 'protocol',
    loadChildren: () => import('./home/pages/protocol/protocol.page.module').then(m => m.ProtocolPageModule)
  },
  {
    path: 'guide-collection/:guideId',
    loadChildren: () => import('./home/pages/guide-collection/guide-collection.page.module').then(m => m.GuideCollectionModule)
  },
  {
    path: 'guider_protocol_template/:templateId',
    loadChildren: () => import('./home/pages/protocol/protocol.page.module').then(m => m.ProtocolPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./home/pages/logout/logout.module').then(m => m.LogoutPageModule)
  },
  {
    path: 'guidecapture',
    loadChildren: () => import('./home/pages/guidecapture/guidecapture.module').then(m => m.GuidecapturePageModule)
  },
  {
    path: 'editguide',
    loadChildren: () => import('./home/pages/editguide/editguide.module').then(m => m.EditguidePageModule)
  },
  {
    path: 'editguide',
    children: [
      {
        path: ':id',
        loadChildren: () => import('./home/pages/editguide/editguide.module').then(m => m.EditguidePageModule)
      }
    ]
  },
  {
    path: 'guidestep-add-edit',
    loadChildren: () => import('./home/pages/guidestep-add-edit/guidestep-add-edit.module').then(m => m.GuidestepAddEditPageModule)
  },
  {
    path: 'logs',
    loadChildren: () => import('./home/pages/logs/logs.module').then(m => m.LogsPageModule)
  },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslateModule
  ],
  exports: [RouterModule, TranslateModule]
})
export class AppRoutingModule { }
