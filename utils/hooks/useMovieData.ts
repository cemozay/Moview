import { useFetch } from "./useFetch";

export type MovieData = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: Date;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type Genre = {
  id: number;
  name: string;
};

type ProductionCompany = {
  id: number;
  logo_path: null | string;
  name: string;
  origin_country: string;
};

type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export function useMovieData(id: string): {
  data: MovieData;
  error: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const apiKey = process.env.EXPO_PUBLIC_TMDB_AUTH_KEY;

  const { data, error, isLoading, isError, refetch } = useFetch(
    ["movies", id],
    `${process.env.EXPO_PUBLIC_TMDB_API_URL}/movie/${id}?language=en-US`,
    {
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + apiKey,
      },
    }
  );

  return { data, error, isLoading, isError, refetch };
}
