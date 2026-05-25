import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

function SearchPage() {
  const { query } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/search/movie`,
          {
            params: {
              api_key: API_KEY,
              query: query,
            },
          }
        );
        setMovies(res.data.results);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const handleMovieClick = async (movieId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "credits,videos",
        },
      });
      setSelectedMovieDetails(res.data);
      setSelectedMovieId(movieId);
    } catch (error) {
      console.error("Error fetching movie details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedMovieDetails) return <Loading />;

  if (selectedMovieDetails) {
    const trailer = selectedMovieDetails.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setSelectedMovieDetails(null)}
            className="mb-8 px-6 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
          >
            ← Back to Results
          </button>

          <div className="bg-primary rounded-lg shadow-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-1">
                <img
                  src={
                    selectedMovieDetails.poster_path
                      ? `${IMG_URL}${selectedMovieDetails.poster_path}`
                      : "/no-image.png"
                  }
                  alt={selectedMovieDetails.title}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="md:col-span-2">
                <h2 className="text-4xl font-bold text-white mb-4">{selectedMovieDetails.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">{selectedMovieDetails.overview}</p>

                <div className="space-y-3">
                  <p className="text-gray-300">
                    <strong className="text-accent">Release Date:</strong>{" "}
                    {selectedMovieDetails.release_date || "N/A"}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-accent">Runtime:</strong>{" "}
                    {selectedMovieDetails.runtime
                      ? `${selectedMovieDetails.runtime} min`
                      : "N/A"}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-accent">Rating:</strong>{" "}
                    {selectedMovieDetails.vote_average?.toFixed(1)} / 10
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-accent">Genres:</strong>{" "}
                    {selectedMovieDetails.genres
                      ?.map((g) => g.name)
                      .join(", ") || "N/A"}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-accent">Language:</strong>{" "}
                    {selectedMovieDetails.original_language?.toUpperCase() || "N/A"}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-accent">Budget:</strong>{" "}
                    {selectedMovieDetails.budget
                      ? `$${selectedMovieDetails.budget.toLocaleString()}`
                      : "N/A"}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-accent">Revenue:</strong>{" "}
                    {selectedMovieDetails.revenue
                      ? `$${selectedMovieDetails.revenue.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>

                {selectedMovieDetails.credits?.cast?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-accent mb-4">Top Cast:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMovieDetails.credits.cast.slice(0, 6).map((actor) => (
                        <li key={actor.id} className="text-gray-300">
                          <span className="text-white font-semibold">{actor.name}</span> as{" "}
                          <em className="text-accent">{actor.character}</em>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {trailer && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-accent mb-4">Trailer:</h3>
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title="Movie Trailer"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-8">Search Results for "<span className="text-accent">{query}</span>"</h2>

        {movies.length === 0 ? (
          <p className="text-xl text-gray-400">No movies found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                <div className="relative group">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMG_URL}${movie.poster_path}`
                        : "/no-image.png"
                    }
                    alt={movie.title}
                    className="w-full rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center">
                      <p className="text-white text-sm">View Details</p>
                    </div>
                  </div>
                </div>

                <h3 className="mt-3 text-white font-semibold text-sm line-clamp-2">{movie.title}</h3>

                <p className="text-accent font-bold mt-1">⭐ {movie.vote_average?.toFixed(1) || "N/A"}</p>

                <p className="text-gray-400 text-xs">{movie.release_date || "N/A"}</p>

                <p className="text-gray-300 text-xs line-clamp-2 mt-2">{movie.overview}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;