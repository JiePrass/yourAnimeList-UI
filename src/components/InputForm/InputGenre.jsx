import { useState } from "react";

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

export default function InputGenre({ animeData, handleChange }) {
    const [isOtherGenreSelected, setIsOtherGenreSelected] = useState(false);

    return (
        <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Genres:</label>
            <div className="grid grid-cols-4 gap-2">
                {genresList.map((genre) => (
                    <label key={genre} className="flex items-center">
                        <input
                            type="checkbox" name="genre" value={genre}
                            checked={animeData.selectedGenres.includes(genre)} onChange={handleChange}
                            className="mr-2"
                        />
                        {genre}
                    </label>
                ))}
                <label className="flex items-center">
                    <input
                        type="checkbox" name="otherGenre"
                        checked={isOtherGenreSelected}
                        onChange={() => setIsOtherGenreSelected(!isOtherGenreSelected)}
                        className="mr-2"
                    />
                    Other Genre
                </label>
            </div>

            {/* Input for Other Genre */}
            <div className={`mt-2 ${isOtherGenreSelected ? 'block' : 'hidden'}`}>
                <div className="flex justify-start">
                    <input
                        type="text" name="otherGenre" value={animeData.otherGenre}
                        onChange={handleChange}
                        placeholder="Enter other genre"
                        className="block w-1/2 border border-gray-300 rounded-md p-2"
                    />
                </div>
            </div>
        </div>
    )
}