import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const LIMIT = 10;

const Trending = ({ onSelectItem }) => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediaType, setMediaType] = useState("all"); // all | movie | tv
  const [timeWindow, setTimeWindow] = useState("day"); // day | week

  useEffect(() => {
    fetchTrending();
  }, [mediaType, timeWindow]);

  const fetchTrending = async () => {
    setLoading(true);
    setError("");
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

  const handleItemClick = (id, type) => {
    navigate(`/media/${type}/${id}`);
  };

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

        {/* Trending Grid */}
        {!loading && trending.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trending.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id, item.media_type)}
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
                    <div className="absolute top-2 right-2 bg-accent text-black font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                      #{index + 1}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <p className="text-white font-bold text-lg">View Details</p>
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