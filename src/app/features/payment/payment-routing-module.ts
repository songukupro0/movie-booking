import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/payment-page/payment-page').then(m => m.PaymentPage),
  },
  {
    path: 'success',
    loadComponent: () => import('./pages/payment-success/payment-success').then(m => m.PaymentSuccess),
  },
  {
    path: 'fail',
    loadComponent: () => import('./pages/payment-fail/payment-fail').then(m => m.PaymentFail),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
