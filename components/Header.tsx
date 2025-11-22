
import React from 'react';
import { User, ViewState } from '../types';
import { Sun, Moon, Menu, X, Feather } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogin: () => void;
  onLogout: () => void;
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, setView, onLogin, onLogout, currentTheme, toggleTheme, onRegister }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinkClass = (view: ViewState) => 
    `cursor-pointer px-3 py-2 text-lg font-light tracking-wide transition-colors hover:text-primary ${
      currentView === view ? 'text-primary font-medium' : 'text-text-secondary'
    }`;

  const handleServicesClick = () => {
    setView('home');
    // Small timeout to allow view change before scrolling
    setTimeout(() => {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setView('home')}
        >
          {/* Icon Circle */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-accent group-hover:shadow-glow transition-shadow duration-300 bg-background">
            <Feather className="text-teal w-8 h-8 -translate-y-0.5 translate-x-0.5" strokeWidth={2} />
          </div>
          
          {/* Stacked Text */}
          <div className="flex flex-col justify-center space-y-1">
            <span className="text-2xl font-bold tracking-wider text-text leading-none uppercase font-sans">Notaries</span>
            <span className="text-xl font-bold tracking-[0.2em] text-accent leading-none uppercase font-sans pl-0.5">4 Hire</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a onClick={() => setView('home')} className={navLinkClass('home')}>Home</a>
          <a onClick={() => setView('directory')} className={navLinkClass('directory')}>Find Notaries</a>
          <a onClick={handleServicesClick} className="cursor-pointer px-3 py-2 text-lg font-light text-text-secondary hover:text-primary">Services</a>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="cursor-pointer p-2 text-text-secondary hover:text-text transition-colors"
            aria-label="Toggle theme"
          >
            {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <>
              <button 
                onClick={() => setView('dashboard')}
                className="cursor-pointer btn px-4 py-2 rounded-lg text-sm font-medium bg-surface border border-primary/30 hover:border-primary transition-all text-text"
              >
                Dashboard
              </button>
              <button 
                onClick={onLogout}
                className="cursor-pointer text-sm text-text-secondary hover:text-text transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onLogin}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-text hover:text-primary transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={onRegister}
                className="cursor-pointer px-6 py-2.5 rounded-lg bg-primary text-background font-semibold hover:bg-primary-hover transition-all shadow-glow"
              >
                Get Listed
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="cursor-pointer text-text-secondary hover:text-text"
          >
            {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="cursor-pointer text-text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-surface border-b border-border p-4 flex flex-col gap-4 shadow-2xl">
          <a onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="cursor-pointer text-lg py-2 border-b border-border text-text">Home</a>
          <a onClick={() => { setView('directory'); setMobileMenuOpen(false); }} className="cursor-pointer text-lg py-2 border-b border-border text-text">Find Notaries</a>
          <a onClick={() => { handleServicesClick(); setMobileMenuOpen(false); }} className="cursor-pointer text-lg py-2 border-b border-border text-text">Services</a>
          {user ? (
            <>
              <a onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }} className="cursor-pointer text-lg py-2 text-primary">Dashboard</a>
              <a onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="cursor-pointer text-lg py-2 text-text">Log Out</a>
            </>
          ) : (
            <>
              <a onClick={() => { onLogin(); setMobileMenuOpen(false); }} className="cursor-pointer text-lg py-2 text-text">Log In</a>
              <a onClick={() => { onRegister(); setMobileMenuOpen(false); }} className="cursor-pointer text-lg py-2 text-primary font-bold">Get Listed</a>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
