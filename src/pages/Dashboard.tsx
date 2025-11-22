import React, { useEffect, useState } from 'react';
import { User, Calendar, Settings, ToggleRight, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Dashboard() {
    const { user, isNotary, loading } = useAuth();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [affiliateCode, setAffiliateCode] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }

        const fetchProfile = async () => {
            if (user) {
                const docRef = doc(db, 'notaries', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setAffiliateCode(docSnap.data().affiliateCode || user.uid.substring(0, 8).toUpperCase());
                }
            }
        };
        fetchProfile();
    }, [user, loading, navigate]);

    const copyToClipboard = () => {
        const link = `${window.location.origin}/?ref=${affiliateCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-background py-12 px-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-serif text-text">Quick Actions</h1>
                    <div className="text-sm text-text-secondary">
                        Welcome back, <span className="font-bold text-text">{user.email?.split('@')[0]}</span>
                    </div>
                </div>

                {/* Affiliate Link Section */}
                <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-6 mb-8">
                    <h3 className="font-bold text-lg text-text mb-2">Your Affiliate Link</h3>
                    <p className="text-sm text-text-secondary mb-4">Share this link to earn rewards when new notaries sign up.</p>
                    <div className="flex gap-2 max-w-md">
                        <div className="flex-1 bg-white dark:bg-surface border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-text-secondary truncate">
                            {`${window.location.origin}/?ref=${affiliateCode}`}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="bg-white dark:bg-surface border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary text-text-secondary px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Public Landing Page Card */}
                    <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white dark:bg-surface">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                                <ToggleRight className="w-8 h-8 text-primary" />
                                Public
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-text mb-2">Public Landing Page</h3>
                        <p className="text-sm text-text-secondary mb-6">Customize your landing page visible to clients.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-medium transition-colors">
                                Edit
                            </button>
                            <Link to="/profile" className="flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary text-text py-2 rounded-lg font-medium transition-colors">
                                Preview
                            </Link>
                        </div>
                    </div>

                    {/* Availability Card */}
                    <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white dark:bg-surface">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 mb-4">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-text mb-2">Availability</h3>
                        <p className="text-sm text-text-secondary mb-6">Manage your schedule and booking preferences.</p>
                        <button className="w-full border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary text-text py-2 rounded-lg font-medium transition-colors">
                            Manage Schedule
                        </button>
                    </div>

                    {/* Account Settings Card */}
                    <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white dark:bg-surface">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 mb-4">
                            <Settings className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-text mb-2">Account Settings</h3>
                        <p className="text-sm text-text-secondary mb-6">Update credentials, subscription, and security.</p>
                        <button className="w-full border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary text-text py-2 rounded-lg font-medium transition-colors">
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
