import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Star } from 'lucide-react';

// Mock data for search results
const MOCK_NOTARIES = [
    { id: 1, name: 'Jane Doe', city: 'San Francisco', state: 'CA', rating: 4.9, services: ['Mobile Notary', 'Loan Signing'] },
    { id: 2, name: 'John Smith', city: 'Austin', state: 'TX', rating: 5.0, services: ['Remote Online', 'Apostille'] },
    { id: 3, name: 'Sarah Wilson', city: 'New York', state: 'NY', rating: 4.8, services: ['Mobile Notary', 'Wedding Officiant'] },
    { id: 4, name: 'Michael Brown', city: 'Chicago', state: 'IL', rating: 4.9, services: ['Loan Signing', 'Fingerprinting'] },
    { id: 5, name: 'Emily Davis', city: 'Miami', state: 'FL', rating: 5.0, services: ['Mobile Notary', 'Apostille'] },
];

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState(MOCK_NOTARIES);
    const [searchTerm, setSearchTerm] = useState(query);

    useEffect(() => {
        if (query) {
            const filtered = MOCK_NOTARIES.filter(n =>
                n.city.toLowerCase().includes(query.toLowerCase()) ||
                n.state.toLowerCase().includes(query.toLowerCase()) ||
                n.name.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults(MOCK_NOTARIES);
        }
        setSearchTerm(query);
    }, [query]);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-serif text-text mb-8">Find a Notary</h1>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8 flex gap-4">
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by city, state, or name"
                            className="w-full pl-10 p-3 rounded-lg border border-slate-200 focus:border-primary outline-none"
                        />
                    </div>
                    <Link
                        to={`/search?q=${searchTerm}`}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
                    >
                        Search
                    </Link>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.length > 0 ? (
                        results.map((notary) => (
                            <div key={notary.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-32 bg-slate-100 relative">
                                    {/* Cover placeholder */}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-text">{notary.name}</h3>
                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-xs font-bold text-text">
                                            <Star className="w-3 h-3 text-accent fill-accent" /> {notary.rating}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-text-secondary mb-4">
                                        <MapPin className="w-4 h-4" />
                                        {notary.city}, {notary.state}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {notary.services.map((s, i) => (
                                            <span key={i} className="px-2 py-1 bg-primary/5 text-primary text-xs rounded font-medium">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block w-full py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors text-center"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-text-secondary">
                            No notaries found matching "{query}". Try a different search term.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
