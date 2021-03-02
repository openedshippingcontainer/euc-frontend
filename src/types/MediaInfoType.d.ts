interface Cast {
  character: string;
  id: string;
  imdbid: string;
  name: string;
  order: number;
  profile: string;
  tmdbid: string;
}

interface Crew {
  department: string;
  id: string;
  imdb: string;
  job: number;
  name: string;
  profile_path: string;
}

interface ImdbData {
  cast: Array<Cast>;
  crew: Array<Crew>;
  imdbid: string;
  languages: Array<string>;
  movieGenres: string;
  plotoutline: string;
  poster: string;
  rating: string;
  runtime: string;
  title: string;
  votes: number;
  year: string;
}

interface Genre {
  id: number;
  name: string;
}

interface TrailerType {
  key: string;
  name: string;
  site: string;
  type: string;
}

interface Asset {
  backdrop: string;
  backdrop_large: string;
  backdrop_medium: string;
  backdrop_path: string;
  backdrop_small: string;
  created_by: Array<Crew>;
  first_air_date: string;
  genres: Array<Genre>;
  imdb_id: string;
  mediaTitle: string;
  movieGenres: string;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  original_title: string;
  overview: string;
  poster: string;
  poster_large: string;
  poster_medium: string;
  poster_original: string;
  poster_path: string;
  poster_small: string;
  release_date: string;
  status: string;
  title: string;
  trailers: Array<TrailerType>;
  vote_average: string;
  vote_count: string;
}

interface TmdbData {
  asset: Asset;
  casts: Array<Cast>;
  crew: Array<Crew>;
  movieType: string;
  results: Array<{ [key: string]: string }>;
  tmdbid: number;
}

interface MediaInfoType {
  imdbData: ImdbData;
  info: TmdbData;
}