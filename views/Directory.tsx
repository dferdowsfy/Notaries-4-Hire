import React, { useState, useEffect } from 'react';
import { getNotaries } from '../services/dataService';
import { Notary } from '../types';
import NotaryCard from '../components/NotaryCard';
import { Filter, Search } from 'lucide-react';

const Directory: React.FC = () => {
  const [notaries, setNotaries] = useState<Notary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchNotaries = async () => {
      const data = await getNotaries();
      setNotaries(data); // In real app, this would filter based on query
      setLoading(false);
    };
    fetchNotaries();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-serif font-medium mb-2">Notary Directory</h2>
           <p className="text-text-secondary font-light">Find the perfect professional for your needs</p>
        </div>
        <button 
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary hover:text-primary transition-colors md:hidden"
        >
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${filterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="glass-panel p-6 rounded-xl sticky top-24">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
              <Filter size={18} className="text-primary" /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Specialty</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none">
                  <option>All Specialties</option>
                  <option>Remote Online Notary</option>
                  <option>Mobile Notary</option>
                  <option>Loan Signing Agent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Sort By</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none">
                  <option>Highest Rated</option>
                  <option>Most Reviews</option>
                  <option>Price: Low to High</option>
                </select>
              </div>
              
              <button className="w-full py-2 mt-4 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">
                Reset Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {/* Search Bar Inline */}
          <div className="mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input 
              type="text" 
              placeholder="Refine search by name or location..." 
              className="w-full h-12 pl-12 pr-4 bg-surface border border-border rounded-xl focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {loading ? (
            <div className="text-center py-20 text-text-secondary">Loading directory...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notaries.map(notary => (
                <NotaryCard key={notary.id} notary={notary} onClick={() => {}} />
              ))}
              {/* Duplicate for visual fill in demo */}
              {notaries.map(notary => (
                <NotaryCard key={`dup-${notary.id}`} notary={notary} onClick={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Directory;