import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const ACTION_GENRE_ID = 28;
const ACTION_TV_GENRE_ID = 10759;
const LIMIT = 10;

const Action = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediaType, setMediaType] = useState("movie");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchAction();
  }, [mediaType, page]);

  const fetchAction = async () => {
    setLoading(true);
    setError("");
    setSelectedItem(null);

    try {
      const genreId =
        mediaType === "movie"
          ? ACTION_GENRE_ID
          : ACTION_TV_GENRE_ID;

      const res = await axios.get(
        `${BASE_URL}/discover/${mediaType}`,
        {
          params: {
            api_key: API_KEY,
            with_genres: genreId,
            page,
          },
        }
      );

      setItems(res.data.results.slice(0, LIMIT));
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (id) => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/${mediaType}/${id}`,
        {
          params: {
            api_key: API_KEY,
            append_to_response:
              "credits,videos,similar",
          },
        }
      );

      setSelectedItem({
        ...res.data,
        media_type: mediaType,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const trailer = selectedItem?.videos?.results?.find(
    (v) =>
      v.type === "Trailer" &&
      v.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

          <h1 className="text-5xl font-bold text-white">
            💥 Action
          </h1>

          <div>
            <p className="text-yellow-400 font-semibold mb-2">
              Media Type
            </p>

            <div className="flex gap-3 flex-wrap">

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

        {loading && <Loading />}

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
                  onClick={() => fetchDetails(item.id)}
                  className="cursor-pointer transform transition-transform hover:scale-105"
                >

                  <div className="relative group">

                    <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full shadow-lg">
                      #{index + 1}
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

                  </div>

                  <p className="mt-3 text-white font-semibold text-sm line-clamp-2">
                    {item.title || item.name}
                  </p>

                  <p className="text-yellow-400 font-bold mt-1">
                    ⭐ {item.vote_average?.toFixed(1)}
                  </p>

                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-12">

              <button
                onClick={() =>
                  setPage((p) => Math.max(p - 1, 1))
                }
                disabled={page === 1}
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg"
              >
                ← Previous
              </button>

              <span className="text-white font-semibold text-lg">
                Page {page}
              </span>

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={page === totalPages}
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg"
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

export default Action;