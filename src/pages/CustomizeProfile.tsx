import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, Eye, ChevronLeft, Palette, Type,
    MapPin, Star, Shield, Clock, Award, CheckCircle,
    Calendar, MessageSquare, Share2, Flag, Phone, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function CustomizeProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'colors' | 'text'>('colors');

    const [customization, setCustomization] = useState({
        primaryColor: '#102A43',
        accentColor: '#F4B740',
        backgroundColor: '#F5F7FB',
        textColor: '#1F2933',
        headingFont: 'serif',
        bodyFont: 'sans'
    });

    const [profileData, setProfileData] = useState({
        fullName: '',
        bio: '',
        tagline: '',
        city: 'City',
        state: 'State',
        photoUrl: '',
        services: [] as string[]
    });

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                const docRef = doc(db, 'notaries', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.customization) {
                        setCustomization({ ...customization, ...data.customization });
                    }
                    setProfileData({
                        fullName: data.fullName || 'Your Name',
                        bio: data.bio || '',
                        tagline: data.tagline || 'Professional Notary Services',
                        city: data.city || 'City',
                        state: data.state || 'State',
                        photoUrl: data.photoUrl || '',
                        services: data.services || []
                    });
                }
            }
        };
        loadData();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const docRef = doc(db, 'notaries', user.uid);
            await updateDoc(docRef, {
                customization,
                tagline: profileData.tagline
            });
            alert('Profile customization saved!');
        } catch (error) {
            console.error('Error saving customization:', error);
            alert('Failed to save customization');
        } finally {
            setLoading(false);
        }
    };

    const presetThemes = [
        { name: 'Professional Navy', primary: '#102A43', accent: '#F4B740', bg: '#F5F7FB', text: '#1F2933' },
        { name: 'Modern Green', primary: '#064E3B', accent: '#10B981', bg: '#ECFDF5', text: '#1F2937' },
        { name: 'Elegant Purple', primary: '#4C1D95', accent: '#8B5CF6', bg: '#F5F3FF', text: '#1F2937' },
        { name: 'Bold Red', primary: '#7F1D1D', accent: '#EF4444', bg: '#FEF2F2', text: '#1F2937' },
        { name: 'Dark Mode', primary: '#1E293B', accent: '#3B82F6', bg: '#0F172A', text: '#F8FAFC' }
    ];

    const applyTheme = (theme: typeof presetThemes[0]) => {
        setCustomization({
            ...customization,
            primaryColor: theme.primary,
            accentColor: theme.accent,
            backgroundColor: theme.bg,
            textColor: theme.text
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
                <div className="max-w-[1800px] mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.open(`/profile/${user?.uid}`, '_blank')}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-text font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Side by Side */}
            <div className="max-w-[1800px] mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Sidebar - Fixed Controls */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-24 h-[calc(100vh-120px)] flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-bold text-lg text-text">Customize Your Page</h2>
                                <p className="text-sm text-text-secondary mt-1">Design your public profile</p>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab('colors')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-colors ${activeTab === 'colors'
                                        ? 'bg-primary text-white border-b-2 border-primary'
                                        : 'text-text-secondary hover:bg-slate-50'
                                        }`}
                                >
                                    <Palette className="w-4 h-4" />
                                    Colors
                                </button>
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-colors ${activeTab === 'text'
                                        ? 'bg-primary text-white border-b-2 border-primary'
                                        : 'text-text-secondary hover:bg-slate-50'
                                        }`}
                                >
                                    <Type className="w-4 h-4" />
                                    Text
                                </button>
                            </div>

                            {/* Tab Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {activeTab === 'colors' && (
                                    <div className="space-y-6">
                                        {/* Color Pickers */}
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-2">Primary Color</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={customization.primaryColor}
                                                    onChange={(e) => setCustomization({ ...customization, primaryColor: e.target.value })}
                                                    className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={customization.primaryColor}
                                                    onChange={(e) => setCustomization({ ...customization, primaryColor: e.target.value })}
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text mb-2">Accent Color</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={customization.accentColor}
                                                    onChange={(e) => setCustomization({ ...customization, accentColor: e.target.value })}
                                                    className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={customization.accentColor}
                                                    onChange={(e) => setCustomization({ ...customization, accentColor: e.target.value })}
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text mb-2">Background Color</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={customization.backgroundColor}
                                                    onChange={(e) => setCustomization({ ...customization, backgroundColor: e.target.value })}
                                                    className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={customization.backgroundColor}
                                                    onChange={(e) => setCustomization({ ...customization, backgroundColor: e.target.value })}
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text mb-2">Text Color</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={customization.textColor}
                                                    onChange={(e) => setCustomization({ ...customization, textColor: e.target.value })}
                                                    className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={customization.textColor}
                                                    onChange={(e) => setCustomization({ ...customization, textColor: e.target.value })}
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm uppercase"
                                                />
                                            </div>
                                        </div>

                                        {/* Preset Themes */}
                                        <div className="pt-4 border-t border-slate-200">
                                            <label className="block text-sm font-medium text-text mb-3">Preset Themes</label>
                                            <div className="space-y-2">
                                                {presetThemes.map((theme, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => applyTheme(theme)}
                                                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-slate-50 transition-colors text-left"
                                                    >
                                                        <div className="flex gap-1">
                                                            <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.primary }} />
                                                            <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.accent }} />
                                                        </div>
                                                        <span className="text-sm font-medium text-text">{theme.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'text' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-2">Tagline</label>
                                            <input
                                                type="text"
                                                value={profileData.tagline}
                                                onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="Professional Notary Services"
                                            />
                                            <p className="text-xs text-text-secondary mt-1">Appears below your name on your profile</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text mb-2">Heading Font</label>
                                            <select
                                                value={customization.headingFont}
                                                onChange={(e) => setCustomization({ ...customization, headingFont: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                <option value="serif">Serif (Classic)</option>
                                                <option value="sans">Sans-serif (Modern)</option>
                                                <option value="mono">Monospace (Tech)</option>
                                            </select>
                                            <p className="text-xs text-text-secondary mt-1">Font style for your name and headings</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Scrollable Live Preview */}
                    <div className="md:col-span-8 lg:col-span-9">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                                <p className="text-sm font-medium text-text-secondary">Live Preview</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs text-text-secondary">Auto-updating</span>
                                </div>
                            </div>

                            {/* Preview Content - Scrollable */}
                            <div className="p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-200px)]" style={{ backgroundColor: customization.backgroundColor, fontFamily: customization.bodyFont === 'serif' ? 'serif' : 'sans-serif' }}>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Sidebar */}
                                    <div className="lg:col-span-4">
                                        <div className="space-y-6">
                                            {/* Profile Card */}
                                            <div className="rounded-2xl p-6 text-white shadow-xl" style={{ backgroundColor: customization.primaryColor }}>
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-24 h-24 rounded-full border-4 border-white/10 mb-4 overflow-hidden bg-white">
                                                        {profileData.photoUrl ? (
                                                            <img src={profileData.photoUrl} alt={profileData.fullName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center font-bold text-2xl" style={{ color: customization.primaryColor }}>
                                                                {profileData.fullName?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h2 className="text-xl font-bold mb-1" style={{ fontFamily: customization.headingFont === 'serif' ? 'serif' : 'sans-serif' }}>{profileData.fullName}</h2>
                                                    <div className="flex items-center gap-1 text-white/80 text-sm mb-3">
                                                        <MapPin className="w-3 h-3" />
                                                        {profileData.city}, {profileData.state}
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-6">
                                                        <div className="flex" style={{ color: customization.accentColor }}>
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span className="ml-1 font-bold text-white">4.8</span>
                                                        </div>
                                                        <span className="text-white/60 text-sm">(24 reviews)</span>
                                                    </div>

                                                    <button
                                                        className="w-full py-3 font-bold rounded-lg mb-3 transition-colors"
                                                        style={{ backgroundColor: customization.accentColor, color: customization.primaryColor }}
                                                    >
                                                        Book Appointment
                                                    </button>
                                                    <button
                                                        className="w-full py-3 border border-white/20 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                                                    >
                                                        Message
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Navigation Preview */}
                                            <nav className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hidden lg:block">
                                                {['Overview', 'Services & Fees', 'Availability', 'Coverage Area', 'Credentials', 'Reviews', 'FAQs'].map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium border-l-4 ${i === 0 ? 'bg-slate-50' : ''}`}
                                                        style={{
                                                            borderColor: i === 0 ? customization.accentColor : 'transparent',
                                                            color: i === 0 ? customization.primaryColor : '#6B7280'
                                                        }}
                                                    >
                                                        <div className="w-4 h-4 rounded-full bg-slate-200" />
                                                        {item}
                                                    </div>
                                                ))}
                                            </nav>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="lg:col-span-8 space-y-8">
                                        {/* Overview */}
                                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                            <h2 className="text-2xl font-bold mb-4" style={{ color: customization.primaryColor, fontFamily: customization.headingFont === 'serif' ? 'serif' : 'sans-serif' }}>Overview</h2>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium" style={{ color: customization.primaryColor }}>Mobile Notary</span>
                                                <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium" style={{ color: customization.primaryColor }}>Spanish-speaking</span>
                                            </div>
                                            <p className="leading-relaxed mb-8" style={{ color: customization.textColor }}>
                                                {profileData.bio || "Experienced notary public providing prompt and reliable mobile notary services."}
                                            </p>
                                            <div className="grid grid-cols-3 gap-6 border-t border-slate-200 pt-6">
                                                <div>
                                                    <p className="text-sm text-slate-500">Avg. Response</p>
                                                    <p className="font-bold" style={{ color: customization.primaryColor }}>20 mins</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Signings</p>
                                                    <p className="font-bold" style={{ color: customization.primaryColor }}>235+</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Experience</p>
                                                    <p className="font-bold" style={{ color: customization.primaryColor }}>5 Years</p>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Why Choose Me */}
                                        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                            <h2 className="text-2xl font-bold mb-6" style={{ color: customization.primaryColor, fontFamily: customization.headingFont === 'serif' ? 'serif' : 'sans-serif' }}>Why Clients Choose Me</h2>
                                            <ul className="space-y-4">
                                                {[
                                                    'Certified & Insured for your peace of mind',
                                                    'Evening & Weekend Availability',
                                                    'Same-day appointments often available'
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${customization.accentColor}33` }}>
                                                            <CheckCircle className="w-3 h-3" style={{ color: customization.accentColor }} />
                                                        </div>
                                                        <span className="font-medium" style={{ color: customization.textColor }}>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        {/* Services */}
                                        <section>
                                            <h2 className="text-2xl font-bold mb-6" style={{ color: customization.primaryColor, fontFamily: customization.headingFont === 'serif' ? 'serif' : 'sans-serif' }}>Services & Fees</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { name: 'General Notarization', price: '$40' },
                                                    { name: 'Loan Signing', price: '$150' }
                                                ].map((service, i) => (
                                                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="font-bold" style={{ color: customization.primaryColor }}>{service.name}</h3>
                                                        </div>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-bold" style={{ color: customization.primaryColor }}>{service.price}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
