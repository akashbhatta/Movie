import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import Trending from "./Trending";
import Popularity from "./Popularity"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

function MovieApp() {
  const [query, setQuery] = useState("");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Fetch random popular movies
  const fetchSuggestions = async () => {
    try {
      const randomPage = Math.floor(Math.random() * 10) + 1;

      const res = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
          page: randomPage,
        },
      });

      setSuggestions(res.data.results.slice(0, 10));
    } catch (err) {
      console.error("Error fetching suggestions", err);
    }
  };

  // Fetch movie details
  const fetchMovie = async (id = null, searchQuery = null) => {
    if (!searchQuery?.trim() && !id) return;

    setLoading(true);
    setError("");
    setMovie(null);

    try {
      let movieId = id;

      // Search movie by name
      if (!id) {
        const searchRes = await axios.get(`${BASE_URL}/search/movie`, {
          params: {
            api_key: API_KEY,
            query: searchQuery,
          },
        });

        if (searchRes.data.results.length === 0) {
          setError("No movies found");
          return;
        }

        movieId = searchRes.data.results[0].id;
      }

      // Fetch movie details
      const movieRes = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "credits,videos",
        },
      });

      setMovie(movieRes.data);

      // Scroll to movie details
      const el = document.getElementById("movie-section");

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
        });
      }
    } catch (err) {
      console.error("API Error", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Find trailer
  const trailer = movie?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <section
      id="movies"
      className="min-h-screen bg-gray-950 pt-6 pb-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-6">
          🎬 Movie Finder
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-5">
      
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && fetchMovie(null, query)
            }
            placeholder="Enter movie name..."
            className="flex-1 max-w-xl px-5 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />

          <button
            onClick={() => fetchMovie(null, query)}
            disabled={!query.trim()}
            className="px-7 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>
        <Trending/>

        {/* Loading */}
        {loading && <Loading />}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-lg font-semibold my-6">
            {error}
          </p>
        )}

        {/* Movie Details */}
        {movie && (
          <div
            id="movie-section"
            className="bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 mb-12 border border-gray-800"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {movie.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Poster */}
              <div>
                <img
                  src={
                    movie.poster_path
                      ? `${IMG_URL}${movie.poster_path}`
                      : "/no-image.png"
                  }
                  alt={movie.title}
                  className="w-full rounded-xl shadow-lg"
                />

                <a
                  href={`https://www.themoviedb.org/movie/${movie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 px-4 py-3 bg-yellow-400 text-black font-semibold rounded-xl text-center hover:bg-yellow-300 transition"
                >
                  View on TMDB
                </a>
              </div>

              {/* Movie Info */}
              <div className="md:col-span-2 space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p className="text-gray-300">
                    <strong className="text-yellow-400">
                      Release Date:
                    </strong>{" "}
                    {movie.release_date || "N/A"}
                  </p>

                  <p className="text-gray-300">
                    <strong className="text-yellow-400">
                      Runtime:
                    </strong>{" "}
                    {movie.runtime
                      ? `${movie.runtime} min`
                      : "N/A"}
                  </p>

                  <p className="text-gray-300">
                    <strong className="text-yellow-400">
                      Rating:
                    </strong>{" "}
                    {movie.vote_average?.toFixed(1)} / 10
                  </p>

                  <p className="text-gray-300">
                    <strong className="text-yellow-400">
                      Language:
                    </strong>{" "}
                    {movie.original_language?.toUpperCase() ||
                      "N/A"}
                  </p>
                </div>

                <p className="text-gray-300">
                  <strong className="text-yellow-400">
                    Genres:
                  </strong>{" "}
                  {movie.genres?.map((g) => g.name).join(", ") ||
                    "N/A"}
                </p>

                <p className="text-gray-300">
                  <strong className="text-yellow-400">
                    Budget:
                  </strong>{" "}
                  {movie.budget
                    ? `$${movie.budget.toLocaleString()}`
                    : "N/A"}
                </p>

                <p className="text-gray-300">
                  <strong className="text-yellow-400">
                    Revenue:
                  </strong>{" "}
                  {movie.revenue
                    ? `$${movie.revenue.toLocaleString()}`
                    : "N/A"}
                </p>

                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-yellow-400">
                    Overview:
                  </strong>{" "}
                  {movie.overview || "N/A"}
                </p>
              </div>
            </div>

            {/* Cast */}
            {movie.credits?.cast?.length > 0 && (
              <div className="mt-10">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                  Top Cast
                </h3>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {movie.credits.cast
                    .slice(0, 6)
                    .map((actor) => (
                      <li
                        key={actor.id}
                        className="text-gray-300"
                      >
                        <span className="text-white font-semibold">
                          {actor.name}
                        </span>{" "}
                        as{" "}
                        <em className="text-yellow-400">
                          {actor.character}
                        </em>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Trailer */}
            {trailer ? (
              <div className="mt-10">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                  Trailer
                </h3>

                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-xl"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Movie Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic mt-8">
                No trailer available.
              </p>
            )}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              🎬 You Might Also Like
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => fetchMovie(item.id)}
                  className="cursor-pointer transform hover:scale-105 transition"
                >
                  <img
                    src={
                      item.poster_path
                        ? `${IMG_URL}${item.poster_path}`
                        : "/no-image.png"
                    }
                    alt={item.title}
                    className="w-full rounded-xl shadow-lg hover:shadow-2xl transition"
                  />

                  <p className="mt-3 text-white font-semibold text-sm line-clamp-2">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <Popularity/>
    </section>
  );
}

export default MovieApp;