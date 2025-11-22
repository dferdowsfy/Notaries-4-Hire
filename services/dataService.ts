
import { Notary } from '../types';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Map Firestore user data to Notary interface
const mapDocToNotary = (doc: any): Notary => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.displayName || 'Unknown Notary',
    specialty: data.specialties?.[0] || 'General Notary',
    location: `${data.city || ''}, ${data.state || ''}`.replace(/^, /, ''),
    rating: data.rating || 0,
    reviews: data.reviewCount || 0,
    price: 'Contact for pricing', // Placeholder as price isn't in user profile yet
    languages: ['English'], // Placeholder
    services: data.services || [],
    photo: data.photoURL || 'https://via.placeholder.com/150',
    bio: data.bio || '',
    availability: 'Check profile',
    featured: data.featured || false
  };
};

export const getNotaries = async (): Promise<Notary[]> => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "notary"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocToNotary);
  } catch (error) {
    console.error("Error fetching notaries:", error);
    return [];
  }
};

// We still keep categories static as they are structure
export const CATEGORIES = [
  { name: 'Mobile Notary', icon: 'car', description: 'On-location services', count: 2103 },
  { name: 'Apostille', icon: 'globe', description: 'Intl. authentication', count: 567 },
  { name: 'Loan Signing', icon: 'home', description: 'Real estate specialist', count: 1456 },
  { name: 'Fingerprinting', icon: 'fingerprint', description: 'Biometric services', count: 892 },
  { name: 'Weddings', icon: 'heart', description: 'Certified ceremonies', count: 892 },
  { name: 'Immigration', icon: 'plane', description: 'Document specialists', count: 645 },
];
// Removed SAMPLE_NOTARIES export to force real data usage
export const SAMPLE_NOTARIES: Notary[] = [];
