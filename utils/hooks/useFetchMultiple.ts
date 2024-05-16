import { useQueries } from "react-query";
import axios from "axios";

export function useFetchMultiple(
  keys: Array<Array<any>> = [],
  urls: string[],
  options = {}
) {
  const queries = keys.map((key, index) => {
    return {
      queryKey: key,
      queryFn: async () => {
        const response = await axios.get(urls[index], options);
        return response.data;
      },
    };
  });

  const results = useQueries(queries);

  const combinedResults = {
    data: results.map((result) => result.data),
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
    error: results.find((result) => result.error)?.error,
    refetch: () => results.forEach((result) => result.refetch()),
  };

  return combinedResults;
}
