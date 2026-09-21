import React from 'react';
import { PRESET_USERS, marketplaceStore } from '../services/marketplaceStore';
import { useAuth } from '../context/AuthContext';

export default function PersonaSwitcher({ onNavigate = () => {} }) {
  const { user, login } = useAuth();

  const handleSelect = (key) => {
    const selected = PRESET_USERS[key];
    if (selected) {
      marketplaceStore.switchPersona(key);
      login({ email: selected.email, password: 'password123' });
    }
  };

  const personas = [
    { key: 'amaka', label: 'Amaka (Renter)', role: 'seeker', color: 'emerald' },
    { key: 'tunde', label: 'Tunde (Buyer)', role: 'seeker', color: 'blue' },
    { key: 'okafor', label: 'Mrs. Okafor (Landlord)', role: 'landlord', color: 'amber' },
    { key: 'dele', label: 'Agent Dele (Agent)', role: 'agent', color: 'purple' },
    { key: 'admin', label: 'Admin / Ops', role: 'admin', color: 'rose' },
  ];

  return (
    <div className="bg-gray-900 text-white text-xs py-2 px-4 shadow-md sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-black uppercase tracking-wider text-gray-300">PRD Persona Switcher:</span>
          <span className="font-semibold text-white bg-gray-800 px-2.5 py-0.5 rounded-full border border-gray-700">
            Current: {user?.name || 'Guest'} ({user?.role?.toUpperCase()})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-gray-400 hidden sm:inline mr-1">Switch View:</span>
          {personas.map((p) => {
            const isCurrent = user?.email?.toLowerCase().includes(p.key);
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  handleSelect(p.key);
                  if (p.role === 'admin') onNavigate('admin');
                }}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-white text-gray-950 shadow-sm scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{p.label}</span>
                {isCurrent && <span className="text-emerald-600 font-black">✓</span>}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all localStorage back to initial PRD demo state?')) {
                marketplaceStore.resetStore();
                window.location.reload();
              }
            }}
            title="Reset LocalStorage Data"
            className="ml-2 px-2 py-1 bg-gray-800 hover:bg-emerald-900 text-gray-300 hover:text-white rounded-lg text-[10px] font-bold transition border border-gray-700"
          >
            ↺ Reset Storage
          </button>
        </div>
      </div>
    </div>
  );
}
