import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const LIMIT = 10;

const TopRated = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTopRated();
  }, [mediaType, page]);

  const fetchTopRated = async () => {
    setLoading(true);
    setError("");

    try {
      let movieResults = [];
      let tvResults = [];

      if (mediaType === "all" || mediaType === "movie") {
        const movieRes = await axios.get(`${BASE_URL}/movie/top_rated`, {
          params: { api_key: API_KEY, page },
        });

        movieResults = movieRes.data.results.map((item) => ({
          ...item,
          media_type: "movie",
        }));
      }

      if (mediaType === "all" || mediaType === "tv") {
        const tvRes = await axios.get(`${BASE_URL}/tv/top_rated`, {
          params: { api_key: API_KEY, page },
        });

        tvResults = tvRes.data.results.map((item) => ({
          ...item,
          media_type: "tv",
        }));
      }

      const combined = [...movieResults, ...tvResults]
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, LIMIT);

      setItems(combined);
      setTotalPages(500);
    } catch (err) {
      console.error("Error fetching top rated:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (id, type) => {
    navigate(`/media/${type}/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

          <h1 className="text-5xl font-bold text-white">
            ⭐ Top Rated
          </h1>

          {/* Filter */}
          <div className="border-t border-gray-700 pt-4">

            <p className="text-yellow-400 font-semibold mb-2 px-2">
              Filter Type
            </p>

            <div className="flex gap-3 flex-wrap">

              <button
                onClick={() => {
                  setMediaType("all");
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  mediaType === "all"
                    ? "bg-yellow-400 text-black"
                    : "bg-primary text-white border border-gray-700 hover:border-yellow-400 hover:text-yellow-400"
                }`}
              >
                🎭 All
              </button>

              <button
                onClick={() => {
                  setMediaType("movie");
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  mediaType === "movie"
                    ? "bg-yellow-400 text-black"
                    : "bg-primary text-white border border-gray-700 hover:border-yellow-400 hover:text-yellow-400"
                }`}
              >
                🎬 Movies
              </button>

              <button
                onClick={() => {
                  setMediaType("tv");
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  mediaType === "tv"
                    ? "bg-yellow-400 text-black"
                    : "bg-primary text-white border border-gray-700 hover:border-yellow-400 hover:text-yellow-400"
                }`}
              >
                📺 TV Shows
              </button>

            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && <Loading />}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-lg font-semibold my-8">
            {error}
          </p>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && (

          <div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">

              {items.map((item, index) => (

                <div
                  key={item.id}
                  onClick={() =>
                    handleItemClick(item.id, item.media_type)
                  }
                  className="cursor-pointer transform transition-all hover:scale-105 group rounded-xl overflow-hidden"
                >

                  <div className="relative">

                    <div className="relative h-64 md:h-72 overflow-hidden rounded-xl">
                      <img
                        src={
                          item.poster_path
                            ? `${IMG_URL}${item.poster_path}`
                            : "/no-image.png"
                        }
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:brightness-75 transition-all shadow-lg"
                      />

                      {/* Rank Badge */}
                      <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full shadow-lg">
                        #{index + 1 + (page - 1) * LIMIT}
                      </div>

                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <p className="text-white font-semibold text-lg">
                          View Details
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-white font-semibold text-sm line-clamp-2">
                    {item.title || item.name}
                  </p>

                  <p className="text-yellow-400 font-bold mt-1">
                    ⭐ {item.vote_average?.toFixed(1)} / 10
                  </p>

                  <p className="text-gray-400 text-xs">
                    🗳️ {item.vote_count?.toLocaleString()} votes
                  </p>

                  <p className="text-gray-400 text-xs">
                    📅{" "}
                    {item.release_date?.split("-")[0] ||
                      item.first_air_date?.split("-")[0] ||
                      "N/A"}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-12">

              <button
                onClick={() =>
                  setPage((p) => Math.max(p - 1, 1))
                }
                disabled={page === 1}
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <span className="text-white font-semibold text-lg">
                Page{" "}
                <span className="text-yellow-400">
                  {page}
                </span>
              </span>

              <button
                onClick={() =>
                  setPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRated;