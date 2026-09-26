import React, { useState, useEffect } from 'react';
import { Search, Car, Globe, Home as HomeIcon, Fingerprint, Heart, Plane, ShieldCheck, Shield, Headphones, Star, FileCheck, Users, Truck, ClipboardCheck, FileText, Languages, Package, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const services = [
    { icon: Car, label: 'Mobile Notary Services' },
    { icon: Globe, label: 'Apostille' },
    { icon: HomeIcon, label: 'Loan Signing' },
    { icon: Fingerprint, label: 'Fingerprinting' },
    { icon: Fingerprint, label: 'Live Scan Fingerprinting' },
    { icon: Heart, label: 'Weddings / Wedding Officiants' },
    { icon: Plane, label: 'Immigration Services' },
    { icon: FileCheck, label: 'Title Producer (TIPIC)' },
    { icon: Shield, label: 'RON Notary (Remote Online Notary)' },
    { icon: ClipboardCheck, label: 'I-9 Verification' },
    { icon: Search, label: 'Field Inspections' },
    { icon: FileText, label: 'Process Serving' },
    { icon: Car, label: 'VIN Verification' },
    { icon: FileText, label: 'Legal Document Preparation' },
    { icon: Languages, label: 'Translation Services' },
    { icon: Package, label: 'Courier / Mobile Office Services' },
    { icon: MoreHorizontal, label: 'Other' },
];

export default function Home() {
    const { openGetListed } = useModal();
    const [searchTerm, setSearchTerm] = useState('');
    const [featuredNotaries, setFeaturedNotaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllServices, setShowAllServices] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeaturedNotaries = async () => {
            try {
                const q = query(
                    collection(db, 'notaries'),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const notaries = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).filter((notary: any) => notary.listingStatus !== 'hidden').slice(0, 3);
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
                    Find Trusted Notaries & Licensed Title Producers<br />
                    <span className="font-bold">Fast. Secure.</span><br />
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
                        Find A Notary
                    </button>
                </div>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => openGetListed()}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-3"
                    >
                        <span>Get Listed Today</span>
                        <span className="text-2xl">→</span>
                    </button>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif mb-4">
                                Why Join <span className="text-blue-400">Notaries4Hire</span>
                            </h2>
                            <p className="text-lg text-slate-300 mb-8">
                                Get discovered by clients already searching for notaries.
                            </p>

                            <div className="grid gap-4 mb-8">
                                {[
                                    "Get discovered by clients nationwide",
                                    "Professional profile with credentials",
                                    "Verified badges (TIPIC, RON, Commission)",
                                    "Appear in state & county searches",
                                    "Only $19.99/month",
                                    "Fast 2-minute signup"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-slate-200">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => openGetListed()}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/25"
                            >
                                Get Listed Today
                            </button>
                        </div>

                        <div className="relative hidden md:block">
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-2xl font-serif text-white">JD</div>
                                    <div>
                                        <div className="h-6 w-48 bg-white/20 rounded mb-2"></div>
                                        <div className="h-4 w-32 bg-white/10 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="h-3 w-full bg-white/10 rounded"></div>
                                    <div className="h-3 w-full bg-white/10 rounded"></div>
                                    <div className="h-3 w-3/4 bg-white/10 rounded"></div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs border border-green-500/30 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Verified
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs border border-blue-500/30 flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> RON Certified
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-12 border-y border-slate-50 bg-slate-50/50">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-accent shadow-sm">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-text-secondary tracking-wide uppercase">Verified Professionals</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-accent shadow-sm">
                            <Shield className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-text-secondary tracking-wide uppercase">Fully Insured</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-accent shadow-sm">
                            <Car className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-text-secondary tracking-wide uppercase">Mobile Available</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-accent shadow-sm">
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
                    {(showAllServices ? services : services.slice(0, 6)).map((service, index) => (
                        <div key={index} className="group bg-white border border-slate-100 rounded-xl p-8 flex flex-col items-center text-center hover:shadow-xl hover:border-accent/30 transition-all cursor-pointer">
                            <service.icon className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-text">{service.label}</h3>
                        </div>
                    ))}
                </div>
                {!showAllServices && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowAllServices(true)}
                            className="text-primary hover:text-primary-hover font-medium flex items-center gap-2 mx-auto transition-colors"
                        >
                            See More Services
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-serif text-text mb-6">Simple, Transparent Pricing</h2>
                    <p className="text-text-secondary mb-12 max-w-2xl mx-auto">
                        Join thousands of notaries growing their business with Notaries4Hire. No hidden fees, cancel anytime.
                    </p>

                    <div className="bg-white rounded-2xl shadow-xl border-2 border-accent overflow-hidden max-w-md mx-auto relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
                        <div className="p-8">
                            <h3 className="text-xl font-bold text-text mb-2">Professional Plan</h3>
                            <div className="flex items-baseline justify-center gap-1 mb-6">
                                <span className="text-4xl font-bold text-text">$19.99</span>
                                <span className="text-text-secondary">/month</span>
                            </div>

                            <ul className="space-y-4 text-left mb-8">
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-text-secondary">Premium Profile Listing</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-text-secondary">Unlimited Client Leads</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-text-secondary">Customizable Profile Page</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-text-secondary">"Verified" Badge</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-text-secondary">Priority Search Ranking</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => openGetListed()}
                                className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-primary/20"
                            >
                                Get Started
                            </button>
                            <p className="text-xs text-text-secondary mt-4">30-day money-back guarantee</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Notaries */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
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
                            onClick={() => openGetListed()}
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
