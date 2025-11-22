
import React, { useEffect, useState } from 'react';
import { getNotaries } from '../services/dataService';
import { Notary, ViewState } from '../types';
import NotaryCard from '../components/NotaryCard';
import { Search, Shield, ShieldCheck, Car, Headset, CheckCircle, MessageCircle, Calendar, User, Star, BarChart, Globe, Home as HomeIcon, Fingerprint, Heart, Plane } from 'lucide-react';

interface HomeProps {
  setView: (view: ViewState) => void;
  onRegister: () => void;
}

const CATEGORIES = [
  { name: 'Mobile Notary', icon: Car, count: 2103 },
  { name: 'Apostille', icon: Globe, count: 567 },
  { name: 'Loan Signing', icon: HomeIcon, count: 1456 },
  { name: 'Fingerprinting', icon: Fingerprint, count: 892 },
  { name: 'Weddings', icon: Heart, count: 892 },
  { name: 'Immigration', icon: Plane, count: 645 },
];

const Home: React.FC<HomeProps> = ({ setView, onRegister }) => {
  const [featuredNotaries, setFeaturedNotaries] = useState<Notary[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      const allNotaries = await getNotaries();
      // In a real app, you'd query for featured=true. For now, take first 4.
      setFeaturedNotaries(allNotaries.slice(0, 4));
    };
    loadFeatured();
  }, []);

  return (
    <div className="flex flex-col w-full">
      
      {/* Hero Section */}
      <section className="relative py-32 px-4 text-center overflow-hidden border-b border-border">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-serif font-light text-text mb-8 leading-tight tracking-tight">
            Find a Certified Notary <br />
            <span className="text-text dark:text-primary font-bold mt-2 block">Fast, Secure, Nationwide.</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-12 font-light max-w-2xl mx-auto">
            Connect with verified professionals for all your documentation needs. Search by City, State, or ZIP Code.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 p-2 bg-surface/80 backdrop-blur-xl rounded-2xl border border-border flex flex-col md:flex-row gap-2 shadow-lg">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-x-1/2 text-text-secondary" size={20} />
              <input 
                type="text" 
                placeholder="Enter city, state, or ZIP code" 
                className="w-full h-12 md:h-14 pl-12 pr-4 bg-transparent text-text placeholder-text-secondary/50 focus:outline-none text-lg"
              />
            </div>
            <button 
              onClick={() => setView('directory')}
              className="h-12 md:h-14 px-8 rounded-xl bg-primary text-background font-bold text-lg hover:bg-primary-hover transition-colors shadow-glow"
            >
              Find Notary
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => setView('directory')} className="text-text-secondary hover:text-primary transition-colors text-sm uppercase tracking-widest font-bold">Browse Directory</button>
            <span className="text-border">|</span>
            <button onClick={onRegister} className="text-text-secondary hover:text-primary transition-colors text-sm uppercase tracking-widest font-bold">List Your Business</button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-b border-border bg-surface/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 text-text-secondary">
            {[
              { icon: ShieldCheck, text: "Verified Professionals" },
              { icon: Shield, text: "Fully Insured" },
              { icon: Car, text: "Mobile Available" },
              { icon: Headset, text: "24/7 Support" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <item.icon size={32} className="text-primary" strokeWidth={1.5} />
                <span className="text-sm uppercase tracking-wider font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-24 bg-background relative scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-text mb-16">Browse by Service</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <div 
                key={i}
                onClick={() => setView('directory')}
                className="group p-6 rounded-xl bg-surface border border-border hover:border-primary/30 transition-all cursor-pointer text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <cat.icon size={24} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-medium mb-1 text-text group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-xs text-text-secondary">{cat.count}+ pros</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-24 border-y border-border bg-surface/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-3xl md:text-4xl font-serif mb-2 text-text">Featured Notaries</h2>
               <p className="text-text-secondary font-light">Top rated professionals in your network</p>
            </div>
            <button onClick={() => setView('directory')} className="text-primary hover:text-text transition-colors">View All &rarr;</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNotaries.length > 0 ? featuredNotaries.map(notary => (
              <NotaryCard key={notary.id} notary={notary} onClick={() => {}} />
            )) : (
              <div className="col-span-4 text-center text-text-secondary py-12">
                No featured notaries found. Be the first to list!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto glass-panel p-12 rounded-3xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 bg-primary text-background font-bold uppercase text-xs tracking-wider rounded-bl-xl">Founders Rate</div>
           
           <h2 className="text-3xl md:text-4xl font-serif mb-4 text-text">Get Listed Today</h2>
           <p className="text-text-secondary mb-8">Join thousands of notaries growing their business.</p>
           
           <div className="flex items-baseline justify-center gap-2 mb-12">
             <span className="text-2xl text-text-secondary">$</span>
             <span className="text-7xl font-light text-primary font-serif">19.99</span>
             <span className="text-text-secondary">/month</span>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 text-left max-w-2xl mx-auto">
             {[
               { icon: CheckCircle, text: "Professional Landing Page" },
               { icon: MessageCircle, text: "Live Chat with Clients" },
               { icon: Calendar, text: "Appointment Scheduler" },
               { icon: User, text: "Profile Management" },
               { icon: Star, text: "Reviews System" },
               { icon: BarChart, text: "Analytics Dashboard" }
             ].map((f, i) => (
               <div key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                 <f.icon size={16} className="text-primary shrink-0" />
                 <span>{f.text}</span>
               </div>
             ))}
           </div>

           <button 
             onClick={onRegister}
             className="btn px-12 py-4 bg-primary text-background font-bold text-lg rounded-xl hover:bg-primary-hover transition-transform hover:-translate-y-1 shadow-glow"
           >
             Lock in Founders Rate
           </button>
           <p className="mt-6 text-xs text-text-secondary/50">Cancel anytime. No hidden fees.</p>
        </div>
      </section>

    </div>
  );
};

export default Home;
