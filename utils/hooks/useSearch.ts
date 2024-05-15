import { useFetch } from "./useFetch";

type SearchResponse = {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
};

export type SearchResult = {
  adult: boolean;
  backdrop_path: null | string;
  id: number;
  name?: string;
  title?: string;
  original_name?: string;
  original_title?: string;
  original_language: string;
  overview: string;
  poster_path: null | string;
  media_type: string; // "movie" | "tv" | "person"
  genre_ids: number[];
  popularity: number;
  gender?: number;
  known_for_department?: string;
  known_for?: KnownFor[];
  profile_path?: string;
  release_date?: Date;
  first_air_date?: Date;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  origin_country?: string[];
};

type KnownFor = {
  adult: boolean;
  backdrop_path: null | string;
  id: number;
  name?: string;
  title?: string;
  original_name?: string;
  original_title?: string;
  original_language: string;
  overview: string;
  poster_path: null | string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  release_date?: Date;
  first_air_date?: Date;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  origin_country?: string[];
};

export function useSearch(
  mediaType: string,
  searchQuery: string
): {
  data: SearchResponse;
  error: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const apiKey = process.env.EXPO_PUBLIC_TMDB_AUTH_KEY;

  const { data, error, isLoading, isError, refetch } = useFetch(
    ["search", mediaType, searchQuery],
    `${process.env.EXPO_PUBLIC_TMDB_API_URL}/search/${mediaType}?query=${searchQuery}`,
    {
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + apiKey,
      },
    }
  );

  return { data, error, isLoading, isError, refetch };
}
