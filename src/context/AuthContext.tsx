import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    isNotary: boolean; // Mocking this for now, ideally fetched from Firestore
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    // For demo purposes, we'll treat any logged-in user as a notary
    // In a real app, you'd check a 'role' field in Firestore
    const isNotary = !!user;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }
            try {
                const token = await currentUser.getIdTokenResult();
                if (auth.currentUser?.uid === currentUser.uid) setIsAdmin(token.claims.admin === true);
            } catch (error) {
                console.error('Unable to check owner access', error);
                if (auth.currentUser?.uid === currentUser.uid) setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, isNotary, isAdmin }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}
