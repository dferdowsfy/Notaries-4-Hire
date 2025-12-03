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
    const [couponCode, setCouponCode] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        // Check if card is empty (this is a basic check, ideally we check the element state)
        // For now, we'll try to create a payment method if the card element exists.
        // If the user hasn't entered anything, createPaymentMethod might fail or we can skip it.
        // A better way is to check if the user intends to use a card.
        // We'll assume if they entered a coupon, they might not want to use a card.

        let paymentMethodId = '';

        // Try to create payment method only if we think there's card data
        // Since we can't easily check if CardElement is empty synchronously without state,
        // we will try to create it. If it fails with "incomplete", we'll assume they didn't enter one
        // and try to proceed with just the coupon.

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement!,
        });

        if (error) {
            // If error is "incomplete", and we have a coupon, maybe we can try without card?
            // But stripe.createPaymentMethod validates the card.
            // If the user didn't type anything, it returns "Your card number is incomplete."

            if (couponCode) {
                // Try submitting with just coupon
                onSuccess({
                    paymentMethodId: '',
                    couponCode: couponCode
                });
                setLoading(false);
                return;
            }

            onError(error.message || 'An error occurred during payment.');
            setLoading(false);
        } else {
            onSuccess({
                paymentMethodId: paymentMethod.id,
                couponCode: couponCode || undefined
            });
            setLoading(false);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-2">
                    Coupon Code (Optional)
                </label>
                <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full p-3 rounded-lg border border-slate-200 focus:border-primary outline-none dark:bg-surface dark:border-700"
                />
                <p className="text-xs text-text-secondary mt-1">
                    If you have a 100% off coupon, you can skip entering card details.
                </p>
            </div>

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

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium text-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
        </form>
    );
}
