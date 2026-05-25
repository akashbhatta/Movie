import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const LIMIT = 10;

const Trending = ({ onSelectItem }) => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediaType, setMediaType] = useState("all"); // all | movie | tv
  const [timeWindow, setTimeWindow] = useState("day"); // day | week
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchTrending();
  }, [mediaType, timeWindow]);

  const fetchTrending = async () => {
    setLoading(true);
    setError("");
    setSelectedItem(null);
    try {
      const res = await axios.get(
        `${BASE_URL}/trending/${mediaType}/${timeWindow}`,
        {
          params: { api_key: API_KEY },
        }
      );
      setTrending(res.data.results.slice(0, LIMIT));
    } catch (err) {
      console.error("Error fetching trending:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (id, type) => {
    setLoading(true);
    try {
      const endpoint = type === "movie" ? "movie" : "tv";
      const res = await axios.get(`${BASE_URL}/${endpoint}/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "credits,videos",
        },
      });
      setSelectedItem({ ...res.data, media_type: type });
      const el = document.getElementById("trending-detail");
      if (el) el.scrollIntoView({ behavior: "smooth" });
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
    <div className="min-h-screen bg-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-5xl font-bold text-white mb-8">🔥 Trending Now</h1>

        {/* Media Type Toggle */}
        {/* <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => { setMediaType("all"); setSelectedItem(null); }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mediaType === "all"
                ? "bg-accent text-black shadow-lg"
                : "bg-primary text-white border border-accent hover:bg-accent"
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setMediaType("movie"); setSelectedItem(null); }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mediaType === "movie"
                ? "bg-accent text-black shadow-lg"
                : "bg-primary text-white border border-accent hover:bg-accent"
            }`}
          >
            🎬 Movies
          </button>
          <button
            onClick={() => { setMediaType("tv"); setSelectedItem(null); }}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              mediaType === "tv"
                ? "bg-accent text-black shadow-lg"
                : "bg-primary text-white border border-accent hover:bg-accent"
            }`}
          >
            📺 TV Shows
          </button>
        </div> */}

        {/* Time Window Toggle */}
        {/* <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setTimeWindow("day")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              timeWindow === "day"
                ? "bg-accent text-black shadow-lg"
                : "bg-primary text-white border border-accent hover:bg-accent "
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeWindow("week")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              timeWindow === "week"
                ? "bg-accent text-black shadow-lg"
                : "bg-primary text-white border border-accent hover:bg-accent "
            }`}
          >
            This Week
          </button>
        </div> */}

        {/* Loading State */}
        {loading && <Loading />}

        {/* Error State */}
        {error && <p className="text-center text-red-500 text-lg font-semibold my-8">{error}</p>}

        {/* Detail View Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-primary rounded-lg shadow-2xl w-full max-w-4xl my-8">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white text-2xl hover:text-accent transition-colors bg-secondary px-3 py-1 rounded z-10"
              >
                ✕
              </button>

              <div id="trending-detail" className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {/* Poster */}
                  <div className="md:col-span-1">
                    <img
                      src={
                        selectedItem.poster_path
                          ? `${IMG_URL}${selectedItem.poster_path}`
                          : "/no-image.png"
                      }
                      alt={selectedItem.title || selectedItem.name}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold text-white mb-4">{selectedItem.title || selectedItem.name}</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">{selectedItem.overview}</p>

                    <div className="space-y-3 text-sm md:text-base">
                      <p className="text-gray-300">
                        <strong className="text-accent">Type:</strong>{" "}
                        {selectedItem.media_type === "movie" ? "🎬 Movie" : "📺 TV Show"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Rating:</strong> ⭐ {selectedItem.vote_average?.toFixed(1)} / 10
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">
                          {selectedItem.media_type === "movie" ? "Release Date" : "First Air Date"}:
                        </strong>{" "}
                        {selectedItem.release_date || selectedItem.first_air_date || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Genres:</strong>{" "}
                        {selectedItem.genres?.map((g) => g.name).join(", ") || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Language:</strong>{" "}
                        {selectedItem.original_language?.toUpperCase() || "N/A"}
                      </p>

                      {/* Movie specific */}
                      {selectedItem.media_type === "movie" && (
                        <p className="text-gray-300">
                          <strong className="text-accent">Runtime:</strong> {selectedItem.runtime ? `${selectedItem.runtime} min` : "N/A"}
                        </p>
                      )}

                      {/* TV specific */}
                      {selectedItem.media_type === "tv" && (
                        <>
                          <p className="text-gray-300">
                            <strong className="text-accent">Seasons:</strong> {selectedItem.number_of_seasons || "N/A"}
                          </p>
                          <p className="text-gray-300">
                            <strong className="text-accent">Episodes:</strong> {selectedItem.number_of_episodes || "N/A"}
                          </p>
                          <p className="text-gray-300">
                            <strong className="text-accent">Status:</strong> {selectedItem.status || "N/A"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cast */}
                {selectedItem.credits?.cast?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-accent mb-4">Top Cast:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedItem.credits.cast.slice(0, 6).map((actor) => (
                        <li key={actor.id} className="text-gray-300">
                          <span className="text-white font-semibold">{actor.name}</span> as{" "}
                          <em className="text-accent">{actor.character}</em>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Trailer */}
                {trailer && (
                  <div>
                    <h3 className="text-2xl font-bold text-accent mb-4">Trailer:</h3>
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
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

        {/* Trending Grid */}
        {!loading && trending.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trending.map((item, index) => (
              <div
                key={item.id}
                onClick={() => fetchDetails(item.id, item.media_type)}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                <div className="relative group">
                  <img
                    src={
                      item.poster_path
                        ? `${IMG_URL}${item.poster_path}`
                        : "/no-image.png"
                    }
                    alt={item.title || item.name}
                    className="w-full rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow"
                  />
                  
                  {/* Rank Badge */}
                  <div className="absolute top-2 right-2 bg-accent text-black font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                    #{index + 1}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center">
                      <p className="text-white text-sm">View Details</p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-white font-semibold text-sm line-clamp-2">{item.title || item.name}</p>

                <p className="text-gray-400 text-xs mt-1">
                  {item.media_type === "movie" ? "🎬 Movie" : "📺 TV Show"}
                </p>

                <p className="text-accent font-bold mt-1">⭐ {item.vote_average?.toFixed(1)}</p>

                <p className="text-gray-400 text-xs">
                  📅 {
                    item.release_date?.split("-")[0] ||
                    item.first_air_date?.split("-")[0] ||
                    "N/A"
                  }
                </p>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && trending.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No trending items found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;