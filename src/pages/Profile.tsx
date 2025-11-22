import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Mail, Phone, ChevronLeft, Edit } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';

export default function Profile() {
    const { userId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                // Determine which user ID to load
                const targetUserId = userId || user?.uid;

                if (!targetUserId) {
                    navigate('/');
                    return;
                }

                const docRef = doc(db, 'notaries', targetUserId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProfileData({ id: targetUserId, ...docSnap.data() });
                    setIsOwnProfile(user?.uid === targetUserId);
                } else {
                    console.error('Profile not found');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [userId, user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-text">Loading profile...</div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-text">Profile not found</div>
            </div>
        );
    }

    const availability = profileData.availability || {};
    const customization = profileData.customization || {
        primaryColor: '#0E2A57',
        accentColor: '#D4AF37',
        backgroundColor: '#FFFFFF',
        textColor: '#1E293B'
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background">
            {/* Header with Back Button */}
            <div className="bg-white dark:bg-surface border-b border-slate-100 dark:border-slate-800 py-4 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link
                        to={isOwnProfile ? "/dashboard" : "/search"}
                        className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to {isOwnProfile ? "Dashboard" : "Search"}
                    </Link>
                    {isOwnProfile && (
                        <Link
                            to="/customize-profile"
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Customize Page
                        </Link>
                    )}
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    {profileData.photoUrl && (
                        <img
                            src={profileData.photoUrl}
                            alt={profileData.fullName}
                            className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
                        />
                    )}
                    <h1 className="text-4xl font-serif text-text mb-4" style={{ color: customization.textColor }}>
                        {profileData.fullName || 'Notary Professional'}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-text-secondary mb-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{profileData.city && profileData.state ? `${profileData.city}, ${profileData.state}` : 'Location not set'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-accent fill-accent" />
                            <span className="font-bold">{profileData.rating || 4.8}</span>
                            <span>({profileData.reviewCount || 24} reviews)</span>
                        </div>
                    </div>
                    <button
                        className="px-8 py-3 rounded-full font-medium transition-colors shadow-lg"
                        style={{
                            backgroundColor: customization.primaryColor,
                            color: '#FFFFFF'
                        }}
                    >
                        Contact
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="bg-white dark:bg-surface rounded-xl p-8 border border-slate-100 dark:border-slate-800">
                            <h2 className="text-2xl font-serif text-text mb-4">About</h2>
                            <p className="text-text-secondary leading-relaxed">
                                {profileData.bio || 'No bio provided yet. This notary is ready to help you with your documentation needs.'}
                            </p>
                        </div>

                        {/* Services & Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-surface rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-lg text-text mb-4 flex items-center gap-2">
                                    <span className="text-2xl">✓</span> Specialties
                                </h3>
                                {profileData.services && profileData.services.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.services.map((service: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 rounded-full text-sm font-medium"
                                                style={{
                                                    backgroundColor: `${customization.accentColor}20`,
                                                    color: customization.accentColor
                                                }}
                                            >
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-secondary italic">No specialties listed</p>
                                )}
                            </div>

                            <div className="bg-white dark:bg-surface rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-lg text-text mb-4 flex items-center gap-2">
                                    <span className="text-2xl">📅</span> Experience
                                </h3>
                                <p className="text-text-secondary">N/A</p>
                            </div>
                        </div>

                        {/* Reviews */}
                        <ReviewSection />
                    </div>

                    {/* Right Column - Availability */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-surface rounded-xl p-6 border border-slate-100 dark:border-slate-800 sticky top-24">
                            <h3 className="font-bold text-lg text-text mb-6">Availability</h3>
                            <div className="space-y-3">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                    const daySchedule = availability[day];
                                    const isActive = daySchedule?.active;

                                    return (
                                        <div key={day} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                            <span className="font-medium text-text">{day.slice(0, 3)}</span>
                                            {isActive ? (
                                                <span className="text-sm text-text-secondary">
                                                    {daySchedule.start} - {daySchedule.end}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-red-500">Closed</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Credentials */}
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-lg text-text mb-4">Credentials</h3>
                                <div className="space-y-2 text-sm text-text-secondary">
                                    <p>• Licensed Notary Public</p>
                                    <p>• Background Checked</p>
                                    <p>• Insured & Bonded</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
