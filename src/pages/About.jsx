import React from 'react'

function About() {
  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-lg shadow-2xl p-8 md:p-12">
          <h1 className="text-5xl font-bold text-accent mb-8 text-center">About MovieFinder</h1>
          
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p className="text-center">
              Welcome to <span className="text-accent font-bold">MovieFinder</span>, your ultimate movie discovery platform!
            </p>
            
            <p>
              Whether you're a cinephile looking for hidden gems or someone just trying to find the perfect movie for your next movie night, MovieFinder has got you covered. Our platform makes it easy to search for your favorite movies and get detailed information about ratings, cast, trailers, and more.
            </p>

            <div className="bg-secondary rounded-lg p-6 my-6">
              <h2 className="text-2xl font-bold text-accent mb-4">What We Offer</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-2xl">🎬</span>
                  <span>Comprehensive movie database with ratings and reviews</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-2xl">⭐</span>
                  <span>Detailed cast information and actor profiles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-2xl">🎥</span>
                  <span>Official trailers from YouTube</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-2xl">📊</span>
                  <span>Budget, revenue, and box office information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-2xl">🔍</span>
                  <span>Advanced search and discovery features</span>
                </li>
              </ul>
            </div>

            <p>
              All our data is powered by <span className="text-accent font-bold">The Movie Database (TMDB)</span>, ensuring you have access to the most up-to-date and accurate movie information available.
            </p>

            <p className="text-center text-accent font-semibold">
              Start exploring thousands of movies today and find your next favorite!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
