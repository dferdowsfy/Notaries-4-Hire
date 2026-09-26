import React, { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    notaryName: string;
    notaryEmail?: string;
}

export default function ContactModal({ isOpen, onClose, notaryName, notaryEmail }: ContactModalProps) {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    useEffect(() => {
        if (!isOpen) {
            setSent(false);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!notaryEmail) {
            setError('This professional has not provided an email address.');
            return;
        }
        const subject = encodeURIComponent(`Service request from ${formData.name}`);
        const body = encodeURIComponent(`Hello ${notaryName},\n\n${formData.message}\n\nFrom: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\n\nSent via Notaries4Hire`);
        window.location.href = `mailto:${notaryEmail}?subject=${subject}&body=${body}`;
        setSent(true);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-secondary hover:text-text transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {sent ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-serif text-text mb-2">Email draft opened</h2>
                            <p className="text-text-secondary">
                                Please press Send in your email app to contact {notaryName}.
                            </p>
                            <button type="button" onClick={onClose} className="mt-5 text-primary underline">Close</button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-serif text-text mb-2">Contact {notaryName}</h2>
                            <p className="text-text-secondary mb-6">Fill out the form below to request services.</p>
                            {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none"
                                        placeholder="(555) 123-4567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Message</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none resize-none"
                                        placeholder="I need a document notarized..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium transition-colors mt-2"
                                >
                                    Open Email Draft
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
