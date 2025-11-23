import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CustomizeProfile from './pages/CustomizeProfile';
import ResetPassword from './pages/ResetPassword';

function Footer() {
    return (
        <footer className="bg-white dark:bg-surface py-12 border-t border-slate-100 dark:border-slate-800 text-center transition-colors duration-300">
            <h3 className="font-serif text-2xl text-text mb-4">Notaries4Hire</h3>
            <p className="text-text-secondary mb-8">Connecting you with professional notary services nationwide.</p>
            <p className="text-xs text-slate-400">© 2025 Notaries4Hire. All rights reserved.</p>
        </footer>
    );
}

function AppContent() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isProfilePage = location.pathname.startsWith('/profile');

    // Intercept Firebase action URL parameters
    useEffect(() => {
        const mode = searchParams.get('mode');
        const oobCode = searchParams.get('oobCode');

        if (mode === 'resetPassword' && oobCode) {
            navigate(`/reset-password?oobCode=${oobCode}`);
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-white dark:bg-background text-text font-sans flex flex-col transition-colors duration-300">
            {!isProfilePage && <Navbar />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/customize-profile" element={<CustomizeProfile />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    {/* Fallback route for demo purposes */}
                    <Route path="*" element={<Home />} />
                </Routes>
            </main>
            {!isProfilePage && <Footer />}
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ModalProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </ModalProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
