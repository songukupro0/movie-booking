import { Component, input, signal, inject, OnInit, computed, effect } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService, Movie } from '../../../../core/services/movie.service';
import { HomeService } from '../../../../core/services/home.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

interface Showtime {
  format: string;
  times: { id: string; time: string }[];
}

interface CinemaShow {
  id: string;
  name: string;
  showtimes: Showtime[];
}

interface DateOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})

export class MovieDetail implements OnInit {
  private movieService = inject(MovieService);
  private homeService = inject(HomeService);
  private sanitizer = inject(DomSanitizer);
  slug = input.required<string>();

  private movie$ = toObservable(this.slug).pipe(switchMap(slug => this.movieService.getMovieBySlug(slug)));
  movie = toSignal(this.movie$, {
    initialValue: null,
  });

  isPlayingTrailer = signal(false);

  safeTrailerUrl = computed<SafeResourceUrl | null>(() => {
    const movieData = this.movie();
    if (!movieData || !movieData.trailer) return null;

    let videoId = '';
    const url = movieData.trailer;

    const standardMatch = url.match(/v=([^&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);

    if (standardMatch) videoId = standardMatch[1];
    else if (shortMatch) videoId = shortMatch[1];
    else if (embedMatch) videoId = embedMatch[1];
    else videoId = url;

    if (videoId) {
      const autoplay = this.isPlayingTrailer() ? '?autoplay=1' : '';
      const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }

    return null;
  });

  private nowShowingMovies = toSignal(this.movieService.getNowShowingMovies(), {
    initialValue: { movies: [], total: 0, page: 1, totalPages: 1 },
  });

  sidebarMovies = computed(() => {
    return (this.nowShowingMovies()?.movies ?? []).slice(0, 3).map((m: Movie) => ({
      ...m,
      age: m.ageRating || 'T18',
    }));
  });

  selectedDate = signal<string>('');
  availableDates = signal<DateOption[]>([]);
  cinemas = signal<CinemaShow[]>([]);
  isLoadingCinemas = signal<boolean>(false);

  constructor() {
    effect(() => {
      const movie = this.movie();
      if (movie?._id) {
        this.loadAvailableDates(movie._id, this.selectedDate());
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {}

  loadAvailableDates(movieId: string, preferredDate?: string) {
    this.homeService.getQuickCinemas(movieId).subscribe({
      next: (cinemasData: any[]) => {
        if (!cinemasData?.length) {
          this.availableDates.set([]);
          this.cinemas.set([]);
          this.isLoadingCinemas.set(false);
          return;
        }

        const primaryCinemaId = cinemasData[0]._id;
        this.homeService.getQuickDates(movieId, primaryCinemaId).subscribe({
          next: (dates: string[]) => {
            const mappedDates = dates.map(date => ({
              value: date,
              label: new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
              }),
            }));

            this.availableDates.set(mappedDates);

            const chosenDate = preferredDate && dates.includes(preferredDate)
              ? preferredDate
              : dates[0] ?? '';

            if (chosenDate) {
              this.selectedDate.set(chosenDate);
              this.loadShowtimes(movieId, chosenDate, cinemasData);
            } else {
              this.cinemas.set([]);
            }
          },
          error: () => {
            this.availableDates.set([]);
            this.cinemas.set([]);
          },
        });
      },
      error: () => {
        this.availableDates.set([]);
        this.cinemas.set([]);
      },
    });
  }

  loadShowtimes(movieId: string, dateStr: string, cinemasData?: any[]) {
    this.isLoadingCinemas.set(true);

    const loadCinemas = cinemasData
      ? { subscribe: (observer: any) => observer.next(cinemasData) }
      : this.homeService.getQuickCinemas(movieId);

    loadCinemas.subscribe({
      next: (cinemas: any[]) => {
        if (!cinemas?.length) {
          this.cinemas.set([]);
          this.isLoadingCinemas.set(false);
          return;
        }

        let loadedCount = 0;
        const resultCinemas: CinemaShow[] = [];

        cinemas.forEach(cinema => {
          this.homeService.getQuickShowtimes(movieId, cinema._id, dateStr).subscribe({
            next: (showtimes: any[]) => {
              if (showtimes?.length) {
                resultCinemas.push({
                  id: cinema._id,
                  name: cinema.name,
                  showtimes: [{
                    format: 'Phim 2D',
                    times: showtimes.map(showtime => ({
                      id: showtime._id,
                      time: new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }),
                    })),
                  }],
                });
              }

              loadedCount++;
              if (loadedCount === cinemas.length) {
                this.cinemas.set(resultCinemas);
                this.isLoadingCinemas.set(false);
              }
            },
            error: () => {
              loadedCount++;
              if (loadedCount === cinemas.length) {
                this.cinemas.set(resultCinemas);
                this.isLoadingCinemas.set(false);
              }
            },
          });
        });
      },
      error: (err: unknown) => {
        console.error('Error loading cinemas', err);
        this.cinemas.set([]);
        this.isLoadingCinemas.set(false);
      },
    });
  }

  selectDate(date: string) {
    this.selectedDate.set(date);
    const movie = this.movie();
    if (movie?._id) {
      this.loadShowtimes(movie._id, date);
    }
  }
}
