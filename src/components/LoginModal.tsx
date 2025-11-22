import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail } from 'lucide-react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const navigate = useNavigate();
    const { openGetListed, closeLogin } = useModal();

    const handleSignUpClick = () => {
        closeLogin();
        openGetListed();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            onClose();
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResetLoading(true);
        setResetSuccess(false);

        try {
            // Removed custom URL redirect to avoid 'unauthorized-continue-uri' errors
            // This will use the default Firebase password reset flow which is more robust
            await sendPasswordResetEmail(auth, resetEmail);

            setResetSuccess(true);
            setResetEmail('');
            // Keep success message visible longer
            setTimeout(() => {
                setShowForgotPassword(false);
                setResetSuccess(false);
            }, 5000);
        } catch (err: any) {
            console.error('Password reset error:', err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many requests. Please try again later.');
            } else {
                setError(`Failed to send reset email: ${err.message || 'Please check your Firebase email configuration.'}`);
            }
        } finally {
            setResetLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-surface w-full max-w-md rounded-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-secondary hover:text-text transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {!showForgotPassword ? (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-serif text-text mb-2">Welcome Back</h2>
                            <p className="text-text-secondary">Log in to manage your notary profile</p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {loading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-text-secondary">
                            Don't have an account?{' '}
                            <button onClick={handleSignUpClick} className="text-primary font-medium hover:underline">
                                Sign up
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-serif text-text mb-2">Reset Password</h2>
                            <p className="text-text-secondary">Enter your email and we'll send you a reset link</p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {resetSuccess && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                                Password reset email sent! Check your inbox.
                            </div>
                        )}

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text mb-1">Email</label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={resetLoading}
                                className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {resetLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setError('');
                                    setResetEmail('');
                                }}
                                className="w-full text-text-secondary hover:text-text py-2 font-medium transition-colors"
                            >
                                Back to Login
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
