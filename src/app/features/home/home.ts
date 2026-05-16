import { Component, inject, OnInit } from '@angular/core';
import { Movie } from '../../core/services/movie.service';
import { HomeService } from '../../core/services/home.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: false
})
export class Home implements OnInit {

  private homeService = inject(HomeService);

  // ── Tabs phim ──────────────────────────────────────────────────
  activeMovieTab: 'now-showing' | 'coming-soon' | 'top-trending' = 'now-showing';
  nowShowingMovies!: Observable<Movie[]>;
  comingSoonMovies!: Observable<Movie[]>;
  topTrendingMovies!: Observable<Movie[]>;

  // ── Posts / Promotions ────────────────────────────────────────
  posts$!: Observable<any[]>;
  promotions$!: Observable<any[]>;
  featuredReview: any;

  // ── Quick Booking state ───────────────────────────────────────
  qbMovies: any[] = [];
  qbCinemas: any[] = [];
  qbDates: string[] = [];
  qbShowtimes: any[] = [];

  qbCinemasLoading = false;
  qbDatesLoading = false;
  qbShowtimesLoading = false;

  selectedMovie: any = null;
  selectedCinema: any = null;
  selectedDate: string = '';
  selectedShowtime: any = null;

  // Dropdown open state
  openDropdown: 'movie' | 'cinema' | 'date' | 'showtime' | null = null;

  ngOnInit(): void {
    this.nowShowingMovies = this.homeService.getNowShowing();
    this.comingSoonMovies = this.homeService.getComingSoon();
    this.topTrendingMovies = this.homeService.getTopTrending();
    this.promotions$ = this.homeService.getPromotions();
    this.posts$ = this.homeService.getPosts();

    this.posts$.subscribe((data) => {
      if (data && data.length > 0) this.featuredReview = data[0];
    });

    // Load danh sách phim cho quick booking
    this.homeService.getQuickMovies().subscribe(movies => {
      this.qbMovies = movies;
    });
  }

  switchMovieTab(tab: 'now-showing' | 'coming-soon' | 'top-trending') {
    this.activeMovieTab = tab;
  }

  // ── Quick Booking logic ─────────────────────────────────────
  toggleDropdown(name: 'movie' | 'cinema' | 'date' | 'showtime') {
    this.openDropdown = this.openDropdown === name ? null : name;
  }

  selectMovie(movie: any) {
    this.selectedMovie = movie;
    this.selectedCinema = null;
    this.selectedDate = '';
    this.selectedShowtime = null;
    this.qbCinemas = [];
    this.qbDates = [];
    this.qbShowtimes = [];
    this.openDropdown = null;
    this.qbCinemasLoading = true;

    this.homeService.getQuickCinemas(movie._id).subscribe(cinemas => {
      this.qbCinemas = cinemas;
      this.qbCinemasLoading = false;
    });
  }

  selectCinema(cinema: any) {
    this.selectedCinema = cinema;
    this.selectedDate = '';
    this.selectedShowtime = null;
    this.qbDates = [];
    this.qbShowtimes = [];
    this.openDropdown = null;
    this.qbDatesLoading = true;

    this.homeService.getQuickDates(this.selectedMovie._id, cinema._id).subscribe(dates => {
      this.qbDates = dates;
      this.qbDatesLoading = false;
    });
  }

  selectDate(date: string) {
    this.selectedDate = date;
    this.selectedShowtime = null;
    this.qbShowtimes = [];
    this.openDropdown = null;
    this.qbShowtimesLoading = true;

    this.homeService.getQuickShowtimes(
      this.selectedMovie._id, this.selectedCinema._id, date
    ).subscribe(showtimes => {
      this.qbShowtimes = showtimes;
      this.qbShowtimesLoading = false;
    });
  }

  selectShowtime(st: any) {
    this.selectedShowtime = st;
    this.openDropdown = null;
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
  }

  canBook(): boolean {
    return !!(this.selectedMovie && this.selectedCinema && this.selectedDate && this.selectedShowtime);
  }
}