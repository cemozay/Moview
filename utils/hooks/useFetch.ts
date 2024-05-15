import { useQuery } from "react-query";
import axios from "axios";

export function useFetch(key: Array<any> = [], url: string, options = {}) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: key, // Example: ['posts', 1]
    queryFn: async () => {
      const response = await axios.get(url, options);
      return response.data;
    },
  });

  return { data, error, isLoading, isError, refetch };
}
