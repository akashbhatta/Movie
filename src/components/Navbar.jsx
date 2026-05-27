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
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-yellow-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navbar Content */}
        <div className="flex items-center justify-between py-4">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition"
          >
            🎬 <span>MovieFinder</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">           
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg font-medium transition ${
                  isActive
                    ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                    : "text-white hover:text-yellow-400"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-lg font-medium transition ${
                  isActive
                    ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                    : "text-white hover:text-yellow-400"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/topRated"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-2 text-lg ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "text-white hover:text-yellow-400"
                }`
              }
            >
              Top Rated
            </NavLink>
            {/* Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-lg font-medium text-white group-hover:text-yellow-400 transition">
                Categories <span>▾</span>
              </button>

              <div className="absolute left-0 hidden group-hover:block bg-gray-800 border border-yellow-500 rounded-lg shadow-xl py-2 min-w-45">
                
                <NavLink
                  to="/category/action"
                  className={({ isActive }) =>
                    `block px-4 py-2 transition ${
                      isActive
                        ? "bg-yellow-400 text-black font-semibold"
                        : "text-white hover:bg-yellow-400 hover:text-black"
                    }`
                  }
                >
                  Action
                </NavLink>

                <NavLink
                  to="/category/drama"
                  className={({ isActive }) =>
                    `block px-4 py-2 transition ${
                      isActive
                        ? "bg-yellow-400 text-black font-semibold"
                        : "text-white hover:bg-yellow-400 hover:text-black"
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
            className="hidden md:flex items-center gap-2"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition active:scale-95"
            >
              Search
            </button>
          </form>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-3xl text-white hover:text-yellow-400 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
          {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4 space-y-4">            
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-2 text-lg ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "text-white hover:text-yellow-400"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-2 text-lg ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "text-white hover:text-yellow-400"
                }`
              }
            >
              About
            </NavLink>
            {/* Mobile Categories */}
            <div className="border-t border-gray-700 pt-4">
              <p className="text-yellow-400 font-semibold mb-2 px-2">
                Categories
              </p>

              <NavLink
                to="/category/action"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-white hover:text-yellow-400"
              >
                Action
              </NavLink>

              <NavLink
                to="/category/drama"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-white hover:text-yellow-400"
              >
                Drama
              </NavLink>
            </div>
             
            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-2 text-lg ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "text-white hover:text-yellow-400"
                }`
              }
            >
              Top Rated
            </NavLink>
            {/* Mobile Search */}
            <form
              className="flex gap-2 px-2 pt-4 border-t border-gray-700"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;