// useFetchCrew.js
import { useEffect, useState } from "react";

type MovieCreditsList = {
    cast: Person[];
    crew: Person[];
    id: number;
  };

  type Person = {
    adult: boolean;
    backdrop_path: null | string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: null | string;
    release_date: Date;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character?: string;
    credit_id: string;
    order?: number;
    department?: string;
    job?: string;
  };

const useFetchCrew = (movieId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const apiKey = process.env.EXPO_PUBLIC_TMDB_AUTH_KEY;

      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + apiKey,
          },
        };

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_TMDB_API_URL}/movie/${movieId}/credits?language=en-US`,
          options
        );
        const data = await response.json();

        setCast(data.cast);
        setCrew(data.crew);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
    };
  }, [movieId]);

  return { cast, crew, isLoading, error };
};

export default useFetchCrew;
