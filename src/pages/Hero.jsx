import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

const Hero = () => {
  const [featuredList, setFeaturedList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeatured();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (featuredList.length || 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredList.length]);

  const fetchFeatured = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/trending/all/week`, {
        params: { api_key: API_KEY },
      });

      const results = res.data.results.filter((item) => item.backdrop_path);
      setFeaturedList(results.slice(0, 6));
    } catch (err) {
      console.error("Error fetching featured:", err);
    }
  };

  const fetchTrailer = async (featured) => {
    try {
      const type = featured.media_type === "movie" ? "movie" : "tv";
      const videoRes = await axios.get(`${BASE_URL}/${type}/${featured.id}/videos`, {
        params: { api_key: API_KEY },
      });

      const trailer = videoRes.data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
        setShowTrailer(true);
      }
    } catch (err) {
      console.error("Error fetching trailer:", err);
    }
  };

  if (!featuredList.length) return null;

  const featured = featuredList[currentIndex];
  const isMovie = featured.media_type === "movie";
  const title = featured.title || featured.name;
  const rating = featured.vote_average?.toFixed(1) || "N/A";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Backdrop */}
      {!showTrailer && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${BACKDROP_URL}${featured.backdrop_path})`,
          }}
        />
      )}

      {/* YouTube Trailer */}
      {showTrailer && trailerKey && (
        <div className="absolute inset-0">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1&modestbranding=1`}
            title="Trailer"
            allow="autoplay; fullscreen"
            frameBorder="0"
          />
        </div>
      )}

      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-20 w-full">
        <div className="max-w-2xl">
          {/* Quality Badge and Info */}
          <div className="flex items-center gap-4 mb-4">
            {isMovie && (
              <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded">
                HD
              </span>
            )}
            {featured.runtime && (
              <span className="text-gray-300 text-sm">
                Duration: {featured.runtime} min
              </span>
            )}
            <span className="text-yellow-400 text-sm font-semibold">
              IMDB: {rating}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            {title}
          </h1>

          {/* Overview */}
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 max-w-xl">
            {featured.overview}
          </p>

          {/* Watch Now Button */}
          <button
            onClick={() => {
              navigate(`/media/${featured.media_type}/${featured.id}`);
            }}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-lg transition transform hover:scale-105 inline-flex items-center gap-2"
          >
            ▶ Watch Now
          </button>
        </div>
      </div>

      {/* Close Trailer Button */}
      {showTrailer && (
        <button
          onClick={() => setShowTrailer(false)}
          className="absolute top-20 right-8 z-20 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition"
        >
          ✕ Close
        </button>
      )}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {featuredList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setShowTrailer(false);
            }}
            className={`h-3 rounded-full transition-all ${
              idx === currentIndex
                ? "bg-yellow-400 w-8"
                : "bg-white/40 hover:bg-white/60 w-3"
            }`}
          />
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={() => {
          setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
          setShowTrailer(false);
        }}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white font-bold px-4 py-3 rounded-lg transition"
      >
        ‹
      </button>

      {/* Next Button */}
      <button
        onClick={() => {
          setCurrentIndex((prev) => (prev + 1) % featuredList.length);
          setShowTrailer(false);
        }}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white font-bold px-4 py-3 rounded-lg transition"
      >
        ›
      </button>
    </div>
  );
};

export default Hero;