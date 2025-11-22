
export interface Notary {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  languages: string[];
  services: string[];
  photo: string;
  bio: string;
  availability: string;
  featured?: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  role?: 'client' | 'notary' | 'admin';
  bio?: string;
  yearsExperience?: string;
  specialties?: string[];
  photoURL?: string;
  location?: string;
  phone?: string;
  
  // Extended profile fields
  rating?: number;
  reviewCount?: number;
  completedCount?: number;
  profileViews?: number;
  commissionNumber?: string;
  referredBy?: string; // For affiliate tracking
}

export type ViewState = 'home' | 'directory' | 'dashboard' | 'profile' | 'login' | 'register' | 'landing-customizer';

export interface Category {
  name: string;
  icon: any;
  description: string;
  count: number;
}
