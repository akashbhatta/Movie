import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const Popularity = ({ onSelectShow }) => {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (query.trim()) {
      searchShows();
    } else {
      fetchShows();
    }
  }, [page, sortBy, selectedGenre]);

  const fetchShows = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/discover/tv`, {
        params: {
          api_key: API_KEY,
          sort_by: sortBy,
          with_genres: selectedGenre || undefined,
          page,
        },
      });
      setShows(res.data.results);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error("Error fetching TV shows:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowClick = (id) => {
    navigate(`/media/tv/${id}`);
  };

  const handleSearch = () => {
    setPage(1);
    searchShows();
  };

  const handleGenreChange = (id) => {
    setSelectedGenre(id === selectedGenre ? null : id);
    setPage(1);
    setQuery("");
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setPage(1);
  };

  const getSortLabel = () => {
    const sortMap = {
      "popularity.desc": "Most Popular",
      "popularity.asc": "Least Popular",
      "vote_average.desc": "Top Rated",
      "first_air_date.desc": "Newest",
      "first_air_date.asc": "Oldest",
    };
    return sortMap[sortBy] || "Sort";
  };

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <h1 className="text-5xl font-bold text-white">📺 Popular TV Shows</h1>

          {/* Filter Buttons Right Corner */}
          <div className="flex flex-wrap gap-2">
            {/* Sort Dropdown */}
            <div className="border-t border-gray-700 pt-4 relative group">
  {/* Sort Dropdown */}
{/* Sort Dropdown */}
<div className="border-t border-gray-700 pt-4">
  
  {/* Title */}
  <p className="text-yellow-400 font-semibold mb-2 px-2">
    Sort By
  </p>

  {/* Dropdown Container */}
  <div className="group relative w-55 ">

    {/* Main Button */}
    <button
      className="
        w-full
        flex items-center justify-between
        px-4 py-3
        rounded-xl
        bg-primary
        border border-gray-700
        text-white
        shadow-lg
        hover:border-yellow-400
        hover:text-yellow-400
        transition-all duration-300
        cursor-pointer
      "
    >
      <span className="font-medium">
        {getSortLabel()}
      </span>

      {/* Arrow */}
      <span
        className="
          text-sm
          transition-transform duration-300
          group-hover:rotate-180
        "
      >
        ▾
      </span>
    </button>

    {/* Dropdown Menu */}
    <div
      className="
       cursor-pointer
      bg-gray-900 
        absolute right-0 mt-2 w-full
        rounded-xl
        overflow-hidden
        bg-primary
        border border-gray-700
        shadow-2xl
        opacity-0 invisible
        translate-y-2
        group-hover:opacity-100
        group-hover:visible
        group-hover:translate-y-0
        transition-all duration-300
        z-50
      "
    >

      {/* Most Popular */}
      <button
        onClick={() => handleSortChange("popularity.desc")}
        className={`
          w-full text-left px-4 py-3
          transition-all duration-200
           cursor-pointer
          ${
            sortBy === "popularity.desc"
              ? "bg-yellow-400 text-black font-semibold"
              : "text-white hover:bg-gray-800 hover:text-yellow-400"
          }
        `}
      >
        Most Popular
      </button>

      {/* Least Popular */}
      <button
        onClick={() => handleSortChange("popularity.asc")}
        className={`
          w-full text-left px-4 py-3
          transition-all duration-200
           cursor-pointer
          ${
            sortBy === "popularity.asc"
              ? "bg-yellow-400 text-black font-semibold"
              : "text-white hover:bg-gray-800 hover:text-yellow-400"
          }
        `}
      >
        Least Popular
      </button>

      {/* Top Rated */}
      <button
        onClick={() => handleSortChange("vote_average.desc")}
        className={`
          w-full text-left px-4 py-3
          transition-all duration-200
           cursor-pointer
          ${
            sortBy === "vote_average.desc"
              ? "bg-yellow-400 text-black font-semibold"
              : "text-white hover:bg-gray-800 hover:text-yellow-400"
          }
        `}
      >
        Top Rated
      </button>

      {/* Newest */}
      <button
        onClick={() => handleSortChange("first_air_date.desc")}
        className={`
          w-full text-left px-4 py-3
          transition-all duration-200
           cursor-pointer
          ${
            sortBy === "first_air_date.desc"
              ? "bg-yellow-400 text-black font-semibold"
              : "text-white hover:bg-gray-800 hover:text-yellow-400"
          }
        `}
      >
        Newest
      </button>

      {/* Oldest */}
      <button
        onClick={() => handleSortChange("first_air_date.asc")}
        className={`
          w-full text-left px-4 py-3
          transition-all duration-200
           cursor-pointer
          ${
            sortBy === "first_air_date.asc"
              ? "bg-yellow-400 text-black font-semibold"
              : "text-white hover:bg-gray-800 hover:text-yellow-400"
          }
        `}
      >
        Oldest
      </button>

    </div>
  </div>
</div></div>
            {/* Clear Filters Button */}
            {/* {(selectedGenre || query) && (
              <button
                onClick={() => {
                  setSelectedGenre(null);
                  setQuery("");
                  setPage(1);
                  setSortBy("popularity.desc");
                }}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
              >
                Clear Filters
              </button>
            )} */}
          </div>
        </div>

        {/* Search Bar */}
        {/* <form className="mb-8 flex gap-3" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search TV shows..."
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-white border border-accent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPage(1);
                fetchShows();
              }}
              className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg border border-accent hover:bg-primary transition-colors"
            >
              Clear
            </button>
          )}
        </form> */}

        {/* Genre Filter */}
        {/* {genres.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-accent mb-3">Filter by Genre:</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreChange(genre.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedGenre === genre.id
                      ? "bg-accent text-black shadow-lg"
                      : "bg-primary text-white border border-accent hover:bg-accent hover:text-black"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* Loading State */}
        {loading && <Loading />}

        {/* Error State */}
        {error && <p className="text-center text-red-500 text-lg font-semibold my-8">{error}</p>}

        {/* Shows Grid */}
        {!loading && shows.length > 0 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
              {shows.map((show) => (
                <div
                  key={show.id}
                  onClick={() => handleShowClick(show.id)}
                  className="cursor-pointer transform transition-all hover:scale-105 group rounded-xl overflow-hidden"
                >
                  <div className="relative">
                    <div className="relative h-64 md:h-72 overflow-hidden rounded-xl">
                      <img
                        src={
                          show.poster_path
                            ? `${IMG_URL}${show.poster_path}`
                            : "/no-image.png"
                        }
                        alt={show.name}
                        className="w-full h-full object-cover group-hover:brightness-75 transition-all shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <p className="text-white font-bold text-lg">View Details</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-white font-semibold text-sm line-clamp-2">{show.name}</p>
                  <p className="text-accent font-bold mt-1">⭐ {show.vote_average?.toFixed(1)}</p>
                  <p className="text-gray-400 text-xs">📅 {show.first_air_date?.split("-")[0] || "N/A"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && shows.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No TV shows found. Try adjusting your filters or search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popularity;