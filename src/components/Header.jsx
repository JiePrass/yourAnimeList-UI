import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-[#1F55A1] shadow">
            <h1 className="text-2xl font-bold text-white mx-[10px]"><span className='text-[#D88D4C]'>Your</span>AnimeList</h1>
            <nav>
                <Link to="/" className="text-white font-semibold mx-4 hover:text-blue-400 transition-all">Home</Link>
                <Link to="/add-anime" className="text-white font-semibold mx-4 hover:text-blue-400 transition-all">Add Anime</Link>
            </nav>
        </header>
    );
}
