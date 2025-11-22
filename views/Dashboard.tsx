import React, { useState } from 'react';
import { User, ViewState } from '../types';
import { BarChart, Star, Briefcase, Settings, User as UserIcon, Calendar, DollarSign, Copy, Check } from 'lucide-react';

interface DashboardProps {
  user: User;
  setView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setView }) => {
  const [copied, setCopied] = useState(false);

  // Use real data or fallback to 0 for new users
  const stats = [
    { 
      label: 'Avg Rating', 
      value: user.rating ? user.rating.toFixed(1) : '0.0', 
      icon: Star, 
      color: 'text-yellow-500', 
      sub: `Based on ${user.reviewCount || 0} reviews` 
    },
    { 
      label: 'Completed', 
      value: (user.completedCount || 0).toString(), 
      icon: Briefcase, 
      color: 'text-purple-500', 
      sub: 'Total transactions' 
    },
    { 
      label: 'Views', 
      value: (user.profileViews || 0).toString(), 
      icon: UserIcon, 
      color: 'text-blue-500', 
      sub: 'Profile views this month' 
    },
  ];

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?ref=${user.uid}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-12">
        <h1 className="text-3xl font-serif font-medium mb-2 text-text">Welcome back, {user.displayName || 'Notary'}</h1>
        <p className="text-text-secondary">Manage your professional business and profile.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-xl flex items-start gap-4">
            <div className={`p-3 rounded-lg bg-surface border border-border ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-text mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-text-secondary mb-1">{stat.label}</div>
              <div className="text-xs text-text-secondary/50">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-serif mb-6 text-text">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Share & Earn (Affiliate) Card - FIRST CARD */}
        <div className="glass-panel p-6 rounded-xl border-2 border-primary/20 hover:border-primary/50 transition-colors bg-surface">
          <div className="mb-4 p-2 w-fit bg-green-500/10 text-green-500 rounded-lg"><DollarSign size={20} /></div>
          <h3 className="text-lg font-medium mb-2 text-text">Share & Earn</h3>
          <p className="text-sm text-text-secondary mb-4">Refer notaries and earn commissions.</p>
          
          <div className="bg-background border border-border rounded-lg p-2 flex items-center justify-between gap-2">
            <span className="text-xs text-text-secondary truncate font-mono flex-1 p-1 bg-surface/50 rounded select-all">
              {`${window.location.origin}/?ref=${user.uid}`}
            </span>
            <button 
              onClick={handleCopyLink}
              className="p-2 rounded-md bg-primary text-background hover:bg-primary-hover transition-colors shrink-0 font-medium text-xs"
              title="Copy Link"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-teal-500/10 text-teal-500 rounded-lg"><UserIcon size={20} /></div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              <span className="ml-2 text-xs font-medium text-text-secondary">Public</span>
            </label>
          </div>
          <h3 className="text-lg font-medium mb-2 text-text">Public Landing Page</h3>
          <p className="text-sm text-text-secondary mb-6">Customize your landing page visible to clients.</p>
          <div className="flex gap-3">
            <button 
              onClick={() => setView('landing-customizer')}
              className="flex-1 py-2 bg-primary text-background font-semibold rounded-lg text-sm hover:bg-primary-hover transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={() => setView('profile')}
              className="flex-1 py-2 border border-border rounded-lg text-sm hover:bg-surface/50 text-text transition-colors"
            >
              Preview
            </button>
          </div>
        </div>

        {/* Availability Card */}
        <div className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
          <div className="mb-4 p-2 w-fit bg-orange-500/10 text-orange-500 rounded-lg"><Calendar size={20} /></div>
          <h3 className="text-lg font-medium mb-2 text-text">Availability</h3>
          <p className="text-sm text-text-secondary mb-6">Manage your schedule and booking preferences.</p>
          <button className="w-full py-2 border border-border rounded-lg text-sm hover:bg-surface/50 text-text transition-colors">Manage Schedule</button>
        </div>

        {/* Settings Card */}
        <div className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
          <div className="mb-4 p-2 w-fit bg-purple-500/10 text-purple-500 rounded-lg"><Settings size={20} /></div>
          <h3 className="text-lg font-medium mb-2 text-text">Account Settings</h3>
          <p className="text-sm text-text-secondary mb-6">Update credentials, subscription, and security.</p>
          <button className="w-full py-2 border border-border rounded-lg text-sm hover:bg-surface/50 text-text transition-colors">Settings</button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;