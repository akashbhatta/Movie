import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const Popularity = ({ onSelectShow }) => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);

//   useEffect(() => {
//     fetchGenres();
//   }, []);

  useEffect(() => {
    if (query.trim()) {
      searchShows();
    } else {
      fetchShows();
    }
  }, [page, sortBy, selectedGenre]);

//   const fetchGenres = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/genre/tv/list`, {
//         params: { api_key: API_KEY },
//       });
//       setGenres(res.data.genres);
//     } catch (err) {
//       console.error("Error fetching TV genres:", err);
//     }
//   };

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

//   const searchShows = async () => {
//     if (!query.trim()) return;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(`${BASE_URL}/search/tv`, {
//         params: { api_key: API_KEY, query, page },
//       });
//       if (res.data.results.length === 0) {
//         setError("No TV shows found.");
//         return;
//       }
//       setShows(res.data.results);
//       setTotalPages(res.data.total_pages);
//     } catch (err) {
//       console.error("Search error:", err);
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

  const fetchShowDetails = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/tv/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "credits,videos,similar",
        },
      });
      setSelectedShow(res.data);
      const el = document.getElementById("show-detail");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error fetching show details:", err);
    } finally {
      setLoading(false);
    }
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

  const trailer = selectedShow?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

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

        {/* Show Detail Modal */}
        {selectedShow && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-primary rounded-lg shadow-2xl w-full max-w-4xl my-8">
              <button
                onClick={() => setSelectedShow(null)}
                className="absolute top-4 right-4 text-white text-2xl hover:text-accent transition-colors bg-secondary px-3 py-1 rounded z-10"
              >
                ✕
              </button>

              <div id="show-detail" className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {/* Poster */}
                  <div className="md:col-span-1">
                    <img
                      src={
                        selectedShow.poster_path
                          ? `${IMG_URL}${selectedShow.poster_path}`
                          : "/no-image.png"
                      }
                      alt={selectedShow.name}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold text-white mb-4">{selectedShow.name}</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">{selectedShow.overview}</p>

                    <div className="space-y-3 text-sm md:text-base">
                      <p className="text-gray-300">
                        <strong className="text-accent">First Air Date:</strong> {selectedShow.first_air_date || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Last Air Date:</strong> {selectedShow.last_air_date || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Status:</strong> {selectedShow.status || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Seasons:</strong> {selectedShow.number_of_seasons || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Episodes:</strong> {selectedShow.number_of_episodes || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Rating:</strong> ⭐ {selectedShow.vote_average?.toFixed(1)} / 10
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Genres:</strong> {selectedShow.genres?.map((g) => g.name).join(", ") || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Networks:</strong> {selectedShow.networks?.map((n) => n.name).join(", ") || "N/A"}
                      </p>
                      <p className="text-gray-300">
                        <strong className="text-accent">Language:</strong> {selectedShow.original_language?.toUpperCase() || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cast */}
                {selectedShow.credits?.cast?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-accent mb-4">Top Cast:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedShow.credits.cast.slice(0, 6).map((actor) => (
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
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-accent mb-4">Trailer:</h3>
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title="TV Show Trailer"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Similar Shows */}
                {selectedShow.similar?.results?.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-accent mb-4">Similar Shows:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {selectedShow.similar.results.slice(0, 10).map((show) => (
                        <div
                          key={show.id}
                          onClick={() => fetchShowDetails(show.id)}
                          className="cursor-pointer transform transition-transform hover:scale-105"
                        >
                          <img
                            src={
                              show.poster_path
                                ? `${IMG_URL}${show.poster_path}`
                                : "/no-image.png"
                            }
                            alt={show.name}
                            className="w-full rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
                          />
                          <p className="mt-2 text-white font-semibold text-sm line-clamp-2">{show.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Shows Grid */}
        {!loading && shows.length > 0 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
              {shows.map((show) => (
                <div
                  key={show.id}
                  onClick={() => fetchShowDetails(show.id)}
                  className="cursor-pointer transform transition-transform hover:scale-105"
                >
                  <div className="relative group">
                    <img
                      src={
                        show.poster_path
                          ? `${IMG_URL}${show.poster_path}`
                          : "/no-image.png"
                      }
                      alt={show.name}
                      className="w-full rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-center">
                        <p className="text-white text-sm">View Details</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-white font-semibold text-sm line-clamp-2">{show.name}</p>
                  <p className="text-accent font-bold mt-1">⭐ {show.vote_average?.toFixed(1)}</p>
                  <p className="text-gray-400 text-xs">📅 {show.first_air_date?.split("-")[0] || "N/A"}</p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {/* {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-6 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <span className="text-white font-semibold text-lg">
                  Page <span className="text-accent">{page}</span> of <span className="text-accent">{totalPages}</span>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-6 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )} */}
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