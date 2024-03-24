import { useFetch } from "./useFetch";

type GenreList = {
  genres: Genre[];
};

type Genre = {
  id: number;
  name: string;
};

export function useGenreList(searchType: string): {
  data: GenreList;
  error: any;
  isLoading: boolean;
  isError: boolean;
} {
  const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;

  const { data, error, isLoading, isError } = useFetch(
    ["movies", searchType],
    `${process.env.EXPO_PUBLIC_TMDB_API_URL}/genre/${searchType}/list?api_key=${apiKey}`
  );

  return { data, error, isLoading, isError };
}
