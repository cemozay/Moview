import { useFetch } from "./useFetch";

export type Page = {
  results: Result[];
  total_pages: number;
  page: number;
  total_results: number;
};

export type Result = {
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

export default function useFetchYearsMovie(
  startYear: string,
  endYear: string
): {
  data: Page | null;
  error: any;
  isLoading: boolean;
  isError: boolean;
} {
  const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;

  const { data, error, isLoading, isError } = useFetch(
    ["yearlist", startYear, endYear],
    `${process.env.EXPO_PUBLIC_TMDB_API_URL}/discover/movie?api_key=${apiKey}&original_language=en&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`
  );

  const transformedData: Page | null = data
    ? {
        results: data.results,
        total_pages: data.total_pages,
        page: data.page,
        total_results: data.total_results,
      }
    : null;

  return { data: transformedData, error, isLoading, isError };
}
