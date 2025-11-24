import React, { useEffect, useState } from 'react';
import { User, Calendar, Settings, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import EditProfileModal from '../components/EditProfileModal';
import AvailabilityModal from '../components/AvailabilityModal';
import AccountSettingsModal from '../components/AccountSettingsModal';

import ShareModal from '../components/ShareModal';

export default function Dashboard() {
    const { user, isNotary, loading } = useAuth();
    const navigate = useNavigate();
    const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [profileCopied, setProfileCopied] = useState(false);

    // Modal states
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchNotaryData = async () => {
            if (user) {
                const docRef = doc(db, 'notaries', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setAffiliateCode(docSnap.data().affiliateCode);
                }
            }
        };
        fetchNotaryData();
    }, [user]);

    const copyToClipboard = () => {
        if (affiliateCode) {
            const link = `${window.location.origin}/?ref=${affiliateCode}`;
            navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getProfileUrl = () => {
        return `${window.location.origin}/profile/${user?.uid}`;
    };

    const handleCopyProfileLink = () => {
        navigator.clipboard.writeText(getProfileUrl());
        setProfileCopied(true);
        setTimeout(() => setProfileCopied(false), 2000);
    };

    const handleShare = async () => {
        const profileUrl = getProfileUrl();

        // Check if Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Notary Profile',
                    text: 'Check out my professional notary services',
                    url: profileUrl
                });
            } catch (error) {
                // User cancelled or error occurred
                if ((error as Error).name !== 'AbortError') {
                    console.error('Error sharing:', error);
                    handleCopyProfileLink(); // Fallback to copy
                }
            }
        } else {
            // Fallback to copy
            handleCopyProfileLink();
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background pt-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-serif text-text mb-2">Dashboard</h1>
                        <p className="text-text-secondary">Welcome back, {user?.email}</p>
                    </div>
                    {user?.email === 'dferdows@gmail.com' && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                            <Settings className="w-4 h-4" />
                            Admin Panel
                        </Link>
                    )}
                </div>

                {/* Profile Actions */}
                <div className="bg-white dark:bg-surface border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                        <div>
                            <h3 className="font-bold text-lg text-text mb-1">Your Public Profile</h3>
                            <p className="text-sm text-text-secondary">Share your profile with potential clients</p>
                        </div>
                        <Link
                            to="/customize-profile"
                            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                            <Settings className="w-4 h-4" />
                            Customize Page
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-text font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Profile
                        </Link>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors shadow-sm shadow-primary/20"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        <button
                            onClick={handleCopyProfileLink}
                            className="p-2 border border-slate-200 dark:border-slate-700 text-text-secondary hover:text-text hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Copy Profile Link"
                        >
                            {profileCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Affiliate Link Section */}
                {affiliateCode && (
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-lg text-text mb-1">Your Affiliate Link</h3>
                            <p className="text-sm text-text-secondary">Share this link to earn rewards when new notaries sign up.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-surface p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-full md:w-auto">
                            <code className="text-sm text-primary font-mono px-2 truncate max-w-[200px] md:max-w-none">
                                {`${window.location.origin}/?ref=${affiliateCode}`}
                            </code>
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-primary"
                                title="Share Link"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-text-secondary"
                                title="Copy Link"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div
                        onClick={() => setIsEditProfileOpen(true)}
                        className="bg-white dark:bg-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                            <User className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-text mb-2">Edit Profile</h3>
                        <p className="text-text-secondary text-sm">Update your bio, services, and contact information.</p>
                    </div>

                    <div
                        onClick={() => setIsAvailabilityOpen(true)}
                        className="bg-white dark:bg-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-text mb-2">Manage Availability</h3>
                        <p className="text-text-secondary text-sm">Set your working hours and schedule.</p>
                    </div>

                    <div
                        onClick={() => setIsAccountSettingsOpen(true)}
                        className="bg-white dark:bg-surface p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary mb-4 group-hover:scale-110 transition-transform">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-text mb-2">Account Settings</h3>
                        <p className="text-text-secondary text-sm">Manage your subscription and security preferences.</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
            <AvailabilityModal isOpen={isAvailabilityOpen} onClose={() => setIsAvailabilityOpen(false)} />
            <AccountSettingsModal isOpen={isAccountSettingsOpen} onClose={() => setIsAccountSettingsOpen(false)} />

            {affiliateCode && (
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    shareUrl={`${window.location.origin}/?ref=${affiliateCode}`}
                    title="Join Notaries 4 Hire"
                    text="Use my referral link to join Notaries 4 Hire and grow your notary business!"
                />
            )}
        </div>
    );
}
