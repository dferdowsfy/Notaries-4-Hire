
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './views/Home';
import Directory from './views/Directory';
import Dashboard from './views/Dashboard';
import LandingCustomizer from './views/LandingCustomizer';
import Profile from './views/Profile';
import Modal from './components/Modal';
import { User, ViewState } from './types';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('home');
  const [user, setUser] = useState<User | null>(null);
  
  // Theme State - DEFAULT TO LIGHT
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Modal State
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Registration Stepper State
  const [regStep, setRegStep] = useState(1);

  // Form Data State
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    password: '',
    city: '',
    state: '',
    phone: '',
    commissionNumber: '',
    experience: 'Less than 1 year',
    services: [] as string[],
    referredBy: ''
  });

  // Apply Theme Effect
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Check for referral code in URL
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setRegData(prev => ({ ...prev, referredBy: refCode }));
      sessionStorage.setItem('notaries4hire_ref', refCode);
    } else {
      const storedRef = sessionStorage.getItem('notaries4hire_ref');
      if (storedRef) {
        setRegData(prev => ({ ...prev, referredBy: storedRef }));
      }
    }

    // Auth state observer
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName,
          role: 'notary',
          ...userData
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setView('home');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Handle Input Changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };

  const handleServiceToggle = (service: string) => {
    setRegData(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  // Auth Actions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      setLoginOpen(false);
      setLoginData({ email: '', password: '' });
      setView('dashboard'); 
    } catch (error: any) {
      alert('Login Failed: ' + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regData.email, regData.password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: regData.fullName
      });

      const userData = {
        uid: firebaseUser.uid,
        email: regData.email,
        displayName: regData.fullName,
        role: 'notary',
        city: regData.city,
        state: regData.state,
        phone: regData.phone,
        commissionNumber: regData.commissionNumber,
        yearsExperience: regData.experience,
        specialties: regData.services,
        createdAt: new Date().toISOString(),
        bio: `Professional notary serving ${regData.city}, ${regData.state}.`,
        rating: 0,
        reviewCount: 0,
        completedCount: 0,
        profileViews: 0,
        referredBy: regData.referredBy || null
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userData);

      setUser(userData as User);
      setRegisterOpen(false);
      setRegStep(1);
      
      setRegData({
        fullName: '', email: '', password: '', city: '', state: '',
        phone: '', commissionNumber: '', experience: 'Less than 1 year', services: [], referredBy: ''
      });
      
      setView('dashboard');

    } catch (error: any) {
      alert('Registration Failed: ' + error.message);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home setView={setView} onRegister={() => setRegisterOpen(true)} />;
      case 'directory': return <Directory />;
      case 'dashboard': return user ? <Dashboard user={user} setView={setView} /> : <Home setView={setView} onRegister={() => setRegisterOpen(true)} />;
      case 'landing-customizer': return user ? <LandingCustomizer user={user} setView={setView} /> : <Home setView={setView} onRegister={() => setRegisterOpen(true)} />;
      case 'profile': return user ? <Profile user={user} currentUser={user} setView={setView} /> : <Home setView={setView} onRegister={() => setRegisterOpen(true)} />;
      case 'register': 
        setTimeout(() => {
            setView('home');
            setRegisterOpen(true);
            setRegStep(1); 
        }, 0);
        return <Home setView={setView} onRegister={() => setRegisterOpen(true)} />;
      default: return <Home setView={setView} onRegister={() => setRegisterOpen(true)} />;
    }
  };

  const renderRegistrationStep = () => {
    switch(regStep) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                value={regData.fullName}
                onChange={handleRegChange}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none" 
                placeholder="John Doe" 
                autoFocus 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                value={regData.email}
                onChange={handleRegChange}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none" 
                placeholder="your@email.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={regData.password}
                onChange={handleRegChange}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none" 
                placeholder="••••••••" 
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                <input 
                  type="text" 
                  name="city"
                  value={regData.city}
                  onChange={handleRegChange}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none" 
                  placeholder="Austin" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">State</label>
                <select 
                  name="state"
                  value={regData.state}
                  onChange={handleRegChange}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none"
                >
                  <option value="">Select</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Referral Code (Optional)</label>
              <input 
                type="text" 
                name="referredBy"
                value={regData.referredBy}
                onChange={handleRegChange}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none" 
                placeholder="e.g., USER_123" 
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={regData.phone}
                onChange={handleRegChange}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none" 
                placeholder="(555) 123-4567" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Commission Number</label>
              <input 
                type="text" 
                name="commissionNumber"
                value={regData.commissionNumber}
                onChange={handleRegChange}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none" 
                placeholder="12345678" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Years of Experience</label>
              <select 
                name="experience"
                value={regData.experience}
                onChange={handleRegChange}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none"
              >
                <option>Less than 1 year</option>
                <option>1-3 years</option>
                <option>3-5 years</option>
                <option>5+ years</option>
              </select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <label className="block text-sm font-medium text-text-secondary mb-2">Select Your Services</label>
            <div className="space-y-2">
              {['Remote Online Notary', 'Mobile Notary', 'Loan Signing Agent', 'Wedding Officiant', 'Apostille Services'].map((service) => (
                <label key={service} className="flex items-center p-3 border border-border rounded-lg hover:bg-surface/50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    checked={regData.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                  />
                  <span className="ml-3 text-sm text-text">{service}</span>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header 
        user={user} 
        currentView={currentView} 
        setView={setView} 
        onLogin={() => setLoginOpen(true)}
        onLogout={handleLogout}
        currentTheme={theme}
        toggleTheme={toggleTheme}
        onRegister={() => setRegisterOpen(true)}
      />

      <main>
        {renderView()}
      </main>

      <footer className="border-t border-border bg-surface/50 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h4 className="text-xl font-serif mb-4 text-text">Notaries4Hire</h4>
          <p className="text-text-secondary text-sm mb-8">Connecting you with professional notary services nationwide.</p>
          <div className="text-xs text-text-secondary/50">
            &copy; 2025 Notaries4Hire. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)} title="Welcome Back">
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <input 
                type="email" 
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none" 
                placeholder="you@example.com" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text focus:border-primary outline-none" 
                placeholder="••••••••" 
                required
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-primary text-background font-bold rounded-lg hover:bg-primary-hover transition-colors">Log In</button>
          </div>
        </form>
      </Modal>

      {/* Register Modal */}
      <Modal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} title="Get Listed as a Notary">
         <div className="mb-8">
           <div className="flex items-center justify-between w-full">
             {[1, 2, 3].map((step, index) => (
               <React.Fragment key={step}>
                 {index > 0 && (
                   <div className="flex-auto flex items-center justify-center text-text-secondary mx-2">
                      <div className={`h-[2px] w-full transition-colors duration-300 ${step <= regStep ? 'bg-primary' : 'bg-border'}`} />
                      <ChevronRight size={16} className={`mx-1 ${step <= regStep ? 'text-primary' : 'text-border'}`} />
                      <div className={`h-[2px] w-full transition-colors duration-300 ${step <= regStep ? 'bg-primary' : 'bg-border'}`} />
                   </div>
                 )}
                 <div className="flex flex-col items-center relative z-10">
                   <div 
                     className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 border-2
                       ${step <= regStep ? 'bg-primary border-primary text-background' : 'bg-surface border-border text-text-secondary'}
                       ${step < regStep ? 'bg-teal-500 border-teal-500 text-white' : ''}
                     `}
                   >
                     {step < regStep ? <Check size={14} /> : step}
                   </div>
                   <span className={`text-[10px] mt-1 font-medium uppercase tracking-wider ${step <= regStep ? 'text-primary' : 'text-text-secondary'}`}>
                     {step === 1 ? 'Account' : step === 2 ? 'Profile' : 'Services'}
                   </span>
                 </div>
               </React.Fragment>
             ))}
           </div>
         </div>

         <form onSubmit={(e) => { e.preventDefault(); }}>
          {renderRegistrationStep()}
          
          <div className="flex gap-3 mt-8 pt-4 border-t border-border">
            {regStep > 1 && (
              <button 
                type="button"
                onClick={() => setRegStep(regStep - 1)}
                className="flex-1 py-2.5 border border-border text-text font-medium rounded-lg hover:bg-surface transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            
            {regStep < 3 ? (
              <button 
                type="button" 
                onClick={() => setRegStep(regStep + 1)}
                className="flex-1 py-2.5 bg-primary text-background font-bold rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleRegister}
                className="flex-1 py-2.5 bg-primary text-background font-bold rounded-lg hover:bg-primary-hover transition-colors"
              >
                Create Account
              </button>
            )}
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default App;
