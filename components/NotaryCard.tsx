
import React from 'react';
import { Notary } from '../types';
import { Star, MapPin, CheckCircle } from 'lucide-react';

interface NotaryCardProps {
  notary: Notary;
  onClick: (notary: Notary) => void;
}

const NotaryCard: React.FC<NotaryCardProps> = ({ notary, onClick }) => {
  return (
    <div 
      onClick={() => onClick(notary)}
      className="group glass-panel rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl bg-surface/50"
    >
      {/* Image Header */}
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img 
          src={notary.photo} 
          alt={notary.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-3 left-4 z-20">
          {/* Keep text-white here as it is over a dark image overlay */}
          <h3 className="text-xl font-semibold text-white font-serif tracking-tight">{notary.name}</h3>
          <p className="text-primary text-sm font-medium">{notary.specialty}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="font-bold text-text">{notary.rating}</span>
            <span className="text-text-secondary text-xs">({notary.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-text-secondary text-sm">
            <MapPin size={14} />
            <span>{notary.location}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {notary.services.slice(0, 2).map((service, idx) => (
              <span key={idx} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs border border-primary/20">
                {service}
              </span>
            ))}
            {notary.services.length > 2 && (
              <span className="px-2 py-1 rounded-md bg-surface border border-border text-text-secondary text-xs">
                +{notary.services.length - 2} more
              </span>
            )}
          </div>

          <p className="text-sm text-text-secondary line-clamp-2 font-light leading-relaxed">
            {notary.bio}
          </p>
          
          <div className="pt-2 flex items-center justify-between text-sm">
             <span className="text-text font-medium">{notary.price}</span>
             <span className="text-teal-500 text-xs flex items-center gap-1">
               <CheckCircle size={12} /> Verified
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotaryCard;
