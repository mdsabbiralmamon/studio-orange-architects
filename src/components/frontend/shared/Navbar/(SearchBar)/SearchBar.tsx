import React, { useState, useRef } from 'react';
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import Link from 'next/link';

interface SearchBarProps {
    textClass?: string;
}

interface SearchResult {
    _id: string;
    title: string;
    url: string;
    name: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ textClass }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async (value: string) => {
        setSearchTerm(value);
        
        if (value.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await axios.get(`/api/search?query=${encodeURIComponent(value)}`);
            setSearchResults(response.data.results || []);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="z-20 h-10 px-4 pr-10 rounded-full text-sm transition-all duration-300 ease-in-out w-12 bg-transparent focus:w-40 md:focus:w-64 focus:bg-white/30 focus:backdrop-blur-md"
                placeholder="Search..."
            />
            <button
                type="submit"
                className="z-10 absolute right-0 top-0 mt-3 mr-4 text-center"
                onClick={handleSearchClick}
            >
                <IoSearch className={`text-xl fill-current ${textClass}`} />
            </button>
            
            {searchTerm.length >= 2 && (
                <div className="absolute top-full left-0 w-64 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg mt-2 z-50">
                    {isSearching ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : searchResults.length > 0 ? (
                        <ul className="py-2">
                            {searchResults.map((result) => (
                                <li key={result._id}>
                                    <Link
                                        href={result.url}
                                        className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                                    >
                                        {result.title || result.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-500">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;