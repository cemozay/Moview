import { useFetch } from "./useFetch";

type MovieData = {
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

export function useMovieData(
  id: string,
  url?: string
): {
  data: MovieData;
  error: any;
  isLoading: boolean;
  isError: boolean;
} {
  //api_key = process.env.REACT_APP_TMDB_API_KEY; environment variable olacak
  const apiKey =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0";

  const { data, error, isLoading, isError } = useFetch(
    ["movies", id],
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    {
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + apiKey,
      },
    }
  );

  return { data, error, isLoading, isError };
}
