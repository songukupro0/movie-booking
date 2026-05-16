import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../../../core/services/home.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.html',
  styleUrl: './review-list.scss'
})
export class ReviewList implements OnInit {
  private homeService = inject(HomeService);
  
  posts: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.homeService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
