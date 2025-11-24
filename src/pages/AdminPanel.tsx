import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import { Shield, CheckCircle, XCircle, Search, ArrowLeft, Mail, MapPin, Calendar } from 'lucide-react';

interface Notary {
    id: string;
    fullName: string;
    email: string;
    city: string;
    state: string;
    verified: boolean;
    createdAt?: any;
    photoUrl?: string;
}

export default function AdminPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notaries, setNotaries] = useState<Notary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');

    // Admin email - you can change this or make it configurable
    const ADMIN_EMAIL = 'dferdows@gmail.com';

    useEffect(() => {
        if (!user || user.email !== ADMIN_EMAIL) {
            navigate('/');
            return;
        }
        fetchNotaries();
    }, [user, navigate]);

    const fetchNotaries = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'notaries'));
            const notariesData: Notary[] = [];
            querySnapshot.forEach((doc) => {
                notariesData.push({ id: doc.id, ...doc.data() } as Notary);
            });
            // Sort by creation date (newest first)
            notariesData.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB.getTime() - dateA.getTime();
            });
            setNotaries(notariesData);
        } catch (error) {
            console.error('Error fetching notaries:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerification = async (notaryId: string, currentStatus: boolean) => {
        try {
            const notaryRef = doc(db, 'notaries', notaryId);
            await updateDoc(notaryRef, {
                verified: !currentStatus
            });
            // Update local state
            setNotaries(notaries.map(n =>
                n.id === notaryId ? { ...n, verified: !currentStatus } : n
            ));
        } catch (error) {
            console.error('Error updating verification:', error);
            alert('Failed to update verification status');
        }
    };

    const filteredNotaries = notaries.filter(notary => {
        const matchesSearch = notary.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notary.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notary.city.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'verified' && notary.verified) ||
            (filterStatus === 'unverified' && !notary.verified);

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    const stats = {
        total: notaries.length,
        verified: notaries.filter(n => n.verified).length,
        unverified: notaries.filter(n => !n.verified).length
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-text flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-primary" />
                                    Admin Panel
                                </h1>
                                <p className="text-sm text-text-secondary">Manage notary verifications</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Total Notaries</p>
                                <p className="text-3xl font-bold text-text">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Verified</p>
                                <p className="text-3xl font-bold text-green-600">{stats.verified}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary mb-1">Pending</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.unverified}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterStatus('verified')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'verified'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                                    }`}
                            >
                                Verified
                            </button>
                            <button
                                onClick={() => setFilterStatus('unverified')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'unverified'
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                                    }`}
                            >
                                Pending
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notaries List */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Notary
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredNotaries.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                                            No notaries found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredNotaries.map((notary) => (
                                        <tr key={notary.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                        {notary.photoUrl ? (
                                                            <img src={notary.photoUrl} alt={notary.fullName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-text font-bold">
                                                                {notary.fullName?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-text">{notary.fullName}</p>
                                                        <p className="text-xs text-text-secondary flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {notary.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm text-text-secondary">
                                                    <Mail className="w-4 h-4" />
                                                    {notary.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm text-text">
                                                    <MapPin className="w-4 h-4 text-text-secondary" />
                                                    {notary.city}, {notary.state}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {notary.verified ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                        <XCircle className="w-3 h-3" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleVerification(notary.id, notary.verified)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${notary.verified
                                                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            }`}
                                                    >
                                                        {notary.verified ? 'Unverify' : 'Verify'}
                                                    </button>
                                                    <button
                                                        onClick={() => window.open(`/profile/${notary.id}`, '_blank')}
                                                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-text hover:bg-slate-200 transition-colors"
                                                    >
                                                        View Profile
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
