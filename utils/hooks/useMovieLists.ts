import { useFetch } from "./useFetch";

type MovieLists = {
  dates?: Dates;
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
};

type Dates = {
  maximum: Date;
  minimum: Date;
};

type Result = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export function useMovieLists(searchType: string): {
  data: MovieLists;
  error: any;
  isLoading: boolean;
  isError: boolean;
} {
  const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;

  const { data, error, isLoading, isError } = useFetch(
    ["movies", searchType],
    `${process.env.EXPO_PUBLIC_TMDB_API_URL}/movie/${searchType}?api_key=${apiKey}`
  );

  return { data, error, isLoading, isError };
}
