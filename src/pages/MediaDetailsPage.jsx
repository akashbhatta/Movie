import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const LOGO_URL = "https://image.tmdb.org/t/p/w185";
const BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

const formatMoney = (value) => {
  if (!value) return "N/A";

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const getYear = (media, isMovie) =>
  (isMovie ? media.release_date : media.first_air_date)?.split("-")[0] || "N/A";

function MediaDetailsPage() {
  const { type, id } = useParams();
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
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Loading />
      </div>
    );
  }
  if (error || !media) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-500 text-2xl font-semibold">
          {error || "Media not found"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
        >
          Back
        </button>
      </div>
    );
  }

  const isMovie = type === "movie";
  const title = media.title || media.name;
  const releaseDate = isMovie ? media.release_date : media.first_air_date;
  const trailer = media?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const backdropImage = media.backdrop_path
    ? `${BACKDROP_URL}${media.backdrop_path}`
    : media.poster_path
      ? `${IMG_URL}${media.poster_path}`
      : "";
  const posterImage = media.poster_path ? `${IMG_URL}${media.poster_path}` : "/no-image.png";
  const similarWithPosters =
    media.similar?.results?.filter((item) => item.poster_path).slice(0, 14) || [];
  const heroPosters = [
    ...(media.poster_path ? [{ id: `current-${media.id}`, poster_path: media.poster_path, title }] : []),
    ...similarWithPosters,
  ];
  const heroPosterLoop = heroPosters.length
    ? [...heroPosters, ...heroPosters]
    : [];
  const score = media.vote_average ? media.vote_average.toFixed(1) : "N/A";

  const facts = [
    {
      label: isMovie ? "Release Date" : "First Air Date",
      value: formatDate(releaseDate),
    },
    {
      label: isMovie ? "Runtime" : "Seasons",
      value: isMovie
        ? media.runtime
          ? `${media.runtime} min`
          : "N/A"
        : media.number_of_seasons || "N/A",
    },
    ...(isMovie
      ? []
      : [
          {
            label: "Episodes",
            value: media.number_of_episodes || "N/A",
          },
        ]),
    {
      label: "Status",
      value: media.status || "N/A",
    },
    {
      label: "Language",
      value: media.original_language?.toUpperCase() || "N/A",
    },
    ...(isMovie
      ? [
          {
            label: "Budget",
            value: formatMoney(media.budget),
          },
          {
            label: "Revenue",
            value: formatMoney(media.revenue),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-secondary text-white">
      <section className="relative min-h-[760px] overflow-hidden border-b border-gray-700 bg-black">
        {backdropImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: `url('${backdropImage}')` }}
          />
        )}

        {heroPosterLoop.length > 0 && (
          <div className="absolute inset-y-0 right-0 hidden w-[58%] overflow-hidden opacity-75 lg:block">
            <div className="movie-poster-stream movie-poster-stream-slow absolute right-0 top-[-8%] flex gap-5 rotate-[-8deg]">
              {heroPosterLoop.map((item, index) => (
                <img
                  key={`${item.id}-${index}`}
                  src={`${IMG_URL}${item.poster_path}`}
                  alt={item.title || item.name || title}
                  className="h-64 w-44 shrink-0 rounded-lg object-cover shadow-2xl"
                />
              ))}
            </div>
            <div className="movie-poster-stream movie-poster-stream-fast absolute right-[-8%] top-[34%] flex gap-5 rotate-[-8deg]">
              {[...heroPosterLoop].reverse().map((item, index) => (
                <img
                  key={`reverse-${item.id}-${index}`}
                  src={`${IMG_URL}${item.poster_path}`}
                  alt={item.title || item.name || title}
                  className="h-72 w-48 shrink-0 rounded-lg object-cover shadow-2xl"
                />
              ))}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-6 z-20 rounded-lg border border-white/15 bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-accent hover:text-accent sm:left-6 hover:bg-yellow-300 cursor-pointer"
        >
          Back
        </button>

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-end px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:items-end">
            <div className="mx-auto w-56 overflow-hidden rounded-xl border border-white/10 bg-primary shadow-2xl lg:mx-0 lg:w-full">
              <img src={posterImage} alt={title} className="aspect-[2/3] w-full object-cover" />
              <div className="flex items-center justify-between border-t border-white/10 bg-black px-4 py-3">
                <span className="text-sm font-semibold text-gray-300">TMDB Rating</span>
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-black">
                  {score}
                </span>
              </div>
            </div>

            <div className="max-w-4xl">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-300">
                <span className="rounded-full bg-accent px-3 py-1 text-black">
                  {isMovie ? "Movie" : "TV Show"}
                </span>
                <span>{getYear(media, isMovie)}</span>
                {isMovie && media.runtime ? <span>{media.runtime} min</span> : null}
                {!isMovie && media.number_of_seasons ? (
                  <span>{media.number_of_seasons} seasons</span>
                ) : null}
              </div>
              <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              {media.tagline && (
                <p className="mt-3 max-w-3xl text-lg font-medium italic text-accent">
                  {media.tagline}
                </p>
              )}

              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg">
                {media.overview || "No overview is available for this title."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-accent px-5 py-3 font-bold text-black transition hover:bg-yellow-500"
                  >
                    Watch Trailer
                  </a>
                )}
                <a
                  href={`https://www.themoviedb.org/${isMovie ? "movie" : "tv"}/${media.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:border-accent hover:text-accent"
                >
                  View on TMDB
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <div className="rounded-xl border border-gray-700 bg-primary/70 p-5 shadow-xl sm:p-6">
              <h2 className="mb-5 text-2xl font-bold">Details</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {facts.map((fact) => (
                  <div key={fact.label} className="rounded-lg bg-secondary p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-lg font-bold text-white">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {trailer && (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Official Trailer</h2>
                </div>
                <div className="relative w-full overflow-hidden rounded-xl border border-gray-700 bg-black shadow-2xl" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute left-0 top-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {media.credits?.cast?.length > 0 && (
              <div>
                <h2 className="mb-5 text-2xl font-bold">Top Cast</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {media.credits.cast.slice(0, 12).map((actor) => (
                    <div
                      key={`${actor.id}-${actor.cast_id || actor.credit_id}`}
                      className="overflow-hidden rounded-xl border border-gray-700 bg-primary transition hover:-translate-y-1 hover:border-accent"
                    >
                      <div className="aspect-[4/5] bg-secondary">
                        {actor.profile_path ? (
                          <img
                            src={`${IMG_URL}${actor.profile_path}`}
                            alt={actor.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-400">
                            No photo
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="line-clamp-1 font-bold text-white">{actor.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                          {actor.character || "Cast"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {media.genres?.length > 0 && (
              <div className="rounded-xl border border-gray-700 bg-primary/70 p-5">
                <h2 className="mb-4 text-xl font-bold">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-white"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {media.production_companies?.length > 0 && (
              <div className="rounded-xl border border-gray-700 bg-primary/70 p-5">
                <h2 className="mb-4 text-xl font-bold">Production</h2>
                <div className="space-y-3">
                  {media.production_companies.slice(0, 5).map((company) => (
                    <div
                      key={company.id}
                      className="flex min-h-14 items-center gap-3 rounded-lg bg-secondary p-3"
                    >
                      {company.logo_path ? (
                        <div className="flex h-10 w-16 items-center justify-center rounded bg-white p-2">
                          <img
                            src={`${LOGO_URL}${company.logo_path}`}
                            alt={company.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : null}
                      <p className="text-sm font-semibold text-gray-200">{company.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>
        {media.similar?.results?.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 text-2xl font-bold">
              {isMovie ? "Similar Movies" : "Similar Shows"}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {media.similar.results.slice(0, 12).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const mediaType = item.media_type || type;
                    navigate(`/media/${mediaType}/${item.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="group cursor-pointer text-left"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-gray-700 bg-primary shadow-lg transition group-hover:-translate-y-1 group-hover:border-accent">
                    <img
                      src={item.poster_path ? `${IMG_URL}${item.poster_path}` : "/no-image.png"}
                      alt={item.title || item.name}
                      className="h-full w-full object-cover transition group-hover:scale-105 group-hover:brightness-75"
                    />
                    <div className="absolute right-2 top-2 rounded-full bg-black/75 px-2 py-1 text-xs font-bold text-accent">
                      {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-bold text-white">
                    {item.title || item.name}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default MediaDetailsPage;
