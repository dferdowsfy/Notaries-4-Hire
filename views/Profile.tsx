
import React, { useState } from 'react';
import { User, ViewState } from '../types';
import { ChevronLeft, Star, MapPin, CheckCircle, User as UserIcon, Calendar } from 'lucide-react';

interface ProfileProps {
  user: User; // The profile being viewed
  currentUser: User | null; // The user viewing the profile
  setView: (view: ViewState) => void;
}

// Mock reviews for display purposes until real reviews are collected
const MOCK_REVIEWS = [
  { id: 1, author: "Alice M.", rating: 5, text: "Excellent service! Very professional and punctual.", date: "2 days ago" },
  { id: 2, author: "Bob R.", rating: 4, text: "Great experience, handled my documents quickly.", date: "1 week ago" },
  { id: 3, author: "Sarah L.", rating: 5, text: "Highly recommend for wedding officiant services. Made our day special!", date: "3 weeks ago" }
];

const Profile: React.FC<ProfileProps> = ({ user, currentUser, setView }) => {
  // If the user has 0 reviews, show empty state instead of mocks
  const initialReviews = (user.reviewCount && user.reviewCount > 0) ? MOCK_REVIEWS : [];
  
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isOwner = currentUser?.uid === user.uid;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.text) return;
    
    const review = {
      id: Date.now(),
      author: currentUser?.displayName || "Anonymous",
      rating: newReview.rating,
      text: newReview.text,
      date: "Just now"
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, text: '' });
    setShowReviewForm(false);
  };

  const handleBookNow = () => {
    alert(`Starting booking process for ${user.displayName}`);
  };

  const handleContact = () => {
    alert(`Contacting ${user.displayName}...`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Bar for navigation back to dashboard if owner */}
      {isOwner && (
        <div className="bg-surface border-b border-border py-4 px-4 sticky top-24 z-40">
          <div className="container mx-auto">
            <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
              <ChevronLeft size={20} /> Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-surface/50 border-b border-border py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 border-4 border-surface shadow-xl mb-6 flex items-center justify-center text-4xl text-primary font-bold overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
            ) : (
              <span>{user.displayName?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <h1 className="text-4xl font-serif font-bold text-text mb-2">{user.displayName}</h1>
          <div className="flex items-center justify-center gap-4 text-text-secondary mb-6">
            <span className="flex items-center gap-1"><MapPin size={16} /> {user.location || 'Location not set'}</span>
            <span className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500 fill-current" /> 
              {user.rating ? user.rating.toFixed(1) : '0.0'} ({user.reviewCount || 0} reviews)
            </span>
          </div>
          <div className="flex justify-center gap-3">
            <button 
              onClick={handleBookNow}
              className="px-8 py-3 bg-primary text-background font-bold rounded-full hover:bg-primary-hover transition-transform hover:-translate-y-1 shadow-glow"
            >
              Book Now
            </button>
            <button 
              onClick={handleContact}
              className="px-8 py-3 border border-border text-text font-medium rounded-full hover:bg-surface transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-8">
          {/* About */}
          <section className="glass-panel p-8 rounded-2xl">
            <h2 className="text-2xl font-serif font-medium text-text mb-4">About</h2>
            <p className="text-text-secondary leading-relaxed">
              {user.bio || "No bio provided yet. This notary is ready to help you with your documentation needs."}
            </p>
          </section>

          {/* Experience & Specialties */}
          <section className="glass-panel p-8 rounded-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-primary" /> Experience
                </h3>
                <p className="text-text-secondary text-lg">{user.yearsExperience || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-primary" /> Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.specialties && user.specialties.length > 0 ? (
                    user.specialties.map((spec, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20">
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-secondary italic">No specialties listed</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="glass-panel p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif font-medium text-text">Reviews</h2>
              {!isOwner && !showReviewForm && (
                <button 
                  onClick={() => setShowReviewForm(true)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Write a Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="mb-8 p-6 bg-surface border border-border rounded-xl">
                <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
                <form onSubmit={handleAddReview}>
                  <div className="mb-4">
                    <label className="block text-sm text-text-secondary mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          type="button"
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`text-2xl focus:outline-none ${star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-text-secondary mb-1">Review</label>
                    <textarea 
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg p-3 text-text focus:border-primary outline-none"
                      rows={3}
                      placeholder="Share your experience..."
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary-hover"
                    >
                      Post Review
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-text-secondary hover:text-text"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                          {review.author.charAt(0)}
                        </div>
                        <span className="font-medium text-text">{review.author}</span>
                      </div>
                      <span className="text-xs text-text-secondary">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-500 text-sm mb-2">
                      {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <p>No reviews yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Quick Info */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-medium text-text mb-4">Availability</h3>
            <div className="space-y-3 text-sm text-text-secondary">
              <div className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="text-text">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="text-text">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-red-400">Closed</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-medium text-text mb-4">Credentials</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle size={16} className="text-teal-500" /> Licensed & Bonded
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle size={16} className="text-teal-500" /> E&O Insured
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle size={16} className="text-teal-500" /> Background Checked
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
