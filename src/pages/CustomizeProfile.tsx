import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, Palette, Type, Layout, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function CustomizeProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'colors' | 'text' | 'layout'>('colors');

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
        tagline: ''
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
                        tagline: data.tagline || 'Professional Notary Services'
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
            <div className="bg-white border-b border-slate-200 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
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

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Controls */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-8">
                            {/* Tabs */}
                            <div className="flex border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab('colors')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-colors ${activeTab === 'colors' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-slate-50'
                                        }`}
                                >
                                    <Palette className="w-4 h-4" />
                                    Colors
                                </button>
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-colors ${activeTab === 'text' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-slate-50'
                                        }`}
                                >
                                    <Type className="w-4 h-4" />
                                    Text
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {activeTab === 'colors' && (
                                    <>
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
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm"
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
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 font-mono text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-200">
                                            <label className="block text-sm font-medium text-text mb-3">Preset Themes</label>
                                            <div className="space-y-2">
                                                {presetThemes.map((theme, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => applyTheme(theme)}
                                                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary transition-colors"
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
                                    </>
                                )}

                                {activeTab === 'text' && (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Live Preview */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                                <p className="text-sm text-text-secondary">Live Preview</p>
                            </div>
                            <div className="p-8" style={{ backgroundColor: customization.backgroundColor }}>
                                {/* Preview Content */}
                                <div className="text-center mb-8">
                                    <h1
                                        className={`text-4xl mb-2 font-${customization.headingFont}`}
                                        style={{ color: customization.textColor }}
                                    >
                                        {profileData.fullName || 'Your Name'}
                                    </h1>
                                    <p className="text-lg mb-6" style={{ color: `${customization.textColor}99` }}>
                                        {profileData.tagline}
                                    </p>
                                    <button
                                        className="px-8 py-3 rounded-full font-medium"
                                        style={{ backgroundColor: customization.primaryColor, color: '#FFFFFF' }}
                                    >
                                        Contact Me
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="p-4 rounded-lg border" style={{ borderColor: `${customization.primaryColor}40` }}>
                                        <h3 className="font-bold mb-2" style={{ color: customization.textColor }}>About</h3>
                                        <p className="text-sm" style={{ color: `${customization.textColor}99` }}>
                                            {profileData.bio || 'Your bio will appear here...'}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${customization.accentColor}20` }}>
                                        <h3 className="font-bold mb-2" style={{ color: customization.textColor }}>Services</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-medium"
                                                style={{ backgroundColor: customization.accentColor, color: '#FFFFFF' }}
                                            >
                                                Mobile Notary
                                            </span>
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-medium"
                                                style={{ backgroundColor: customization.accentColor, color: '#FFFFFF' }}
                                            >
                                                Loan Signing
                                            </span>
                                        </div>
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
