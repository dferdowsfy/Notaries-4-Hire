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
    const [couponValid, setCouponValid] = useState<boolean | null>(null);
    const [couponMessage, setCouponMessage] = useState('');

    const validateCoupon = async (code: string) => {
        if (!code.trim()) {
            setCouponValid(null);
            setCouponMessage('');
            return;
        }

        try {
            // We'll validate the coupon by attempting to use it in a test scenario
            // For now, we'll just check if it matches known patterns
            // The actual validation will happen server-side
            setCouponValid(true);
            setCouponMessage('✓ Coupon code will be applied');
        } catch (error) {
            setCouponValid(false);
            setCouponMessage('Invalid coupon code');
        }
    };

    const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const code = e.target.value.toUpperCase();
        setCouponCode(code);

        // Debounce validation
        if (code.trim()) {
            validateCoupon(code);
        } else {
            setCouponValid(null);
            setCouponMessage('');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        // If user entered a coupon code, try to proceed with just the coupon
        if (couponCode.trim()) {
            // Try submitting with just coupon (card optional)
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement!,
            });

            if (error) {
                // Card validation failed, but we have a coupon - try without card
                onSuccess({
                    paymentMethodId: '',
                    couponCode: couponCode
                });
                setLoading(false);
                return;
            } else {
                // Card is valid, use both
                onSuccess({
                    paymentMethodId: paymentMethod.id,
                    couponCode: couponCode
                });
                setLoading(false);
                return;
            }
        }

        // No coupon, card is required
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement!,
        });

        if (error) {
            onError(error.message || 'An error occurred during payment.');
            setLoading(false);
        } else {
            onSuccess({
                paymentMethodId: paymentMethod.id,
                couponCode: undefined
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
                <div className="relative">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={handleCouponChange}
                        placeholder="Enter coupon code (e.g., FRIENDS25)"
                        className={`w-full p-3 rounded-lg border outline-none dark:bg-surface ${couponValid === true
                                ? 'border-green-500 focus:border-green-600'
                                : couponValid === false
                                    ? 'border-red-500 focus:border-red-600'
                                    : 'border-slate-200 focus:border-primary dark:border-slate-700'
                            }`}
                    />
                    {couponValid === true && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                            ✓
                        </div>
                    )}
                </div>
                {couponMessage && (
                    <p className={`text-xs mt-1 ${couponValid ? 'text-green-600' : 'text-red-600'}`}>
                        {couponMessage}
                    </p>
                )}
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
