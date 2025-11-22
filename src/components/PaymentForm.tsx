import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
    onSuccess: (token: any) => void;
    onError: (error: string) => void;
}

export default function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setLoading(false);
            return;
        }

        // In a real application, you would create a PaymentIntent on your backend
        // and confirm it here. Since we are client-side only for this demo,
        // we will create a token to simulate the flow.
        const { error, token } = await stripe.createToken(cardElement);

        if (error) {
            onError(error.message || 'An error occurred during payment.');
            setLoading(false);
        } else {
            // Simulate processing delay
            setTimeout(() => {
                onSuccess(token);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-2">
                    Card Details
                </label>
                <div className="p-3 border border-slate-200 rounded-lg dark:bg-surface dark:border-slate-700 bg-white">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-text">Professional Plan</span>
                    <span className="font-bold text-primary">$19.99/mo</span>
                </div>
                <p className="text-xs text-text-secondary">
                    Includes premium listing, unlimited leads, and verified badge.
                </p>
            </div>
        </form>
    );
}
