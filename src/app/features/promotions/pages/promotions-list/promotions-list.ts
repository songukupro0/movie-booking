import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../../core/services/home.service';

@Component({
  selector: 'app-promotions-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotions-list.html',
  styleUrl: './promotions-list.scss'
})
export class PromotionsList implements OnInit {
  private homeService = inject(HomeService);
  
  promotions: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.homeService.getPromotions().subscribe({
      next: (data) => {
        this.promotions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching promotions', err);
        this.isLoading = false;
      }
    });
  }
}
