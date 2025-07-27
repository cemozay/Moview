import { useQuery } from "react-query";
import axios from "axios";

export function useFetch(
  key: Array<any> = [],
  url: string,
  options = {},
  enabled = true
) {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: key, // Example: ['posts', 1]
    queryFn: async () => {
      const response = await axios.get(url, options);
      return response.data;
    },
    enabled: enabled,
  });

  return { data, error, isLoading, isError, refetch };
}
