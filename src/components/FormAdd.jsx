import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Input from './InputForm/Input';
import InputGenre from './InputForm/InputGenre';
import InputPoster from './InputForm/InputPoster';
import InputSynopsis from './InputForm/InputSynopsis';
import InputSubmit from './InputForm/InputSubmit';
import api from '../api/axios';

export default function FormAdd() {
    const navigate = useNavigate()

    const [animeData, setAnimeData] = useState({
        title: '', poster: null, selectedGenres: [], otherGenre: '',
        rating: '', episodes: '', studio: '', synopsis: '',
    });

    const [posterPreview, setPosterPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'poster') {
            const file = files[0];
            setAnimeData((prevState) => ({
                ...prevState,
                poster: file,
            }));
            setPosterPreview(URL.createObjectURL(file));
        } else if (name === 'genre') {
            setAnimeData((prevState) => {
                const selectedGenres = prevState.selectedGenres.includes(value)
                    ? prevState.selectedGenres.filter((g) => g !== value)
                    : [...prevState.selectedGenres, value];
                return { ...prevState, selectedGenres };
            });
        } else if (name === 'otherGenre') {
            setAnimeData((prevState) => ({
                ...prevState,
                otherGenre: value || '', // Menggunakan string kosong jika value tidak ada
            }));
        } else {
            setAnimeData((prevState) => ({
                ...prevState,
                [name]: value || '', // Menggunakan string kosong jika value tidak ada
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Tambahkan genre dari selectedGenres
        animeData.selectedGenres.forEach(genre => {
            formData.append('genre[]', genre);
        });

        // Jika otherGenre ada isinya, tambahkan ke genre
        if (animeData.otherGenre.trim()) {
            formData.append('genre[]', animeData.otherGenre.trim());
        }

        // Tambahkan data lainnya ke formData
        for (const key in animeData) {
            if (key !== 'selectedGenres' && key !== 'otherGenre') {
                formData.append(key, animeData[key]);
            }
        }

        try {
            const response = await api.post('/animes', formData);
            console.log('Anime added:', response.data);
            setAnimeData({ title: '', poster: null, selectedGenres: [], otherGenre: '', rating: '', episodes: '', studio: '', synopsis: '' });
            setPosterPreview(null);

            // Tampilkan SweetAlert2 ketika berhasil
            Swal.fire({
                title: 'Berhasil!',
                text: 'Anime berhasil ditambahkan!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/'); // Redirect ke halaman home
                }
            });
        } catch (error) {
            console.error('Error adding anime:', error);
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
                Swal.fire({
                    title: 'Gagal!',
                    text: 'Gagal menambahkan anime. ' + (error.response.data.message || ''),
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else if (error.request) {
                console.log('Request data:', error.request);
            } else {
                console.log('Error message:', error.message);
            }
        }
    };


    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input animeData={animeData} handleChange={handleChange} inputName="title" inputType="text" />
            <Input animeData={animeData} handleChange={handleChange} inputName="rating" inputType="number" />

            <InputGenre animeData={animeData} handleChange={handleChange} />

            <Input animeData={animeData} handleChange={handleChange} inputName="episode" inputType="number" />
            <Input animeData={animeData} handleChange={handleChange} inputName="studio" inputType="text" />

            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputSynopsis animeData={animeData} handleChange={handleChange} />
                <InputPoster handleChange={handleChange} posterPreview={posterPreview} />
            </div>

            <InputSubmit />
        </form>
    )

}