import React, { useState, useEffect } from 'react';
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
    const { user, isAdmin, logout } = useAuth();
    const { isLoginOpen, openLogin, closeLogin, isGetListedOpen, openGetListed, closeGetListed } = useModal();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Track scroll position to highlight active section
    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveSection('');
            return;
        }

        const handleScroll = () => {
            const sections = ['search', 'services'];
            const scrollPosition = window.scrollY + 200; // Offset for navbar

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(sectionId);
                        return;
                    }
                }
            }
            setActiveSection('');
        };

        handleScroll(); // Check initial position
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

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
            // Set active section after scrolling
            if (location.pathname === '/') {
                setActiveSection(id);
            }
        };

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(scroll, 100);
        } else {
            scroll();
        }
    };

    // Determine which navigation item should be highlighted
    const activeItem = (() => {
        if (location.pathname === '/title-producers') return 'title-producers';
        if (location.pathname === '/') return activeSection || '';
        return '';
    })();
    // activeNav resolves to a specific key for each nav element
    const activeNav = activeItem === '' ? 'home' : activeItem;

    // Helper to generate class for nav items
    const navClass = (item: string) => {
        const base = 'transition-colors pb-1 border-b-2';
        const isActive = activeNav === item;
        const activeClasses = 'text-primary border-accent';
        const inactiveClasses = 'text-text-secondary border-transparent hover:text-primary';
        return `${base} ${isActive ? activeClasses : inactiveClasses}`;
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
                            onClick={() => setActiveSection('')}
                            className={navClass('home')}
                        >
                            Home
                        </Link>
                        <button
                            onClick={() => scrollToSection('search')}
                            className={navClass('search')}
                        >
                            Find A Notary
                        </button>
                        <Link
                            to="/title-producers"
                            className={navClass('title-producers')}
                        >
                            Title Producers
                        </Link>
                        <button
                            onClick={() => scrollToSection('services')}
                            className={navClass('services')}
                        >
                            Services
                        </button>
                    </div>

                    {/* Desktop Auth Buttons - Hidden on mobile/tablet (md and down) */}
                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to={isAdmin ? '/admin' : '/dashboard'} className="font-medium text-text hover:text-primary transition-colors">
                                    {isAdmin ? 'Owner Dashboard' : 'Dashboard'}
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
                            onClick={() => { setActiveSection(''); setIsMobileMenuOpen(false); }}
                            className={`font-medium py-2 px-2 rounded-lg border-l-4 ${activeNav === 'home'
                                ? 'text-primary border-accent bg-accent/5'
                                : 'text-text border-transparent hover:bg-slate-50'
                                }`}
                        >
                            Home
                        </Link>
                        <button
                            onClick={() => scrollToSection('search')}
                            className={`text-left font-medium py-2 px-2 rounded-lg border-l-4 ${activeNav === 'search'
                                ? 'text-primary border-accent bg-accent/5'
                                : 'text-text border-transparent hover:bg-slate-50'
                                }`}
                        >
                            Find A Notary
                        </button>
                        <Link
                            to="/title-producers"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`font-medium py-2 px-2 rounded-lg border-l-4 ${activeNav === 'title-producers'
                                ? 'text-primary border-accent bg-accent/5'
                                : 'text-text border-transparent hover:bg-slate-50'
                                }`}
                        >
                            Title Producers
                        </Link>
                        <button
                            onClick={() => scrollToSection('services')}
                            className={`text-left font-medium py-2 px-2 rounded-lg border-l-4 ${activeNav === 'services'
                                ? 'text-primary border-accent bg-accent/5'
                                : 'text-text border-transparent hover:bg-slate-50'
                                }`}
                        >
                            Services
                        </button>

                        <div className="h-px bg-slate-100 my-2"></div>

                        {user ? (
                            <>
                                <Link
                                    to={isAdmin ? '/admin' : '/dashboard'}
                                    className="text-text font-medium py-2 px-2 hover:bg-slate-50 rounded-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {isAdmin ? 'Owner Dashboard' : 'Dashboard'}
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
