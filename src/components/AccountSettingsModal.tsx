import React, { useState, useEffect } from 'react';
import { X, CreditCard, Shield, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface AccountSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AccountSettingsModal({ isOpen, onClose }: AccountSettingsModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState('basic');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('basic');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (user && isOpen) {
                const docRef = doc(db, 'notaries', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPlan(docSnap.data().subscriptionPlan || 'basic');
                }
            }
        };
        loadData();
    }, [user, isOpen]);

    const handlePlanClick = (newPlan: 'basic' | 'pro') => {
        if (newPlan === plan) return;
        setSelectedPlan(newPlan);
        setShowConfirmation(true);
    };

    const handleConfirmUpgrade = async () => {
        if (!user) return;
        setLoading(true);

        // In production, this would create a Stripe checkout session
        // For now, we'll simulate the upgrade
        try {
            const docRef = doc(db, 'notaries', user.uid);
            await updateDoc(docRef, {
                subscriptionPlan: selectedPlan,
                subscriptionStartDate: new Date().toISOString()
            });
            setPlan(selectedPlan);
            setShowConfirmation(false);
            alert(`Successfully ${selectedPlan === 'pro' ? 'upgraded to' : 'downgraded to'} ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan!`);
        } catch (error) {
            console.error("Error updating plan:", error);
            alert("Failed to update plan");
        } finally {
            setLoading(false);
        }
    };

    const getNextBillingDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-surface w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-text-secondary hover:text-text transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        <h2 className="text-2xl font-serif text-text mb-6">Account Settings</h2>

                        {/* Current Plan */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-text mb-4">Subscription Plan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Basic Plan */}
                                <div
                                    onClick={() => handlePlanClick('basic')}
                                    className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${plan === 'basic'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-slate-100 hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-text">Basic</h4>
                                            <p className="text-2xl font-bold text-text mt-1">Free</p>
                                        </div>
                                        {plan === 'basic' && (
                                            <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                                                Current
                                            </div>
                                        )}
                                    </div>
                                    <ul className="space-y-2 mb-6">
                                        <li className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Check className="w-4 h-4 text-green-500" /> Basic Profile Listing
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Check className="w-4 h-4 text-green-500" /> Standard Search Visibility
                                        </li>
                                    </ul>
                                </div>

                                {/* Pro Plan */}
                                <div
                                    onClick={() => handlePlanClick('pro')}
                                    className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${plan === 'pro'
                                        ? 'border-accent bg-accent/5'
                                        : 'border-slate-100 hover:border-accent/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-text">Pro</h4>
                                            <p className="text-2xl font-bold text-text mt-1">
                                                $19<span className="text-sm text-text-secondary font-normal">/mo</span>
                                            </p>
                                        </div>
                                        {plan === 'pro' && (
                                            <div className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                                                Current
                                            </div>
                                        )}
                                    </div>
                                    <ul className="space-y-2 mb-6">
                                        <li className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Check className="w-4 h-4 text-green-500" /> Featured Listing
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Check className="w-4 h-4 text-green-500" /> Priority Search Ranking
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-text-secondary">
                                            <Check className="w-4 h-4 text-green-500" /> Verified Badge
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
                            <h3 className="text-lg font-bold text-text mb-4">Payment Method</h3>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-text">•••• •••• •••• 4242</p>
                                        <p className="text-xs text-text-secondary">Expires 12/25</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    className="text-primary font-medium hover:underline text-sm"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold text-text">
                                {selectedPlan === 'pro' ? 'Upgrade to Pro' : 'Downgrade to Basic'}
                            </h3>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Plan</span>
                                <span className="font-bold text-text capitalize">{selectedPlan}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Amount</span>
                                <span className="font-bold text-text">
                                    {selectedPlan === 'pro' ? '$19.00/month' : 'Free'}
                                </span>
                            </div>
                            {selectedPlan === 'pro' && (
                                <>
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between text-sm">
                                        <span className="text-text-secondary">First charge</span>
                                        <span className="font-medium text-text">Today</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Next billing date</span>
                                        <span className="font-medium text-text">{getNextBillingDate()}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <p className="text-sm text-text-secondary mb-6">
                            {selectedPlan === 'pro'
                                ? 'You will be charged $19.00 today and then $19.00 on the same day each month. You can cancel anytime.'
                                : 'Your Pro benefits will remain active until the end of your current billing period.'
                            }
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                disabled={loading}
                                className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 text-text font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmUpgrade}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors shadow-lg shadow-accent/20 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Payment Update Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-text mb-6">Update Payment Method</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Simulate update
                            alert("Payment method updated successfully!");
                            setIsPaymentModalOpen(false);
                        }}>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1">Expiry</label>
                                        <input type="text" placeholder="MM/YY" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1">CVC</label>
                                        <input type="text" placeholder="123" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary outline-none" required />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 px-6 py-2 border border-slate-200 dark:border-slate-700 text-text font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-6 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
