export default function InputSynopsis({ animeData, handleChange }) {
    return (
        <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Synopsis:</label>
            <textarea
                name="synopsis" value={animeData.synopsis} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                style={{ height: '200px' }} // Sesuaikan tinggi sesuai kebutuhan
            />
        </div>
    )
}