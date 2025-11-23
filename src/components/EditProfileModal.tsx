import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Camera, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { US_STATES } from '../data/states';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Avatar generation
    const generateSeeds = () => Array.from({ length: 6 }, () => Math.random().toString(36).substring(7));
    const [avatarSeeds, setAvatarSeeds] = useState<string[]>([]);

    useEffect(() => {
        setAvatarSeeds(generateSeeds());
    }, []);

    const [formData, setFormData] = useState({
        fullName: '',
        city: '',
        state: '',
        bio: '',
        photoUrl: '',
        services: [] as string[]
    });

    // Load user data
    useEffect(() => {
        const loadData = async () => {
            if (user && isOpen) {
                const docRef = doc(db, 'notaries', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        fullName: data.fullName || '',
                        city: data.city || '',
                        state: data.state || '',
                        bio: data.bio || '',
                        photoUrl: data.photoUrl || '',
                        services: data.services || []
                    });
                }
            }
        };
        loadData();
    }, [user, isOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && user) {
            setUploading(true);
            try {
                const file = e.target.files[0];
                const storageRef = ref(storage, `profile_photos/${user.uid}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                setFormData(prev => ({ ...prev, photoUrl: url }));
            } catch (error) {
                console.error("Error uploading photo:", error);
                alert("Failed to upload photo. Please try again.");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const docRef = doc(db, 'notaries', user.uid);
            await updateDoc(docRef, {
                fullName: formData.fullName,
                city: formData.city,
                state: formData.state,
                bio: formData.bio,
                photoUrl: formData.photoUrl,
                services: formData.services
            });
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const toggleService = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    if (!isOpen) return null;

    const availableServices = [
        'Mobile Notary', 'Loan Signing', 'Remote Online Notary',
        'Apostille Services', 'Wedding Officiant', 'Fingerprinting'
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-secondary hover:text-text transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-serif text-text mb-6">Edit Profile</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Photo Upload */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 group-hover:border-primary transition-colors">
                                    {formData.photoUrl ? (
                                        <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-8 h-8 text-text-secondary" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-full">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <span className="text-sm text-primary font-medium mt-2 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
                                Upload Photo
                            </span>

                            {/* Avatar Selection */}
                            <div className="mt-6 w-full">
                                <div className="flex items-center justify-between mb-3 px-2">
                                    <label className="text-sm font-medium text-text-secondary">Or choose an avatar</label>
                                    <button
                                        type="button"
                                        onClick={() => setAvatarSeeds(generateSeeds())}
                                        className="text-xs text-primary flex items-center gap-1 hover:underline"
                                    >
                                        <RefreshCw className="w-3 h-3" /> Refresh
                                    </button>
                                </div>
                                <div className="flex gap-3 justify-center flex-wrap">
                                    {avatarSeeds.map(seed => {
                                        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                                        const isSelected = formData.photoUrl === avatarUrl;
                                        return (
                                            <button
                                                key={seed}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, photoUrl: avatarUrl })}
                                                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${isSelected ? 'border-primary scale-110 ring-2 ring-primary/20' : 'border-slate-200 hover:border-primary hover:scale-105'
                                                    }`}
                                            >
                                                <img
                                                    src={avatarUrl}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">State</label>
                                    <select
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none"
                                    >
                                        <option value="">Select</option>
                                        {US_STATES.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text mb-1">Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none resize-none"
                                placeholder="Tell clients about your experience..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text mb-3">Services Offered</label>
                            <div className="grid grid-cols-2 gap-3">
                                {availableServices.map(service => (
                                    <label key={service} className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.services.includes(service)}
                                            onChange={() => toggleService(service)}
                                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                                        />
                                        <span className="text-sm text-text">{service}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-text-secondary hover:text-text font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary-hover text-white px-8 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
