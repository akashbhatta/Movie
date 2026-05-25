import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const LIMIT = 10;

const TopRated = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchTopRated();
  }, [mediaType, page]);

  const fetchTopRated = async () => {
    setLoading(true);
    setError("");
    setSelectedItem(null);

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

  const fetchDetails = async (id, type) => {
    setLoading(true);

    try {
      const res = await axios.get(`${BASE_URL}/${type}/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "credits,videos,similar",
        },
      });

      setSelectedItem({
        ...res.data,
        media_type: type,
      });

      const el = document.getElementById("toprated-detail");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("Error fetching details:", err);
    } finally {
      setLoading(false);
    }
  };

  const trailer = selectedItem?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

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

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 overflow-y-auto">

            <div className="bg-primary rounded-2xl shadow-2xl w-full max-w-5xl my-8 relative">

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white text-2xl hover:text-yellow-400 transition-colors bg-secondary px-3 py-1 rounded-lg z-10"
              >
                ✕
              </button>

              <div id="toprated-detail" className="p-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                  {/* Poster */}
                  <div>
                    <img
                      src={
                        selectedItem.poster_path
                          ? `${IMG_URL}${selectedItem.poster_path}`
                          : "/no-image.png"
                      }
                      alt={selectedItem.title || selectedItem.name}
                      className="w-full rounded-xl shadow-2xl"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2">

                    <h2 className="text-4xl font-bold text-white mb-4">
                      {selectedItem.title || selectedItem.name}
                    </h2>

                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      {selectedItem.overview}
                    </p>

                    <div className="space-y-3 text-gray-300">

                      <p>
                        <strong className="text-yellow-400">Type:</strong>{" "}
                        {selectedItem.media_type === "movie"
                          ? "🎬 Movie"
                          : "📺 TV Show"}
                      </p>

                      <p>
                        <strong className="text-yellow-400">Rating:</strong>{" "}
                        ⭐ {selectedItem.vote_average?.toFixed(1)} / 10
                      </p>

                      <p>
                        <strong className="text-yellow-400">Votes:</strong>{" "}
                        {selectedItem.vote_count?.toLocaleString()}
                      </p>

                      <p>
                        <strong className="text-yellow-400">
                          {selectedItem.media_type === "movie"
                            ? "Release Date"
                            : "First Air Date"}:
                        </strong>{" "}
                        {selectedItem.release_date ||
                          selectedItem.first_air_date ||
                          "N/A"}
                      </p>

                      <p>
                        <strong className="text-yellow-400">Genres:</strong>{" "}
                        {selectedItem.genres
                          ?.map((g) => g.name)
                          .join(", ") || "N/A"}
                      </p>

                      <p>
                        <strong className="text-yellow-400">Language:</strong>{" "}
                        {selectedItem.original_language?.toUpperCase()}
                      </p>

                    </div>
                  </div>
                </div>

                {/* Cast */}
                {selectedItem.credits?.cast?.length > 0 && (
                  <div className="mb-10">

                    <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                      Top Cast
                    </h3>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">

                      {selectedItem.credits.cast
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
                {trailer && (
                  <div className="mb-10">

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
                        title="Trailer"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && (

          <div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">

              {items.map((item, index) => (

                <div
                  key={item.id}
                  onClick={() =>
                    fetchDetails(item.id, item.media_type)
                  }
                  className="cursor-pointer transform transition-transform hover:scale-105"
                >

                  <div className="relative group">

                    {/* Rank Badge */}
                    <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full shadow-lg">
                      #{index + 1 + (page - 1) * LIMIT}
                    </div>

                    <img
                      src={
                        item.poster_path
                          ? `${IMG_URL}${item.poster_path}`
                          : "/no-image.png"
                      }
                      alt={item.title || item.name}
                      className="w-full rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <p className="text-white font-semibold">
                        View Details
                      </p>
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
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
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
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
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