import { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom'; // Import Link

export default function Home({ animes }) {
    const [visibleCount, setVisibleCount] = useState(4); // Default tampilkan 8 anime

    // Fungsi untuk menambah jumlah anime yang ditampilkan
    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 4); // Tambah 4 anime setiap kali tombol ditekan
    };

    return (
        <>
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-black mb-6">Daftar Anime</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Potong jumlah anime yang ditampilkan berdasarkan visibleCount */}
                    {animes.slice(0, visibleCount).map(anime => (
                        <Link to={`/anime/${anime.id}`} key={anime.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <img
                                className="w-full h-48 object-cover"
                                src={anime.poster_url}
                                alt={anime.title}
                            />
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-2">{anime.title}</h2>
                                <p className="text-gray-600 mb-2">
                                    <span className="font-semibold">Rating </span>{anime.rating} ⭐
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <span className="font-semibold">Genre </span>
                                    {Array.isArray(anime.genre) ? anime.genre.join(', ') : anime.genre}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <span className="font-semibold">Episode </span>{anime.episode}
                                </p>
                                <p className="text-gray-600 mb-2 truncate">
                                    {anime.synopsis}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                    {visibleCount < animes.length && (
                        <button onClick={loadMore} className="px-6 py-2 bg-cyan-400 text-white font-bold rounded-lg">
                            More Anime
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
