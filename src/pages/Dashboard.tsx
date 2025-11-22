import React, { useEffect, useState } from 'react';
import { User, Calendar, Settings, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import EditProfileModal from '../components/EditProfileModal';
import AvailabilityModal from '../components/AvailabilityModal';
import AccountSettingsModal from '../components/AccountSettingsModal';

export default function Dashboard() {
    const { user, isNotary, loading } = useAuth();
    const navigate = useNavigate();
    const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Modal states
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background pt-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-serif text-text mb-2">Dashboard</h1>
                        <p className="text-text-secondary">Welcome back, {user?.email}</p>
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
        </div>
    );
}
