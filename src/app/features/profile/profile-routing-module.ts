import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/profile-page/profile-page').then(m => m.ProfilePage),
  },
  {
    path: 'booking-history',
    loadComponent: () => import('./pages/booking-history/booking-history').then(m => m.BookingHistory),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
