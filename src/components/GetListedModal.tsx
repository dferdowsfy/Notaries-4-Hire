import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { US_STATES } from '../data/states';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

// Initialize Stripe with a test key - REPLACE THIS WITH YOUR ACTUAL PUBLISHABLE KEY
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

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

    const handlePaymentSuccess = async (token: any) => {
        await handleSubmit(token);
    };

    const handlePaymentError = (errorMessage: string) => {
        setError(errorMessage);
    };

    const handleSubmit = async (paymentToken?: any) => {
        setLoading(true);
        setError('');
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Create Firestore Profile
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
                subscriptionPlan: 'professional', // Upgraded plan
                subscriptionStatus: 'active',
                paymentToken: paymentToken ? paymentToken.id : null, // Store token reference (do not store actual card data)
                photoUrl: null,
                availability: {}
            });

            onClose();
            navigate('/dashboard');
        } catch (error: any) {
            console.error("Error creating account:", error);

            // User-friendly error messages
            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please use a different email or try logging in.');
            } else if (error.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters long.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError('Failed to create account. Please try again.');
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

                    <h2 className="text-2xl font-serif text-text mb-8 text-center">Get Listed as a Notary</h2>

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
                                <div className="grid grid-cols-2 gap-3">
                                    {['Mobile Notary', 'Loan Signing', 'Apostille', 'Remote Online', 'Fingerprinting', 'Wedding Officiant'].map(service => (
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
