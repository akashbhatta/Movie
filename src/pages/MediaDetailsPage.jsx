import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";

function MediaDetailsPage() {
  const { type, id } = useParams(); // type: 'movie' or 'tv'
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !type) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`${BASE_URL}/${type}/${id}`, {
          params: {
            api_key: API_KEY,
            append_to_response: "credits,videos,similar",
          },
        });
        setMedia(res.data);
      } catch (err) {
        console.error("Error fetching details", err);
        setError("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-2xl font-semibold">{error || "Media not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const trailer = media?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const backdropImage = media.backdrop_path
    ? `${BACKDROP_URL}${media.backdrop_path}`
    : `${IMG_URL}${media.poster_path}`;

  const isMovie = type === "movie";

  return (
    <div className="min-h-screen bg-gray-700">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-4 z-40 bg-accent hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold transition shadow-lg"
      >
        ← Back
      </button>

      {/* Backdrop */}
      <div
        className="relative w-full h-96 md:h-screen/2 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(15,23,42,1)), url('${backdropImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-secondary"></div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-32 md:-mt-48 max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Poster */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <div className="w-full md:w-64 shadow-2xl rounded-2xl overflow-hidden transform hover:scale-105 transition">
              <img
                src={
                  media.poster_path
                    ? `${IMG_URL}${media.poster_path}`
                    : "/no-image.png"
                }
                alt={media.title || media.name}
                className="w-full h-auto"
              />
              <div className="bg-accent p-4 text-center">
                <p className="font-bold text-black text-lg">⭐ {media.vote_average?.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-3 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {media.title || media.name}
            </h1>
            {media.tagline && (
              <p className="text-accent text-lg italic mb-6">{media.tagline}</p>
            )}

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {media.overview}
            </p>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 bg-primary p-6 rounded-xl">
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase">
                  {isMovie ? "Release Date" : "First Air Date"}
                </p>
                <p className="text-white text-lg font-bold">
                  {isMovie ? media.release_date || "N/A" : media.first_air_date || "N/A"}
                </p>
              </div>

              {isMovie ? (
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase">Runtime</p>
                  <p className="text-white text-lg font-bold">
                    {media.runtime ? `${media.runtime} min` : "N/A"}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold uppercase">Seasons</p>
                    <p className="text-white text-lg font-bold">
                      {media.number_of_seasons || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold uppercase">Episodes</p>
                    <p className="text-white text-lg font-bold">
                      {media.number_of_episodes || "N/A"}
                    </p>
                  </div>
                </>
              )}

              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase">Status</p>
                <p className="text-white text-lg font-bold">
                  {media.status || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase">Language</p>
                <p className="text-white text-lg font-bold">
                  {media.original_language?.toUpperCase() || "N/A"}
                </p>
              </div>

              {isMovie && (
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase">Budget</p>
                  <p className="text-white text-lg font-bold">
                    {media.budget ? `$${(media.budget / 1000000).toFixed(1)}M` : "N/A"}
                  </p>
                </div>
              )}

              {isMovie && (
                <div>
                  <p className="text-gray-400 text-sm font-semibold uppercase">Revenue</p>
                  <p className="text-white text-lg font-bold">
                    {media.revenue ? `$${(media.revenue / 1000000).toFixed(1)}M` : "N/A"}
                  </p>
                </div>
              )}
            </div>

            {/* Genres */}
            {media.genres?.length > 0 && (
              <div className="mb-8">
                <p className="text-gray-400 text-sm font-semibold uppercase mb-3">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-accent text-black px-4 py-1 rounded-full font-semibold text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Production Companies */}
            {media.production_companies?.length > 0 && (
              <div className="mb-8">
                <p className="text-gray-400 text-sm font-semibold uppercase mb-3">Production Companies</p>
                <div className="flex flex-wrap gap-3">
                  {media.production_companies.slice(0, 3).map((company) => (
                    <div
                      key={company.id}
                      className="bg-primary px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                    >
                      {company.logo_path && (
                        <img
                          src={`${IMG_URL}${company.logo_path}`}
                          alt={company.name}
                          className="h-8 object-contain"
                        />
                      )}
                      {!company.logo_path && company.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {media.credits?.cast?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">👥 Top Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {media.credits.cast.slice(0, 12).map((actor) => (
                <div
                  key={actor.id}
                  className="bg-primary rounded-xl overflow-hidden hover:transform hover:scale-105 transition shadow-lg"
                >
                  {actor.profile_path && (
                    <img
                      src={`${IMG_URL}${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <p className="text-white font-semibold text-sm line-clamp-2">
                      {actor.name}
                    </p>
                    <p className="text-accent text-xs line-clamp-2">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailer Section */}
        {trailer && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">🎬 Official Trailer</h2>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
                title={`${media.title || media.name} Trailer`}
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Similar Media Section */}
        {media.similar?.results?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              {isMovie ? "🎞️ Similar Movies" : "📺 Similar Shows"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.similar.results.slice(0, 12).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const mediaType = item.media_type || type;
                    navigate(`/media/${mediaType}/${item.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="cursor-pointer transform transition-all hover:scale-105 rounded-xl overflow-hidden shadow-lg group"
                >
                  <div className="relative h-64 md:h-80 overflow-hidden rounded-xl">
                    <img
                      src={
                        item.poster_path
                          ? `${IMG_URL}${item.poster_path}`
                          : "/no-image.png"
                      }
                      alt={item.title || item.name}
                      className="w-full h-full object-cover group-hover:brightness-75 transition"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <p className="text-white font-bold">View</p>
                    </div>
                  </div>
                  <p className="mt-2 text-white font-semibold text-sm line-clamp-2">
                    {item.title || item.name}
                  </p>
                  <p className="text-accent font-bold text-sm">
                    ⭐ {item.vote_average?.toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaDetailsPage;
