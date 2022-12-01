import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/controller/auth/guards/auth-guard/auth.guard';
import { HomeGuard } from 'src/controller/auth/guards/home-guard/home.guard';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'start',
        loadChildren: () => import('./start/start.module').then(m => m.StartModule),
        canActivate:[AuthGuard]
      },
      {
        path: 'guides',
        loadChildren: () => import('./guides/guides.module').then(m => m.GuidesModule),
        canActivate: [HomeGuard],
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
        canActivate: [HomeGuard],
      },
      {
        path: 'logs',
        loadChildren: () => import('./logs/logs.module').then(m => m.LogsPageModule),
        // canActivate: [HomeGuard],
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.page.module').then(m => m.AboutPageModule),
        // canActivate: [HomeGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
