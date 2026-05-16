import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', // Mặc định redirect qua now-showing hoặc để /now-showing là trang chính
    redirectTo: 'now-showing',
    pathMatch: 'full'
  },
  {
    path: 'now-showing',
    loadComponent: () => import('./pages/now-showing/now-showing').then(m => m.NowShowing)
  },
  {
    path: 'coming-soon',
    loadComponent: () => import('./pages/coming-soon/coming-soon').then(m => m.ComingSoon)
  },
  {
    path: ':slug',
    loadComponent: () => import('./pages/movie-detail/movie-detail').then(m => m.MovieDetail)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
