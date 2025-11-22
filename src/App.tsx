import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CustomizeProfile from './pages/CustomizeProfile';

function Footer() {
    return (
        <footer className="bg-white dark:bg-surface py-12 border-t border-slate-100 dark:border-slate-800 text-center transition-colors duration-300">
            <h3 className="font-serif text-2xl text-text mb-4">Notaries4Hire</h3>
            <p className="text-text-secondary mb-8">Connecting you with professional notary services nationwide.</p>
            <p className="text-xs text-slate-400">© 2025 Notaries4Hire. All rights reserved.</p>
        </footer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ModalProvider>
                    <Router>
                        <div className="min-h-screen bg-white dark:bg-background text-text font-sans flex flex-col transition-colors duration-300">
                            <Navbar />
                            <main className="flex-grow">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/search" element={<Search />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/customize-profile" element={<CustomizeProfile />} />
                                    <Route path="/profile/:userId" element={<Profile />} />
                                    <Route path="/profile" element={<Profile />} />
                                    {/* Fallback route for demo purposes */}
                                    <Route path="*" element={<Home />} />
                                </Routes>
                            </main>
                            <Footer />
                        </div>
                    </Router>
                </ModalProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
