import React from 'react'

function Footer() {
  return (
    <footer className="bg-primary border-t-2 border-accent  bg-gray-900 border-b border-yellow-500 shadow-lg ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-accent mb-2">🎬 MovieFinder</h3>
            <p className="text-gray-400">Your ultimate movie discovery platform</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-accent font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-accent transition-colors">About</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-accent font-semibold mb-3">Data Source</h4>
            <p className="text-gray-400 text-sm">Powered by TMDB API</p>
          </div>
        </div>

        <hr className="border-gray-700 mb-6" />

        <div className="text-center space-y-2 text-gray-400 text-sm">
          <p>&copy; 2026 MovieFinder. All rights reserved.</p>
          <p>Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">The Movie Database (TMDB)</a></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
