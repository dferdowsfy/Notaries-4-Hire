import React, { useEffect, useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    notaryName: string;
    notaryId: string;
}

export default function ReportModal({ isOpen, onClose, notaryName, notaryId }: ReportModalProps) {
    const [reason, setReason] = useState('Inappropriate Content');
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setReason('Inappropriate Content');
            setDetails('');
            setError('');
            setSubmitted(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await addDoc(collection(db, 'reports'), {
                notaryId,
                notaryName: notaryName.slice(0, 200),
                reason,
                details: details.trim(),
                status: 'open',
                createdAt: serverTimestamp()
            });
            setSubmitted(true);
        } catch (cause) {
            console.error('Unable to submit profile report', cause);
            setError('Your report could not be submitted. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-600">
                        <Flag className="w-5 h-5" />
                        <h2 className="text-xl font-bold text-slate-900">Report Profile</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {submitted ? <div className="p-6 text-center"><h3 className="text-lg font-semibold text-slate-900">Report received</h3><p className="mt-2 text-slate-600">The platform owner can review it in the owner dashboard.</p><button type="button" onClick={onClose} className="mt-5 px-4 py-2 rounded-lg bg-primary text-white">Close</button></div> : <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Report</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        >
                            <option>Inappropriate Content</option>
                            <option>Fake Profile / Impersonation</option>
                            <option>Fraudulent Activity</option>
                            <option>Spam</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Additional Details</label>
                        <textarea
                            required
                            minLength={10}
                            maxLength={3000}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none h-32 resize-none"
                            placeholder="Please provide specific details about your concern..."
                        />
                    </div>

                    <div className="bg-red-50 p-3 rounded-lg flex gap-3 items-start">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">
                            The platform owner will review this report.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Submitting…' : 'Submit Report'}
                        </button>
                    </div>
                </form>}
            </div>
        </div>
    );
}
