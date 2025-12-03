
import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { US_STATES } from '../data/states';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { useModal } from '../context/ModalContext';

// Initialize Stripe with a test key - REPLACE THIS WITH YOUR ACTUAL PUBLISHABLE KEY
const stripePromise = loadStripe('pk_live_51Pyn6MJcVbd9A9Ta9nWdBpkzcMYaQgZzWzBa03UmX85FO5PDuW1mNJ76YN8Pd91uOLrUhrTQofwQ7PLttuhvn04Q00BTqo54cH');

interface GetListedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    { id: 1, label: 'ACCOUNT' },
    { id: 2, label: 'PROFILE' },
    { id: 3, label: 'SERVICES' },
    { id: 4, label: 'PAYMENT' },
];

export default function GetListedModal({ isOpen, onClose }: GetListedModalProps) {
    const { getListedRole } = useModal();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setError('');
        }
    }, [isOpen]);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        city: '',
        state: '',
        bio: '',
        services: [] as string[]
    });

    if (!isOpen) return null;

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handlePaymentSuccess = async (paymentData: { paymentMethodId: string, couponCode?: string }) => {
        await handleSubmit(paymentData);
    };

    const handlePaymentError = (errorMessage: string) => {
        setError(errorMessage);
    };

    const handleSubmit = async (paymentData?: { paymentMethodId: string, couponCode?: string }) => {
        setLoading(true);
        setError('');
        let userCredential;

        try {
            // 1. Create Auth User
            userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            try {
                // 2. Create Stripe Subscription if payment data is present
                let subscriptionId = null;
                let customerId = null;

                if (paymentData) {
                    const { httpsCallable } = await import('firebase/functions');
                    const { functions } = await import('../../firebase');
                    const createSubscription = httpsCallable(functions, 'createStripeSubscription');

                    const result = await createSubscription({
                        email: formData.email,
                        name: formData.fullName,
                        paymentMethodId: paymentData.paymentMethodId,
                        couponCode: paymentData.couponCode,
                        userId: user.uid
                    });

                    const data = result.data as any;
                    // Allow 'active' or 'trialing'. If 100% coupon, it might be active.
                    if (data.status !== 'active' && data.status !== 'trialing') {
                        throw new Error(`Subscription status is ${data.status}. Payment may require confirmation.`);
                    }
                    subscriptionId = data.subscriptionId;
                    customerId = data.customerId;

                    // Show success message if coupon was applied
                    if (paymentData.couponCode && !paymentData.paymentMethodId) {
                        console.log(`✓ Coupon ${paymentData.couponCode} successfully applied!`);
                    }
                } else {
                    // Should not happen in this flow as we enforce payment/coupon
                    throw new Error('Payment information is missing.');
                }

                // 3. Create Firestore Profile
                const searchParams = new URLSearchParams(window.location.search);
                const referralCode = searchParams.get('ref');

                await setDoc(doc(db, 'notaries', user.uid), {
                    fullName: formData.fullName,
                    email: formData.email,
                    city: formData.city,
                    state: formData.state,
                    bio: formData.bio,
                    services: formData.services,
                    rating: 0,
                    reviewCount: 0,
                    createdAt: new Date().toISOString(),
                    affiliateCode: user.uid.substring(0, 8).toUpperCase(),
                    referredBy: referralCode || null,
                    commissionRate: 10,
                    subscriptionPlan: 'professional',
                    subscriptionStatus: 'active',
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: subscriptionId,
                    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}&top[]=shortHair&top[]=longHair&top[]=curly&top[]=bob&top[]=bun&top[]=straight01&top[]=straight02&accessoriesChance=0`,
                    availability: {},
                    role: getListedRole
                });

                onClose();
                navigate('/dashboard');
            } catch (innerError: any) {
                // If subscription or profile creation fails, delete the user so they can try again
                console.error("Error during setup, rolling back user creation:", innerError);
                await deleteUser(user);
                throw innerError;
            }

        } catch (error: any) {
            console.error("Error creating account:", error);

            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please use a different email or try logging in.');
            } else if (error.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters long.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError(error.message || 'Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-surface w-full max-w-lg rounded-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-text-secondary hover:text-text transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-2xl font-serif text-text mb-8 text-center">
                        {getListedRole === 'tipic' ? 'Get Listed as a TIPIC' : 'Get Listed as a Notary'}
                    </h2>

                    {/* Stepper */}
                    <div className="flex items-center justify-center mb-8 px-4">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <div className="flex flex-col items-center relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors ${step >= s.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                                    </div>
                                    <span className={`text-[10px] font-bold tracking-wider ${step >= s.id ? 'text-primary' : 'text-slate-300'
                                        }`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`h-[2px] w-8 -mt-6 mx-2 transition-colors ${step > s.id ? 'bg-primary' : 'bg-slate-100'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Step Content */}
                    <div className="mb-8">
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none dark:bg-surface dark:border-slate-700"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none dark:bg-surface dark:border-slate-700"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none dark:bg-surface dark:border-slate-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1">City</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none dark:bg-surface dark:border-slate-700"
                                            placeholder="Austin"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-1">State</label>
                                        <select
                                            value={formData.state}
                                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none dark:bg-surface dark:border-slate-700"
                                        >
                                            <option value="">Select</option>
                                            {US_STATES.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-1">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none h-32 resize-none dark:bg-surface dark:border-slate-700"
                                        placeholder="Tell clients about your experience..."
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                                <p className="text-sm text-text-secondary mb-4">Select the services you offer:</p>
                                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                                    {[
                                        'Mobile Notary Services',
                                        'Apostille',
                                        'Loan Signing',
                                        'Fingerprinting',
                                        'Live Scan Fingerprinting',
                                        'Weddings / Wedding Officiants',
                                        'Immigration Services',
                                        'Title Producer (TIPIC)',
                                        'RON Notary (Remote Online Notary)',
                                        'I-9 Verification',
                                        'Field Inspections',
                                        'Process Serving',
                                        'VIN Verification',
                                        'Legal Document Preparation',
                                        'Translation Services',
                                        'Courier / Mobile Office Services',
                                        'Other'
                                    ].map(service => (
                                        <label key={service} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.services.includes(service)}
                                                onChange={e => {
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, services: [...formData.services, service] });
                                                    } else {
                                                        setFormData({ ...formData, services: formData.services.filter(s => s !== service) });
                                                    }
                                                }}
                                                className="rounded text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm font-medium text-text">{service}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                                <PaymentForm onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
                            </div>
                        )}
                    </div>

                    {step < 4 && (
                        <button
                            onClick={handleNext}
                            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium text-lg transition-colors shadow-lg shadow-primary/20"
                        >
                            Next &gt;
                        </button>
                    )}

                    {/* For step 4, the submit button is inside PaymentForm, so we don't render one here */}
                </div>
            </div>
        </Elements>
    );
}
