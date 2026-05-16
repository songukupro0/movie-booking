export interface Movie {
  _id: string;
  slug: string;
  title: string;
  image: string;
  banner: string;
  trailer: string;
  genre: any;
  description: string;
  director: string;
  cast: string[];
  releaseDate: string;
  duration: number;
  ageRating: string;
  vote: number;
  voteCount: number;
  country: string;
  studio: string;
  status: string;
}

export interface PagedResponse {
  movies: Movie[];
  total: number;
  page: number;
  totalPages: number;
}
