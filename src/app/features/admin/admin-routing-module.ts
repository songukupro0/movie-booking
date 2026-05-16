import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movie-manage/movie-manage').then(m => m.MovieManage),
  },
  {
    path: 'cinemas',
    loadComponent: () => import('./pages/cinema-manage/cinema-manage').then(m => m.CinemaManage),
  },
  {
    path: 'bookings',
    loadComponent: () => import('./pages/booking-manage/booking-manage').then(m => m.BookingManage),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
