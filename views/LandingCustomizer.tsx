import React, { useState } from 'react';
import { User, ViewState } from '../types';
import { Save, ChevronLeft, Camera } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface LandingCustomizerProps {
  user: User;
  setView: (view: ViewState) => void;
}

const LandingCustomizer: React.FC<LandingCustomizerProps> = ({ user, setView }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    bio: user.bio || '',
    yearsExperience: user.yearsExperience || 'Less than 1 year',
    location: user.location || '', // Assuming user object has this
    specialties: user.specialties || [], // Assuming user object has this
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecialtyToggle = (spec: string) => {
    setFormData(prev => {
      const specialties = prev.specialties?.includes(spec)
        ? prev.specialties.filter(s => s !== spec)
        : [...(prev.specialties || []), spec];
      return { ...prev, specialties };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...formData
      });
      alert('Profile updated successfully!');
    } catch (e: any) {
      alert('Error saving profile: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const allServices = ['Remote Online Notary', 'Mobile Notary', 'Loan Signing Agent', 'Wedding Officiant', 'Apostille Services', 'Fingerprinting', 'Immigration Forms'];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-surface rounded-full transition-colors">
            <ChevronLeft size={24} className="text-text-secondary" />
          </button>
          <h1 className="text-3xl font-serif font-medium text-text">Customize Landing Page</h1>
        </div>

        <div className="glass-panel rounded-2xl p-8 space-y-8">
          
          {/* Hero / Header Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-text border-b border-border pb-2">Basic Information</h2>
            
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-surface border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors relative overflow-hidden group">
                <Camera className="text-text-secondary group-hover:text-primary" />
                {/* In a real app, we'd have an image upload input here */}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Display Name</label>
                  <input 
                    type="text" 
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Location</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-text border-b border-border pb-2">About You</h2>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Professional Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none resize-none"
                placeholder="Tell clients about your experience, approach, and what sets you apart..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Years of Experience</label>
              <select 
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:border-primary outline-none"
              >
                <option>Less than 1 year</option>
                <option>1-3 years</option>
                <option>3-5 years</option>
                <option>5-10 years</option>
                <option>10+ years</option>
              </select>
            </div>
          </div>

          {/* Specialties Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-text border-b border-border pb-2">Specialties</h2>
            <p className="text-sm text-text-secondary">Select the services you want to highlight on your landing page.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allServices.map(spec => (
                <label key={spec} className="flex items-center p-3 border border-border rounded-lg hover:bg-surface cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.specialties?.includes(spec)}
                    onChange={() => handleSpecialtyToggle(spec)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-text">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button 
              onClick={() => setView('dashboard')}
              className="px-6 py-2 text-text-secondary hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingCustomizer;