import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    notaryName: string;
}

export default function ContactModal({ isOpen, onClose, notaryName }: ContactModalProps) {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate sending email
        setTimeout(() => {
            setLoading(false);
            setSent(true);
            setTimeout(() => {
                setSent(false);
                setFormData({ name: '', email: '', phone: '', message: '' });
                onClose();
            }, 2000);
        }, 1500);
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
                            <h2 className="text-2xl font-serif text-text mb-2">Message Sent!</h2>
                            <p className="text-text-secondary">
                                Your message has been sent to {notaryName}. They will contact you shortly.
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-serif text-text mb-2">Contact {notaryName}</h2>
                            <p className="text-text-secondary mb-6">Fill out the form below to request services.</p>

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
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 mt-2"
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
