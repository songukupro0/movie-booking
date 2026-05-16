import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'seat-selection',
    loadComponent: () => import('./pages/seat-selection/seat-selection').then(m => m.SeatSelection)
  },
  {
    path: 'booking-confirm',
    loadComponent: () => import('./pages/booking-confirm/booking-confirm').then(m => m.BookingConfirm)
  },
  {
    path: '',
    redirectTo: 'seat-selection',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}