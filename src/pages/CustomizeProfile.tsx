import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function CustomizeProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [customization, setCustomization] = useState({
        primaryColor: '#0E2A57',
        accentColor: '#D4AF37',
        backgroundColor: '#FFFFFF',
        textColor: '#1E293B',
        headingFont: 'serif',
        bodyFont: 'sans'
    });

    const [profileData, setProfileData] = useState({
        fullName: '',
        bio: '',
        tagline: '',
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
                        fullName: data.fullName || '',
                        bio: data.bio || '',
                        tagline: data.tagline || 'Professional Notary Services',
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
        { name: 'Professional Blue', primary: '#0E2A57', accent: '#D4AF37', bg: '#FFFFFF', text: '#1E293B' },
        { name: 'Modern Green', primary: '#059669', accent: '#10B981', bg: '#FFFFFF', text: '#1F2937' },
        { name: 'Elegant Purple', primary: '#7C3AED', accent: '#A78BFA', bg: '#FFFFFF', text: '#1F2937' },
        { name: 'Bold Red', primary: '#DC2626', accent: '#F87171', bg: '#FFFFFF', text: '#1F2937' },
        { name: 'Dark Mode', primary: '#3B82F6', accent: '#60A5FA', bg: '#1F2937', text: '#F9FAFB' }
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - Controls */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-bold text-lg text-text">Customize Your Page</h2>
                                <p className="text-sm text-text-secondary mt-1">Design your public profile</p>
                            </div>

                            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {/* Colors Section */}
                                <div>
                                    <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        Colors
                                    </h3>

                                    <div className="space-y-4">
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
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm"
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
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm"
                                                />
                                            </div>
                                        </div>
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
                                                className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary transition-colors text-left"
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

                                {/* Text Section */}
                                <div className="pt-4 border-t border-slate-200">
                                    <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                                        Text
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-2">Tagline</label>
                                            <input
                                                type="text"
                                                value={profileData.tagline}
                                                onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                                placeholder="Professional Notary Services"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text mb-2">Heading Font</label>
                                            <select
                                                value={customization.headingFont}
                                                onChange={(e) => setCustomization({ ...customization, headingFont: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200"
                                            >
                                                <option value="serif">Serif (Classic)</option>
                                                <option value="sans">Sans-serif (Modern)</option>
                                                <option value="mono">Monospace (Tech)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Live Preview */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                                <p className="text-sm font-medium text-text-secondary">Live Preview</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs text-text-secondary">Auto-updating</span>
                                </div>
                            </div>

                            {/* Preview Content */}
                            <div className="p-8 min-h-[800px]" style={{ backgroundColor: customization.backgroundColor }}>
                                {/* Hero Section */}
                                <div className="text-center mb-12 pb-8 border-b" style={{ borderColor: `${customization.primaryColor}20` }}>
                                    <h1
                                        className={`text-5xl mb-3 font-${customization.headingFont}`}
                                        style={{ color: customization.textColor }}
                                    >
                                        {profileData.fullName || 'Your Name'}
                                    </h1>
                                    <p className="text-xl mb-6" style={{ color: `${customization.textColor}99` }}>
                                        {profileData.tagline}
                                    </p>
                                    <button
                                        className="px-8 py-3 rounded-full font-medium shadow-lg"
                                        style={{ backgroundColor: customization.primaryColor, color: '#FFFFFF' }}
                                    >
                                        Contact Me
                                    </button>
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {/* About */}
                                    <div className="p-6 rounded-xl border" style={{ borderColor: `${customization.primaryColor}40` }}>
                                        <h3 className="font-bold text-xl mb-3" style={{ color: customization.textColor }}>About</h3>
                                        <p className="text-sm leading-relaxed" style={{ color: `${customization.textColor}99` }}>
                                            {profileData.bio || 'Your professional bio will appear here. Share your experience, certifications, and what makes you stand out as a notary professional.'}
                                        </p>
                                    </div>

                                    {/* Services */}
                                    <div className="p-6 rounded-xl" style={{ backgroundColor: `${customization.accentColor}20` }}>
                                        <h3 className="font-bold text-xl mb-4" style={{ color: customization.textColor }}>Services</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.services && profileData.services.length > 0 ? (
                                                profileData.services.map((service, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                                                        style={{ backgroundColor: customization.accentColor, color: '#FFFFFF' }}
                                                    >
                                                        {service}
                                                    </span>
                                                ))
                                            ) : (
                                                <>
                                                    <span className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: customization.accentColor, color: '#FFFFFF' }}>
                                                        Mobile Notary
                                                    </span>
                                                    <span className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: customization.accentColor, color: '#FFFFFF' }}>
                                                        Loan Signing
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Why Choose Me Section */}
                                <div className="mb-8 p-8 rounded-xl" style={{ backgroundColor: `${customization.primaryColor}05` }}>
                                    <h3 className="font-bold text-2xl mb-6 text-center" style={{ color: customization.textColor }}>Why Choose Me</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl" style={{ backgroundColor: `${customization.primaryColor}20`, color: customization.primaryColor }}>
                                                ✓
                                            </div>
                                            <h4 className="font-bold mb-2" style={{ color: customization.textColor }}>Certified Professional</h4>
                                            <p className="text-sm" style={{ color: `${customization.textColor}80` }}>Licensed and insured notary</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl" style={{ backgroundColor: `${customization.accentColor}20`, color: customization.accentColor }}>
                                                ⚡
                                            </div>
                                            <h4 className="font-bold mb-2" style={{ color: customization.textColor }}>Fast Service</h4>
                                            <p className="text-sm" style={{ color: `${customization.textColor}80` }}>Same-day appointments available</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl" style={{ backgroundColor: `${customization.primaryColor}20`, color: customization.primaryColor }}>
                                                ★
                                            </div>
                                            <h4 className="font-bold mb-2" style={{ color: customization.textColor }}>5-Star Rated</h4>
                                            <p className="text-sm" style={{ color: `${customization.textColor}80` }}>Trusted by hundreds of clients</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial Preview */}
                                <div className="p-6 rounded-xl border" style={{ borderColor: `${customization.primaryColor}20` }}>
                                    <h3 className="font-bold text-xl mb-4" style={{ color: customization.textColor }}>Client Testimonials</h3>
                                    <div className="italic" style={{ color: `${customization.textColor}99` }}>
                                        "Excellent service! Professional, punctual, and very knowledgeable. Highly recommend!"
                                    </div>
                                    <div className="mt-3 flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <span key={i} style={{ color: customization.accentColor }}>★</span>
                                        ))}
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
