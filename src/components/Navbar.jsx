import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/search/${search}`);
    setSearch("");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navbar Content */}
        <div className="flex items-center justify-between py-4">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold text-white hover:text-yellow-400 transition duration-200"
          >
            <span className="text-yellow-400">m</span><span>flix</span>
            <span className="text-yellow-400 text-3xl ml-1">✕</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">           
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition duration-200 ${
                  isActive
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition duration-200 ${
                  isActive
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/topRated"
              className={({ isActive }) =>
                `text-sm font-medium transition duration-200 ${
                  isActive
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              Top IMDB
            </NavLink>

            {/* Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-300 group-hover:text-white transition duration-200">
                Categories <span>▾</span>
              </button>

              <div className="absolute left-0 hidden group-hover:block bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2 min-w-40">
                
                <NavLink
                  to="/category/action"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm transition duration-200 ${
                      isActive
                        ? "bg-yellow-400 text-black font-semibold"
                        : "text-gray-300 hover:bg-yellow-400 hover:text-black"
                    }`
                  }
                >
                  Action
                </NavLink>

                <NavLink
                  to="/category/drama"
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm transition duration-200 ${
                      isActive
                        ? "bg-yellow-400 text-black font-semibold"
                        : "text-gray-300 hover:bg-yellow-400 hover:text-black"
                    }`
                  }
                >
                  Drama
                </NavLink>
              </div>
            </div>
          </div>

          {/* Desktop Search */}
          <form
            className="hidden md:flex items-center gap-3"
            onSubmit={handleSearch}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Enter keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-full bg-gray-900 text-white border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200 text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-white hover:text-yellow-400 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4 space-y-4">            
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              Movies
            </NavLink>

            <NavLink
              to="/topRated"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              TV Shows
            </NavLink>

            <NavLink
              to="/topRated"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              Top IMDB
            </NavLink>

            {/* Mobile Categories */}
            <div className="border-t border-gray-800 pt-4">
              <p className="text-yellow-400 font-semibold mb-2 px-4 text-sm">
                Categories
              </p>

              <NavLink
                to="/category/action"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow-400 transition"
              >
                Action
              </NavLink>

              <NavLink
                to="/category/drama"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow-400 transition"
              >
                Drama
              </NavLink>
            </div>

            {/* Mobile Search */}
            <form
              className="flex gap-2 px-4 pt-4 border-t border-gray-800"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Enter keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-sm"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition text-sm"
              >
                🔍
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;