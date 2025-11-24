import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Star, Shield } from 'lucide-react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Search() {
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';
    const [results, setResults] = useState<any[]>([]);
    const [allNotaries, setAllNotaries] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState(queryParam);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch all notaries from Firebase
    useEffect(() => {
        const fetchNotaries = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'notaries'));
                const querySnapshot = await getDocs(q);
                const notaries = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllNotaries(notaries);
                setResults(notaries);
            } catch (error) {
                console.error('Error fetching notaries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotaries();
    }, []);

    // Filter results based on search query
    useEffect(() => {
        if (queryParam) {
            const filtered = allNotaries.filter(n =>
                n.city?.toLowerCase().includes(queryParam.toLowerCase()) ||
                n.state?.toLowerCase().includes(queryParam.toLowerCase()) ||
                n.fullName?.toLowerCase().includes(queryParam.toLowerCase()) ||
                n.services?.some((s: string) => s.toLowerCase().includes(queryParam.toLowerCase()))
            );
            setResults(filtered);
        } else {
            setResults(allNotaries);
        }
        setSearchTerm(queryParam);
    }, [queryParam, allNotaries]);

    const handleSearch = () => {
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
                            onKeyDown={handleKeyDown}
                            placeholder="Search by city, state, or name"
                            className="w-full pl-10 p-3 rounded-lg border border-slate-200 focus:border-primary outline-none"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
                    >
                        Search
                    </button>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12 text-text-secondary">Loading notaries...</div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((notary) => (
                            <div key={notary.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 relative flex items-center justify-center">
                                    {notary.photoUrl ? (
                                        <img src={notary.photoUrl} alt={notary.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-4xl font-serif text-primary/30">
                                            {notary.fullName?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-text">{notary.fullName || 'Notary Professional'}</h3>
                                            {notary.verified && (
                                                <div className="relative group">
                                                    <Shield className="w-4 h-4 text-accent fill-current" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                        Verified Member
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-xs font-bold text-text">
                                            <Star className="w-3 h-3 text-accent fill-accent" /> {notary.rating || 5.0}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-text-secondary mb-4">
                                        <MapPin className="w-4 h-4" />
                                        {notary.city && notary.state ? `${notary.city}, ${notary.state}` : 'Location not set'}
                                    </div>
                                    {notary.services && notary.services.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {notary.services.slice(0, 2).map((s: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-primary/5 text-primary text-xs rounded font-medium">
                                                    {s}
                                                </span>
                                            ))}
                                            {notary.services.length > 2 && (
                                                <span className="px-2 py-1 bg-slate-100 text-text-secondary text-xs rounded font-medium">
                                                    +{notary.services.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <Link
                                        to={`/profile/${notary.id}`}
                                        className="block w-full py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors text-center"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full text-center py-12 text-text-secondary">
                        {queryParam ? (
                            <>
                                <p className="mb-4">No notaries found matching "{queryParam}".</p>
                                <p>Try a different search term.</p>
                            </>
                        ) : (
                            <p>No notaries are currently listed. Be the first to get listed!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
