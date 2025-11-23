import React from 'react';
import { X, Mail, MessageSquare, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
    title?: string;
    text?: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl, title = "Check this out", text = "I found this great service!" }: ShareModalProps) {
    if (!isOpen) return null;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: 'Email',
            icon: Mail,
            url: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`,
            color: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        },
        {
            name: 'SMS',
            icon: MessageSquare,
            url: `sms:?body=${encodedText}%20${encodedUrl}`,
            color: 'bg-green-100 text-green-600 hover:bg-green-200'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
            color: 'bg-sky-100 text-sky-600 hover:bg-sky-200'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface w-full max-w-sm rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-secondary hover:text-text transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h3 className="text-xl font-serif text-text mb-2">Share Link</h3>
                    <p className="text-sm text-text-secondary mb-6">Share this link with your network.</p>

                    <div className="grid grid-cols-2 gap-4">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${link.color}`}
                            >
                                <link.icon className="w-6 h-6 mb-2" />
                                <span className="text-sm font-medium">{link.name}</span>
                            </a>
                        ))}
                        <button
                            onClick={copyToClipboard}
                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            <LinkIcon className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">Copy Link</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
