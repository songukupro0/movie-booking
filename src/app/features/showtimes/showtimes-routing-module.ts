import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowtimeListComponent } from './pages/showtime-list/showtime-list';

const routes: Routes = [
  { path: '', component: ShowtimeListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowtimesRoutingModule {}
