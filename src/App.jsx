import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MovieApp from './components/MovieApp'
import MovieDetails from './components/MovieDetails'
import Navbar from './components/Navbar'
import SearchPage from './pages/SearchPage'
import Home from './pages/Home'
import About from './pages/About'
import Footer from './pages/Footer'
import MediaDetailsPage from './pages/MediaDetailsPage'
import TopRated from './components/TopRated'
import Action from './components/Action'
import Drama from './components/Drama'


function App() {
  return (
    <div className="bg-secondary text-white min-h-screen flex flex-col">  
      <Navbar/>
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/topRated" element={<TopRated />} />
          <Route path="/category/action" element={<Action />} />
          <Route path="/category/drama" element={<Drama/>} />
          <Route path="/media/:type/:id" element={<MediaDetailsPage />} />

        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App