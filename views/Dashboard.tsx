import React from 'react';
import { User, ViewState } from '../types';
import { BarChart, Star, Briefcase, Settings, User as UserIcon, Calendar } from 'lucide-react';

interface DashboardProps {
  user: User;
  setView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setView }) => {
  const stats = [
    { label: 'Avg Rating', value: '4.8', icon: Star, color: 'text-yellow-500', sub: 'Based on 24 reviews' },
    { label: 'Completed', value: '156', icon: Briefcase, color: 'text-purple-500', sub: 'Total transactions' },
    { label: 'Views', value: '1.2k', icon: UserIcon, color: 'text-blue-500', sub: 'Profile views this month' },
  ];

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