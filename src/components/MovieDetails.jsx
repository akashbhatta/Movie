import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loading from './Loading';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

function MovieDetails({movieId, onClose}) {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if (!movieId) return;

        const fetchDetails = async() =>{
            setLoading(true);

            try {
                const res = await axios.get(`${BASE_URL}/movie/${movieId}`, {
                    params: {api_key:API_KEY, append_to_response:"credits,videos"},
                });
                setMovie(res.data);
            } catch (err) {
                console.error("Error fetching details", err);
            }finally{
                setLoading(false);
            }
        }
        fetchDetails();
    },[movieId]);

    if(loading) return <Loading/>
    if (!movie) return null;

    const trailer = movie.videos?.results?.find(
        (v)=> v.type === "Trailer" && v.site === "YouTube"
    );
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-primary rounded-lg shadow-2xl w-full max-w-4xl my-8">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-accent transition-colors bg-secondary px-3 py-1 rounded"
        >
          ✕
        </button>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Poster */}
            <div className="md:col-span-1">
              <img 
                src={movie.poster_path ? `${IMG_URL}${movie.poster_path}`: "/no-image.png"} 
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-4">{movie.title}</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">{movie.overview}</p>

              <div className="space-y-3 text-sm md:text-base">
                <p className="text-gray-300">
                  <strong className="text-accent">Release Date:</strong> {movie.release_date || "N/A"}
                </p>
                <p className="text-gray-300">
                  <strong className="text-accent">Runtime:</strong> {movie.runtime ? `${movie.runtime} min` : "N/A"}
                </p>
                <p className="text-gray-300">
                  <strong className="text-accent">Rating:</strong> {movie.vote_average?.toFixed(1)} / 10
                </p>
                <p className="text-gray-300">
                  <strong className="text-accent">Genres:</strong> {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
                </p>
                <p className="text-gray-300">
                  <strong className="text-accent">Language:</strong> {movie.original_language?.toUpperCase() || "N/A"}
                </p>
                <p className="text-gray-300">
                  <strong className="text-accent">Budget:</strong> {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}
                </p>
                <p className="text-gray-300">
                  <strong className="text-accent">Revenue:</strong> {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Cast */}
          {movie.credits?.cast?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-accent mb-4">Top Cast:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {movie.credits.cast.slice(0, 6).map((actor) => (
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
                  title="Movie Trailer"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetails