import { useFetchMultiple } from "./useFetchMultiple";
import { MovieData } from "./useMovieData";

export function useMovieDataArray(ids: string[]): {
  data: MovieData[];
  error: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const apiKey = process.env.EXPO_PUBLIC_TMDB_AUTH_KEY;

  const results = useFetchMultiple(
    ids.map((id) => ["movies", id]),
    ids.map(
      (id) =>
        `${process.env.EXPO_PUBLIC_TMDB_API_URL}/movie/${id}?language=en-US`
    ),
    {
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + apiKey,
      },
    }
  );

  return results;
}
