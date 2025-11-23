import React, { useState, useRef } from 'react';
import { X, Upload, User, Image as ImageIcon } from 'lucide-react';

interface PhotoSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string, file?: File) => void;
}

export default function PhotoSelectionModal({ isOpen, onClose, onSelect }: PhotoSelectionModalProps) {
    const [activeTab, setActiveTab] = useState<'avatars' | 'upload'>('avatars');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    if (!isOpen) return null;

    // Local avatars generated
    const avatars = [
        // Male avatars - assuming the file names from the generation step
        { id: 'm1', url: '/avatars/avatar_male_1.png', gender: 'male' },
        { id: 'm2', url: '/avatars/avatar_male_2.png', gender: 'male' },
        { id: 'm3', url: '/avatars/avatar_male_3.png', gender: 'male' },
        // Female avatars
        { id: 'f1', url: '/avatars/avatar_female_1.png', gender: 'female' },
        { id: 'f2', url: '/avatars/avatar_female_2.png', gender: 'female' },
        { id: 'f3', url: '/avatars/avatar_female_3.png', gender: 'female' },
    ];

    const filteredAvatars = avatars.filter(avatar => avatar.gender === gender);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        const url = URL.createObjectURL(file);
        onSelect(url, file);
        onClose();
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-serif text-text">Update Profile Photo</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('avatars')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'avatars'
                                ? 'text-primary border-b-2 border-primary bg-primary/5'
                                : 'text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Choose Avatar
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'upload'
                                ? 'text-primary border-b-2 border-primary bg-primary/5'
                                : 'text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Upload className="w-4 h-4" />
                        Upload Image
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {activeTab === 'avatars' ? (
                        <div className="space-y-6">
                            {/* Gender Toggle */}
                            <div className="flex justify-center">
                                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg inline-flex">
                                    <button
                                        onClick={() => setGender('male')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${gender === 'male' ? 'bg-white dark:bg-surface shadow-sm text-text' : 'text-text-secondary hover:text-text'
                                            }`}
                                    >
                                        Male
                                    </button>
                                    <button
                                        onClick={() => setGender('female')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${gender === 'female' ? 'bg-white dark:bg-surface shadow-sm text-text' : 'text-text-secondary hover:text-text'
                                            }`}
                                    >
                                        Female
                                    </button>
                                </div>
                            </div>

                            {/* Avatar Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {filteredAvatars.map(avatar => (
                                    <button
                                        key={avatar.id}
                                        onClick={() => {
                                            onSelect(avatar.url);
                                            onClose();
                                        }}
                                        className="aspect-square rounded-full border-2 border-slate-100 dark:border-slate-700 hover:border-primary hover:scale-105 transition-all overflow-hidden bg-slate-50 dark:bg-slate-800"
                                    >
                                        <img
                                            src={avatar.url}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-700'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <ImageIcon className="w-8 h-8 text-text-secondary" />
                            </div>
                            <p className="text-lg font-medium text-text mb-2">Drag & Drop your image here</p>
                            <p className="text-sm text-text-secondary mb-6">Supports PNG, JPG, SVG</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                            >
                                Browse Files
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/png, image/jpeg, image/svg+xml"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
