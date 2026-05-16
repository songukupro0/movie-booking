import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../../core/services/home.service';
import { Movie } from '../../../core/services/movie.service';

@Component({
  selector: 'app-home-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl:'./banner.html',
  styleUrl: './banner.scss',
})
export class HomeBanner implements OnInit, OnDestroy {
  currentSlide = 0;
  autoSlideInterval: any;
  scrollY = 0;
  slides: Movie[] = [];
  isLoading = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private homeService: HomeService
  ) {}

  @HostListener('window:scroll', [])
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollY = window.scrollY;
    }
  }

  ngOnInit() {
    this.homeService.getBannerMovies().subscribe({
      next: (movies) => {
        this.slides = movies;
        this.isLoading = false;
        this.startAutoSlide();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    if (isPlatformBrowser(this.platformId) && this.slides.length > 1) {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 2000);
    }
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }
}
