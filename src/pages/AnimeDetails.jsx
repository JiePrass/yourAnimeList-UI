import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import api from '../api/axios';
import InputPoster from '../components/InputForm/InputPoster';

const genresList = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Romance",
    "Slice of Life",
    "Sci-Fi",
    "Mystery",
    "Supernatural",
    "Thriller",
    "Mecha",
    "Sports",
    "Isekai",
    "Shounen",
    "Shoujo",
    "Seinen",
    "Josei",
    "Mature"
];

export default function AnimeDetails({ animes, setAnimes }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedAnime, setEditedAnime] = useState({
        title: '',
        genre: [],
        rating: '',
        episode: '',
        studio: '',
        synopsis: ''
    });

    const [poster, setPoster] = useState(null); // Untuk input poster baru
    const [previewPoster, setPreviewPoster] = useState(null); // Untuk preview poster baru
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State untuk mengontrol dropdown

    const anime = animes.find(anime => anime.id === parseInt(id));

    if (!anime) {
        return <div className="text-center mt-10">Anime not found</div>;
    }

    const genreList = Array.isArray(anime.genre) ? anime.genre : anime.genre.split(', ');

    const handleDelete = async () => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmDelete.isConfirmed) {
            try {
                await api.delete(`/anime/${id}`);
                setAnimes(animes.filter(anime => anime.id !== parseInt(id)));
                Swal.fire(
                    'Deleted!',
                    'Your anime has been deleted.',
                    'success'
                );
                navigate('/'); // Navigasi setelah berhasil dihapus
            } catch (error) {
                console.error('Error deleting anime:', error);
                Swal.fire(
                    'Error!',
                    'There was a problem deleting the anime.',
                    'error'
                );
            }
        }
    };

    const handleEdit = () => {
        const initialGenres = Array.isArray(anime.genre) ? anime.genre : anime.genre.split(',').map(g => g.trim());
        console.log('Initial Genres:', initialGenres); // Debugging
        setEditedAnime({
            title: anime.title,
            genre: initialGenres, // Pastikan genre menjadi array
            studio: anime.studio,
            episode: anime.episode,
            rating: anime.rating,
            synopsis: anime.synopsis,
        });
        setPoster(anime.poster_url); // Tampilkan poster lama saat edit
        setIsModalOpen(true); // Buka modal
    };



    const handleModalClose = () => {
        setIsModalOpen(false); // Tutup modal
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAnime((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPoster(file);
        setPreviewPoster(URL.createObjectURL(file)); // Tampilkan preview gambar yang baru
    };

    const handleGenreChange = (genre) => {
        setEditedAnime((prev) => {
            const currentGenres = [...prev.genre];
            if (currentGenres.includes(genre)) {
                // Jika genre sudah ada, hapus dari array
                return { ...prev, genre: currentGenres.filter(g => g !== genre) };
            } else {
                // Jika genre belum ada, tambahkan ke array
                return { ...prev, genre: [...currentGenres, genre] };
            }
        });
    };


    const handleUpdateAnime = async () => {

        const editedAnime = {
            title: 'Test Anime',
            genre: ['Action', 'Comedy'], // Pastikan ini sesuai dengan format yang diharapkan
            studio: 'Test Studio',
            episode: '1',
            rating: '5',
            synopsis: 'Test Synopsis',
        };

        console.log('Edited Anime Before Update:', editedAnime);

        // Validasi input
        if (!editedAnime.title || !editedAnime.genre.length || !editedAnime.studio || !editedAnime.episode || !editedAnime.rating || !editedAnime.synopsis) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill all required fields.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', editedAnime.title);
        formData.append('genre', editedAnime.genre.join(',')); // Ubah format genre
        formData.append('studio', editedAnime.studio);
        formData.append('episode', editedAnime.episode);
        formData.append('rating', editedAnime.rating);
        formData.append('synopsis', editedAnime.synopsis);

        if (poster instanceof File) {
            formData.append('poster', poster);
        }

        // Log isi FormData
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            await api.put(`animes/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAnimes((prevAnimes) =>
                prevAnimes.map((a) => (a.id === parseInt(id) ? { ...a, ...editedAnime, poster_url: previewPoster || poster } : a))
            );
            setIsModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Anime Updated!',
                text: 'Your anime has been updated successfully.',
            });
        } catch (error) {
            // Log untuk melihat struktur error
            console.error('Error updating anime:', error.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Error updating anime',
                text: error.response.data.message || 'Something went wrong!',
            });
        }
    };




    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= fullStars; i++) {
            stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />);
        }

        if (hasHalfStar) {
            stars.push(<FontAwesomeIcon key={fullStars + 1} icon={faStarHalfAlt} className="text-yellow-500" />);
        }

        for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
            stars.push(<FontAwesomeIcon key={i + 1} icon={faStarRegular} className="text-yellow-500" />);
        }

        return stars;
    };


    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                        <img
                            src={anime.poster_url}
                            alt={anime.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-3xl font-bold">{anime.title}</h1>
                            <button
                                onClick={handleEdit}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <FontAwesomeIcon icon={faEdit} size="lg" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-gray-700">
                                <strong>Genre:</strong>
                            </p>
                            <p className="text-right text-gray-700">{genreList.join(', ')}</p>

                            <p className="text-gray-700">
                                <strong>Studio:</strong>
                            </p>
                            <p className="text-right text-gray-700">{anime.studio}</p>

                            <p className="text-gray-700">
                                <strong>Episodes:</strong>
                            </p>
                            <p className="text-right text-gray-700">{anime.episode}</p>

                            <p className="text-gray-700">
                                <strong>Rating:</strong>
                            </p>
                            <div className="text-right text-yellow-500 flex justify-end items-center">
                                {renderStars(anime.rating)}
                                <span className="text-gray-700 ml-2">{anime.rating}/10</span>
                            </div>
                        </div>

                        <p className="text-gray-700 mt-4">
                            <strong>Synopsis:</strong> {anime.synopsis}
                        </p>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 flex items-center"
                            >
                                <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white p-6 rounded-lg max-w-3xl w-full space-y-4">
                        <h2 className="text-2xl font-bold">Edit Anime</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Title Input */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editedAnime.title}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-1" // Mengurangi padding
                                />
                            </div>

                            {/* Rating Input */}
                            <div className="col-span-1 flex items-center">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Rating:</label>
                                    <input
                                        type="text"
                                        name="rating"
                                        value={editedAnime.rating}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Studio Input */}
                        <div className='col-span-1'>
                            <label className="block text-sm font-medium text-gray-700">Studio:</label>
                            <input
                                type="text"
                                name="studio"
                                value={editedAnime.studio}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-1"
                            />
                        </div>

                        {/* Episodes Input */}
                        <div className='col-span-1'>
                            <label className="block text-sm font-medium text-gray-700">Episodes:</label>
                            <input
                                type="text"
                                name="episode"
                                value={editedAnime.episode}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-1"
                            />
                        </div>

                        {/* Genre Input */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Genre:</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-left"
                                >
                                    {editedAnime.genre.length > 0 ? editedAnime.genre.join(', ') : 'Select Genres'}
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                        <div className="grid grid-cols-3 gap-2 p-2">
                                            {genresList.map((genre) => (
                                                <label key={genre} className="flex items-center p-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={editedAnime.genre.includes(genre)} // Memeriksa apakah genre ada dalam editedAnime.genre
                                                        onChange={() => handleGenreChange(genre)}
                                                        className="mr-2"
                                                    />
                                                    {genre}
                                                </label>
                                            ))}

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {/* Synopsis Input */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">Synopsis:</label>
                                <textarea
                                    name="synopsis"
                                    value={editedAnime.synopsis}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-1"
                                    style={{ height: '200px' }} // Sesuaikan tinggi sesuai kebutuhan
                                />
                            </div>


                            {/* Poster Input */}
                            <InputPoster
                                handleChange={handleFileChange}
                                posterPreview={previewPoster || poster}
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button onClick={handleModalClose} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700">
                                Cancel
                            </button>
                            <button onClick={handleUpdateAnime} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
