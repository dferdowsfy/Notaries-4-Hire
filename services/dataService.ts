import { Notary, Category } from '../types';

// Sample data from original app.js to ensure the UI works immediately without DB population
export const SAMPLE_NOTARIES: Notary[] = [
  {
    id: '2',
    name: 'Michael Rodriguez',
    specialty: 'Wedding Officiant',
    location: 'Austin, TX',
    rating: 4.8,
    reviews: 89,
    price: '$150-300',
    languages: ['English', 'Spanish'],
    services: ['Wedding Ceremonies', 'Notarization', 'Document Prep'],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
    bio: 'Professional wedding officiant and notary. Creating memorable ceremonies for over 10 years.',
    availability: 'Weekends & Evenings',
    featured: true
  },
  {
    id: '3',
    name: 'Jennifer Walsh',
    specialty: 'Apostille Agent',
    location: 'Miami, FL',
    rating: 5.0,
    reviews: 203,
    price: '$75-125',
    languages: ['English', 'French'],
    services: ['Apostille Services', 'Document Authentication', 'International Docs'],
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces',
    bio: 'Expert in international document authentication and apostille services. Fast turnaround guaranteed.',
    availability: 'Mon-Sat 8AM-7PM',
    featured: true
  },
  {
    id: '4',
    name: 'David Park',
    specialty: 'Real Estate Notary',
    location: 'Seattle, WA',
    rating: 4.9,
    reviews: 156,
    price: '$35-75',
    languages: ['English', 'Korean'],
    services: ['Real Estate Closings', 'Title Work', 'Escrow Documents'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    bio: 'Specialized in real estate transactions with over 1,000 successful closings.',
    availability: 'Mon-Sat 8AM-8PM'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    specialty: 'Mobile Notary',
    location: 'Denver, CO',
    rating: 4.8,
    reviews: 142,
    price: '$50-100',
    languages: ['English'],
    services: ['Mobile Service', 'After Hours', 'Hospital Visits'],
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
    bio: 'Mobile notary serving Denver metro area. Available 24/7 for urgent needs.',
    availability: '24/7 By Appointment'
  }
];

export const CATEGORIES: Category[] = [
  { name: 'Mobile Notary', icon: 'car', description: 'On-location services', count: 2103 },
  { name: 'Apostille', icon: 'globe', description: 'Intl. authentication', count: 567 },
  { name: 'Loan Signing', icon: 'home', description: 'Real estate specialist', count: 1456 },
  { name: 'Fingerprinting', icon: 'fingerprint', description: 'Biometric services', count: 892 },
  { name: 'Weddings', icon: 'heart', description: 'Certified ceremonies', count: 892 },
  { name: 'Immigration', icon: 'plane', description: 'Document specialists', count: 645 },
];

export const getNotaries = async (): Promise<Notary[]> => {
  // In a real implementation, this would fetch from Firestore using the code provided in context
  // For setup purposes, we return the sample data to ensure immediate visual feedback
  return new Promise((resolve) => {
    setTimeout(() => resolve(SAMPLE_NOTARIES), 500);
  });
};