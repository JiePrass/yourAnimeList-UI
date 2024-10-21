export default function Input({ animeData, handleChange, inputName, inputType }) {
    return (
        <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 capitalize">{inputName}:</label>
            <input
                type={inputType} name={inputName} value={animeData[inputName]} onChange={handleChange} required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
        </div>
    )
}