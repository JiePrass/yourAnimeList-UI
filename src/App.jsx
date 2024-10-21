import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import api from './api/axios';
import Header from './components/Header';
import Home from './pages/Home';
import AddAnime from './pages/AddAnime';
import AnimeDetails from './pages/AnimeDetails';

export default function App() {
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await api.get('animes');
        console.log(response);
        setAnimes(response.data);
      } catch (error) {
        console.error('Error fetching animes:', error);
      }
    };

    fetchAnimes();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home animes={animes} />} />
        <Route path="/add-anime" element={<AddAnime />} />
        <Route path="/anime/:id" element={<AnimeDetails animes={animes} setAnimes={setAnimes} />} />
      </Routes>
    </Router>
  );
}
