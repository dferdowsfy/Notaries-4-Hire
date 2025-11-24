import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import LoginModal from './LoginModal';
import GetListedModal from './GetListedModal';
import logoFull from '../assets/logo_full.png';

export default function Navbar() {
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const { isLoginOpen, openLogin, closeLogin, isGetListedOpen, openGetListed, closeGetListed } = useModal();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        setIsMobileMenuOpen(false);

        const scroll = () => {
            const element = document.getElementById(id);
            if (element) {
                const navbarHeight = 150; // Navbar height (logo h-32 is 128px + padding)
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        };

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(scroll, 100);
        } else {
            scroll();
        }
    };

    return (
        <>
            <nav className="w-full py-2 px-6 bg-white dark:bg-surface border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-3">
                            {/* Using the full logo image with text included */}
                            <img src={logoFull} alt="Notaries 4 Hire" className="h-32 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Desktop Menu - Hidden on mobile/tablet (md and down) */}
                    <div className="hidden md:flex items-center gap-8 text-text-secondary font-medium">
                        <Link
                            to="/"
                            className={`transition-colors pb-1 border-b-2 ${location.pathname === '/'
                                ? 'text-primary border-accent'
                                : 'text-text-secondary border-transparent hover:text-primary'
                                }`}
                        >
                            Home
                        </Link>
                        <button
                            onClick={() => scrollToSection('services')}
                            className={`transition-colors pb-1 border-b-2 ${location.pathname === '/'
                                ? 'border-transparent hover:text-primary'
                                : 'border-transparent hover:text-primary'
                                }`}
                        >
                            Services
                        </button>
                        <button
                            onClick={() => scrollToSection('search')}
                            className={`transition-colors pb-1 border-b-2 ${location.pathname === '/'
                                ? 'border-transparent hover:text-primary'
                                : 'border-transparent hover:text-primary'
                                }`}
                        >
                            Find Notaries
                        </button>
                        <Link
                            to="/title-producers"
                            className={`transition-colors pb-1 border-b-2 ${location.pathname === '/title-producers'
                                ? 'text-primary border-accent'
                                : 'text-text-secondary border-transparent hover:text-primary'
                                }`}
                        >
                            Title Producers
                        </Link>
                    </div>

                    {/* Desktop Auth Buttons - Hidden on mobile/tablet (md and down) */}
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
                                    onClick={() => openGetListed(location.pathname.includes('title-producers') ? 'tipic' : 'notary')}
                                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm shadow-primary/30"
                                >
                                    Get Listed
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button - Visible on mobile/tablet (md and down) */}
                    <button
                        className="md:hidden text-text p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden pt-4 pb-6 border-t border-slate-100 mt-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                        <Link
                            to="/"
                            className={`font-medium py-2 px-2 rounded-lg border-l-4 ${location.pathname === '/'
                                    ? 'text-primary border-accent bg-accent/5'
                                    : 'text-text border-transparent hover:bg-slate-50'
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <button
                            onClick={() => scrollToSection('services')}
                            className="text-left text-text font-medium py-2 px-2 hover:bg-slate-50 rounded-lg border-l-4 border-transparent"
                        >
                            Services
                        </button>
                        <button
                            onClick={() => scrollToSection('search')}
                            className="text-left text-text font-medium py-2 px-2 hover:bg-slate-50 rounded-lg border-l-4 border-transparent"
                        >
                            Find Notaries
                        </button>
                        <Link
                            to="/title-producers"
                            className={`font-medium py-2 px-2 rounded-lg border-l-4 ${location.pathname === '/title-producers'
                                    ? 'text-primary border-accent bg-accent/5'
                                    : 'text-text border-transparent hover:bg-slate-50'
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Title Producers
                        </Link>

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
                                        openGetListed(location.pathname.includes('title-producers') ? 'tipic' : 'notary');
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
