// fetchTrailer.js
export const fetchTrailer = async (movieId: string, setTrailerUrl: (url: string) => void) => {
  
  const apiKey = process.env.EXPO_PUBLIC_TMDB_AUTH_KEY;

  try {
    const options: RequestInit = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + apiKey,
      },
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      options
    );
    const data = await response.json();

    console.log("API response:", data);

    if (data.results && data.results.length > 0) {
      const trailer = data.results.find(
        (video: { type: string; site: string; name: string; key: string }) =>
          video.type === "Trailer" &&
          video.site === "YouTube" &&
          video.name === "Official Trailer"
      );
        
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
      } else {
        console.error("No suitable trailer found");
      }
    } else {
      console.error("No videos found for this movie");
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
  }
};