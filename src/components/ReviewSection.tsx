import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Review {
    id: string;
    author: string;
    rating: number;
    text: string;
    date: string;
}

// Mock data for now, would come from Firestore
const MOCK_REVIEWS: Review[] = [
    { id: '1', author: 'Sarah M.', rating: 5, text: 'Darius was prompt, professional, and made the process so easy!', date: '2 days ago' },
    { id: '2', author: 'James L.', rating: 5, text: 'Excellent service. Came to my office within an hour.', date: '1 week ago' }
];

export default function ReviewSection() {
    const { user, isNotary } = useAuth();
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.trim()) return;

        const review: Review = {
            id: Date.now().toString(),
            author: user?.email?.split('@')[0] || 'Visitor', // Simple fallback
            rating,
            text: newReview,
            date: 'Just now'
        };

        setReviews([review, ...reviews]);
        setNewReview('');
        setRating(5);
    };

    // Logic: Only visitors (non-notaries) or logged-out users can leave reviews
    // Ideally, we'd check if the logged-in user is NOT the profile owner
    const canLeaveReview = !isNotary || !user;

    return (
        <div className="border border-slate-100 rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-serif text-text mb-6">Client Reviews</h2>

            {/* Review List */}
            <div className="space-y-6 mb-8">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-50 last:border-0 pb-6 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-text">{review.author}</span>
                                <div className="flex text-accent">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                    ))}
                                </div>
                            </div>
                            <span className="text-xs text-text-secondary">{review.date}</span>
                        </div>
                        <p className="text-text-secondary text-sm">{review.text}</p>
                    </div>
                ))}
            </div>

            {/* Add Review Form */}
            {canLeaveReview ? (
                <form onSubmit={handleSubmitReview} className="bg-slate-50 rounded-xl p-6">
                    <h3 className="font-bold text-text mb-4">Leave a Review</h3>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-text-secondary">Rating:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`transition-colors ${star <= rating ? 'text-accent fill-accent' : 'text-slate-300'}`}
                                >
                                    <Star className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Share your experience..."
                            className="flex-1 p-3 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-hover text-white px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-sm text-text-secondary italic text-center bg-slate-50 p-4 rounded-lg">
                    Notaries cannot review themselves. Log out or sign in as a client to leave a review.
                </p>
            )}
        </div>
    );
}
