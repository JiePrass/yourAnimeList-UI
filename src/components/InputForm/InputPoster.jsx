export default function InputPoster({ handleChange, posterPreview }) {
    return (
        <div className="col-span-1 flex flex-col">
            <label className="block text-sm font-medium text-gray-700">Poster:</label>
            <div className="relative">
                <input
                    type="file" name="poster" onChange={handleChange} required
                    className="hidden"
                />
                <div
                    onClick={() => document.querySelector('input[name="poster"]').click()}
                    className={`flex items-center justify-center border border-gray-300 rounded-md cursor-pointer ${posterPreview ? 'border-transparent' : 'bg-gray-100'
                        }`}
                    style={{
                        height: '200px',
                        width: '100%',
                        backgroundColor: posterPreview ? 'transparent' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {posterPreview ? (
                        <img
                            src={posterPreview} alt="Poster Preview"
                            className="max-h-full max-w-full object-cover rounded-md"
                        />
                    ) : (
                        <span className="text-gray-500">Klik untuk memilih poster</span>
                    )}
                </div>
            </div>
        </div>
    )
}