import React, { useState, useEffect } from 'react';
import { Search, Car, Globe, Home as HomeIcon, Fingerprint, Heart, Plane, ShieldCheck, Shield, Headphones, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const services = [
    { icon: Car, label: 'Mobile Notary', count: '2103+ pros' },
    { icon: Globe, label: 'Apostille', count: '567+ pros' },
    { icon: HomeIcon, label: 'Loan Signing', count: '1456+ pros' },
    { icon: Fingerprint, label: 'Fingerprinting', count: '892+ pros' },
    { icon: Heart, label: 'Weddings', count: '892+ pros' },
    { icon: Plane, label: 'Immigration', count: '645+ pros' },
];

export default function Home() {
    const { openGetListed } = useModal();
    const [searchTerm, setSearchTerm] = useState('');
    const [featuredNotaries, setFeaturedNotaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeaturedNotaries = async () => {
            try {
                const q = query(
                    collection(db, 'notaries'),
                    orderBy('createdAt', 'desc'),
                    limit(3)
                );
                const querySnapshot = await getDocs(q);
                const notaries = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFeaturedNotaries(notaries);
            } catch (error) {
                console.error('Error fetching notaries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedNotaries();
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section id="search" className="pt-20 pb-16 px-4 text-center max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-7xl font-serif text-text mb-6 leading-tight">
                    Find a Certified Notary<br />
                    <span className="font-bold">Fast, Secure,</span><br />
                    <span className="font-bold">Nationwide.</span>
                </h1>
                <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
                    Connect with verified professionals for all your documentation needs. Search by City, State, or ZIP Code.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto bg-white p-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2">
                    <Search className="w-6 h-6 text-slate-400 ml-3" />
                    <input
                        type="text"
                        placeholder="Enter city, state, or ZIP code"
                        className="flex-1 p-3 outline-none text-lg text-text placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
                    >
                        Find Notary
                    </button>
                </div>

                <div className="mt-12 flex justify-center gap-8 text-xs font-bold tracking-widest text-text-secondary uppercase">
                    <Link to="/search" className="hover:text-primary cursor-pointer">Browse Directory</Link>
                    <span className="text-slate-300">|</span>
                    <button onClick={openGetListed} className="hover:text-primary cursor-pointer">List Your Business</button>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-12 border-y border-slate-50 bg-slate-50/50">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-text-secondary tracking-wide uppercase">Verified Professionals</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                            <Shield className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-text-secondary tracking-wide uppercase">Fully Insured</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                            <Car className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-text-secondary tracking-wide uppercase">Mobile Available</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                            <Headphones className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-text-secondary tracking-wide uppercase">24/7 Support</span>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="py-20 px-6 max-w-7xl mx-auto">
                <h2 className="text-4xl font-serif text-center text-text mb-16">Browse by Service</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="group bg-white border border-slate-100 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer">
                            <service.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-text mb-1">{service.label}</h3>
                            <p className="text-xs text-text-secondary">{service.count}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Notaries */}
            <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-100">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-serif text-text mb-2">Featured Notaries</h2>
                        <p className="text-text-secondary">Top rated professionals in your network</p>
                    </div>
                    <Link to="/search" className="text-primary font-medium hover:text-primary-hover flex items-center gap-1">
                        View All →
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-text-secondary">Loading featured notaries...</div>
                ) : featuredNotaries.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-secondary mb-4">No notaries listed yet.</p>
                        <button
                            onClick={openGetListed}
                            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Be the First to Get Listed!
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredNotaries.map((notary) => (
                            <div key={notary.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 relative flex items-center justify-center">
                                    {notary.photoUrl ? (
                                        <img src={notary.photoUrl} alt={notary.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-6xl font-serif text-primary/30">
                                            {notary.fullName?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-text">{notary.fullName || 'Notary Professional'}</h3>
                                            <p className="text-sm text-text-secondary">
                                                {notary.city && notary.state ? `${notary.city}, ${notary.state}` : 'Location not set'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded text-xs font-bold text-text">
                                            <Star className="w-3 h-3 text-accent fill-accent" /> {notary.rating || 5.0}
                                        </div>
                                    </div>
                                    {notary.services && notary.services.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {notary.services.slice(0, 2).map((service: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                                                    {service}
                                                </span>
                                            ))}
                                            {notary.services.length > 2 && (
                                                <span className="px-2 py-1 bg-slate-100 text-text-secondary text-xs rounded font-medium">
                                                    +{notary.services.length - 2} more
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
                )}
            </section>
        </div>
    );
}
