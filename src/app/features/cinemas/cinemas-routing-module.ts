import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // Lazy load the CinemaList component
    loadComponent: () => import('./pages/cinema-list/cinema-list').then(m => m.CinemaList)
  },
  {
    path: ':id',
    // Lazy load the CinemaDetail component
    loadComponent: () => import('./pages/cinema-detail/cinema-detail').then(m => m.CinemaDetail)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CinemasRoutingModule {}
