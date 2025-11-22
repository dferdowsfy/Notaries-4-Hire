import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Feather, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import LoginModal from './LoginModal';
import GetListedModal from './GetListedModal';

export default function Navbar() {
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const { isLoginOpen, openLogin, closeLogin, isGetListedOpen, openGetListed, closeGetListed } = useModal();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <nav className="w-full py-4 px-6 bg-white dark:bg-surface border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center">
                                <Feather className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-bold text-text tracking-wide">NOTARIES</span>
                                <span className="text-sm font-medium text-accent tracking-widest">4 HIRE</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-text-secondary font-medium">
                        <Link to="/" className="text-primary hover:text-primary-hover transition-colors">Home</Link>
                        <button onClick={() => scrollToSection('search')} className="hover:text-primary transition-colors">Find Notaries</button>
                        <button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors">Services</button>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard" className="font-medium text-text hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="text-sm text-text-secondary hover:text-red-500 transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={openLogin}
                                    className="font-medium text-text hover:text-primary transition-colors"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={openGetListed}
                                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm shadow-primary/30"
                                >
                                    Get Listed
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-text p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pt-4 pb-6 border-t border-slate-100 mt-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                        <Link
                            to="/"
                            className="text-text font-medium py-2 px-2 hover:bg-slate-50 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <button
                            onClick={() => scrollToSection('search')}
                            className="text-left text-text font-medium py-2 px-2 hover:bg-slate-50 rounded-lg"
                        >
                            Find Notaries
                        </button>
                        <button
                            onClick={() => scrollToSection('services')}
                            className="text-left text-text font-medium py-2 px-2 hover:bg-slate-50 rounded-lg"
                        >
                            Services
                        </button>

                        <div className="h-px bg-slate-100 my-2"></div>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-text font-medium py-2 px-2 hover:bg-slate-50 rounded-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-left text-red-500 font-medium py-2 px-2 hover:bg-red-50 rounded-lg"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        openLogin();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-left text-text font-medium py-2 px-2 hover:bg-slate-50 rounded-lg"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => {
                                        openGetListed();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="bg-primary text-white px-5 py-3 rounded-lg font-medium text-center shadow-sm"
                                >
                                    Get Listed
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>

            <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
            <GetListedModal isOpen={isGetListedOpen} onClose={closeGetListed} />
        </>
    );
}
