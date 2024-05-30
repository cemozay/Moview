import { useEffect, useState } from "react";

type People = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  cast_id?: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
};

const useFetchCrew = (movieId: string) => {
  const [cast, setCast] = useState<People[]>([]);
  const [crew, setCrew] = useState<People[]>([]);
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

    return () => {};
  }, [movieId]);

  return { cast, crew, isLoading, error };
};

export default useFetchCrew;
