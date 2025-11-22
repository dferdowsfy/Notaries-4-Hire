import React, { useState, useEffect } from 'react';
import { X, CreditCard, Shield, Check } from 'lucide-react';
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

    const handleUpgrade = async (newPlan: string) => {
        if (!user) return;
        setLoading(true);
        // In a real app, this would trigger a Stripe checkout session
        try {
            const docRef = doc(db, 'notaries', user.uid);
            await updateDoc(docRef, { subscriptionPlan: newPlan });
            setPlan(newPlan);
            alert(`Successfully upgraded to ${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)} plan!`);
        } catch (error) {
            console.error("Error updating plan:", error);
            alert("Failed to update plan");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

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
                    <h2 className="text-2xl font-serif text-text mb-6">Account Settings</h2>

                    {/* Current Plan */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-text mb-4">Subscription Plan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Basic Plan */}
                            <div className={`p-6 rounded-xl border-2 transition-all ${plan === 'basic' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/50'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-text">Basic</h4>
                                        <p className="text-2xl font-bold text-text mt-1">Free</p>
                                    </div>
                                    {plan === 'basic' && <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">Current</div>}
                                </div>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-sm text-text-secondary"><Check className="w-4 h-4 text-green-500" /> Basic Profile Listing</li>
                                    <li className="flex items-center gap-2 text-sm text-text-secondary"><Check className="w-4 h-4 text-green-500" /> Standard Search Visibility</li>
                                </ul>
                                {plan !== 'basic' && (
                                    <button
                                        onClick={() => handleUpgrade('basic')}
                                        disabled={loading}
                                        className="w-full py-2 border border-slate-200 text-text font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Downgrade
                                    </button>
                                )}
                            </div>

                            {/* Pro Plan */}
                            <div className={`p-6 rounded-xl border-2 transition-all ${plan === 'pro' ? 'border-accent bg-accent/5' : 'border-slate-100 hover:border-accent/50'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-text">Pro</h4>
                                        <p className="text-2xl font-bold text-text mt-1">$19<span className="text-sm text-text-secondary font-normal">/mo</span></p>
                                    </div>
                                    {plan === 'pro' && <div className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">Current</div>}
                                </div>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-sm text-text-secondary"><Check className="w-4 h-4 text-green-500" /> Featured Listing</li>
                                    <li className="flex items-center gap-2 text-sm text-text-secondary"><Check className="w-4 h-4 text-green-500" /> Priority Search Ranking</li>
                                    <li className="flex items-center gap-2 text-sm text-text-secondary"><Check className="w-4 h-4 text-green-500" /> Verified Badge</li>
                                </ul>
                                {plan !== 'pro' && (
                                    <button
                                        onClick={() => handleUpgrade('pro')}
                                        disabled={loading}
                                        className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors shadow-lg shadow-accent/20"
                                    >
                                        Upgrade to Pro
                                    </button>
                                )}
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
                            <button className="text-primary font-medium hover:underline text-sm">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
