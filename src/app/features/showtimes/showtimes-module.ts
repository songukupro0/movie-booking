// d:\angular\movie-booking\src\app\features\showtimes\showtimes-module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowtimeListComponent } from './pages/showtime-list/showtime-list';
import { ShowtimesRoutingModule } from './showtimes-routing-module';

@NgModule({
  declarations: [ShowtimeListComponent],
  imports: [
    CommonModule,
    ShowtimesRoutingModule
  ]
})
export class ShowtimesModule { }
