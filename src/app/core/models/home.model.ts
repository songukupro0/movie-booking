import { Movie } from './movie.model';
import { Category } from './categories.model';

export interface HomeData {
  banners: Movie[];
  nowShowing: Movie[];
  comingSoon: Movie[];
  topTrending: Movie[];
  categories: Category[];
  posts: any[];
  promotions: any[];
}
