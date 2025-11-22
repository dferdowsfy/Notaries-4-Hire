import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, Calendar, CheckCircle } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';

export default function Profile() {
    return (
        <div className="min-h-screen bg-white">
            {/* Back Link */}
            <div className="border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <Link to="/dashboard" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Profile Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-serif text-text mb-4">Darius</h1>
                    <div className="flex items-center justify-center gap-6 text-text-secondary mb-8">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Location not set</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span className="font-bold text-text">4.8</span>
                            <span>(24 reviews)</span>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className="bg-white border border-slate-200 hover:border-primary hover:text-primary text-text px-8 py-3 rounded-full font-medium transition-colors">
                            Contact
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About */}
                        <div className="border border-slate-100 rounded-2xl p-8">
                            <h2 className="text-2xl font-serif text-text mb-4">About</h2>
                            <p className="text-text-secondary">
                                No bio provided yet. This notary is ready to help you with your documentation needs.
                            </p>
                        </div>

                        {/* Experience & Specialties */}
                        <div className="border border-slate-100 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold text-text">Experience</h3>
                                </div>
                                <p className="text-text-secondary">N/A</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold text-text">Specialties</h3>
                                </div>
                                <p className="text-text-secondary italic">No specialties listed</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Availability */}
                        <div className="border border-slate-100 rounded-2xl p-8">
                            <h3 className="font-bold text-lg text-text mb-6">Availability</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Mon - Fri</span>
                                    <span className="font-medium text-text">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Saturday</span>
                                    <span className="font-medium text-text">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Sunday</span>
                                    <span className="font-medium text-red-500">Closed</span>
                                </div>
                            </div>
                        </div>

                        {/* Credentials */}
                        <div className="border border-slate-100 rounded-2xl p-8">
                            <h3 className="font-bold text-lg text-text mb-6">Credentials</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-primary">
                                        <CheckCircle className="w-3 h-3" />
                                    </div>
                                    <span>Licensed & Bonded</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-primary">
                                        <CheckCircle className="w-3 h-3" />
                                    </div>
                                    <span>E&O Insured</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ReviewSection />
            </div>
        </div>
    );
}
