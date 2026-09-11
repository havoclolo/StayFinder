import React, { useState } from 'react';

/**
 * Footer Component
 * Aligned with Emmanuel Eseyin's PRD for StayFinder:
 * A property marketplace for buying and renting houses.
 * Features:
 * - Categorized links for Seekers, Landlords/Agents, Trust & Safety, and Company
 * - Scam-free assurance & anti-fraud reporting
 * - Email newsletter for verified property alerts
 * - Regional currency & language settings
 * - Navigation callbacks for seamless SPA routing
 */
export default function Footer({
  onNavigate = () => {},
  onLanguageClick = () => {},
}) {
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscriberEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscriberEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-400 text-xs border-t border-gray-800">
      {/* 1. NEWSLETTER & TRUST BANNER */}
      <div className="border-b border-gray-800/80 bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Scam-Free Property Alerts
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Get notified when verified homes are listed in your neighborhood
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              Never miss a genuine landlord listing or new verified development. Zero spam, unsubscribe anytime.
            </p>
          </div>

          {/* Subscribe Form */}
          <form onSubmit={handleSubscribe} className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-80">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
            >
              {subscribed ? 'Subscribed ✓' : 'Get Alerts'}
            </button>
          </form>
        </div>
      </div>

      {/* 2. CATEGORICAL LINK COLUMNS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-gray-800">
          {/* Column 1: For Property Seekers */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="text-emerald-400">🔑</span>
              <span>For Property Seekers</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', { mode: 'rent' })}
                  className="hover:text-emerald-400 transition hover:underline text-left"
                >
                  Houses &amp; Flats for Rent
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home', { mode: 'buy' })}
                  className="hover:text-emerald-400 transition hover:underline text-left"
                >
                  Properties for Sale
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="hover:text-emerald-400 transition hover:underline text-left"
                >
                  Verified Listings Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('search')}
                  className="hover:text-emerald-400 transition hover:underline text-left"
                >
                  Interactive Map Search
                </button>
              </li>
              <li>
                <a href="#zero-fees" className="hover:text-emerald-400 transition hover:underline">
                  Zero Viewing Fees Guarantee
                </a>
              </li>
              <li>
                <a href="#booking-guide" className="hover:text-emerald-400 transition hover:underline">
                  How Viewing Slots Work
                </a>
              </li>
              <li>
                <a href="#offer-flow" className="hover:text-emerald-400 transition hover:underline">
                  Offer to Move-In Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Landlords, Sellers & Agents */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="text-emerald-400">🏢</span>
              <span>Owners &amp; Agents</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('create-listing')}
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>+ List Your Property</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Fast</span>
                </button>
              </li>
              <li>
                <a href="#landlord-verification" className="hover:text-emerald-400 transition hover:underline">
                  Landlord Verification Process
                </a>
              </li>
              <li>
                <a href="#agent-kyc" className="hover:text-emerald-400 transition hover:underline">
                  Certified Agent Accreditation
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition hover:underline text-left"
                >
                  Lister Management Dashboard
                </button>
              </li>
              <li>
                <a href="#slot-management" className="hover:text-emerald-400 transition hover:underline">
                  Inbound Viewing Management
                </a>
              </li>
              <li>
                <a href="#digital-tenancy" className="hover:text-emerald-400 transition hover:underline">
                  Digital Lease Agreement Tool
                </a>
              </li>
              <li>
                <a href="#pricing-guidance" className="hover:text-emerald-400 transition hover:underline">
                  Neighborhood Pricing Index
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Anti-Fraud */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="text-emerald-400">🛡️</span>
              <span>Trust &amp; Verification</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#physical-inspection" className="hover:text-emerald-400 transition hover:underline">
                  Physical Inspection Standards
                </a>
              </li>
              <li>
                <a href="#title-verification" className="hover:text-emerald-400 transition hover:underline">
                  Title &amp; Deed Legal Search
                </a>
              </li>
              <li>
                <a href="#anti-fraud" className="text-rose-400 font-bold hover:underline flex items-center gap-1">
                  <span>Report Fraudulent Agent / Ad</span>
                </a>
              </li>
              <li>
                <a href="#caution-deposit" className="hover:text-emerald-400 transition hover:underline">
                  Caution Deposit Escrow Protection
                </a>
              </li>
              <li>
                <a href="#scam-prevention" className="hover:text-emerald-400 transition hover:underline">
                  Rental Scam Red Flags
                </a>
              </li>
              <li>
                <a href="#fair-housing" className="hover:text-emerald-400 transition hover:underline">
                  Fair Housing &amp; Non-Discrimination
                </a>
              </li>
              <li>
                <a href="#dispute" className="hover:text-emerald-400 transition hover:underline">
                  Dispute Resolution Protocol
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: StayFinder Platform & Support */}
          <div>
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="text-emerald-400">🌐</span>
              <span>StayFinder</span>
            </h4>
            <p className="text-gray-400 leading-relaxed mb-4 text-[11px]">
              StayFinder connects property seekers with verified landlords, sellers, and agents end-to-end — from listing to move-in. Founded by <strong>Emmanuel Eseyin</strong>.
            </p>

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-white font-bold">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>24/7 Support: support@stayfinder.com</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Operating across Lagos, Abuja, London &amp; Top Metro Hubs
              </p>
            </div>

            {/* Currency & Language Button */}
            <button
              type="button"
              onClick={onLanguageClick}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold border border-gray-700 transition hover:border-gray-500"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>USD ($) · English</span>
            </button>
          </div>
        </div>

        {/* 3. ANTI-FRAUD LEGAL STATEMENT (PRD Requirement) */}
        <div className="py-6 border-b border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
            <p>
              <strong className="text-gray-300">Scam-Free Property Guarantee:</strong> StayFinder strictly penalizes any agent or owner attempting to solicit off-platform viewing fees. All viewings must be scheduled freely through StayFinder slots.
            </p>
          </div>
          <span className="shrink-0 text-emerald-400 font-mono text-[10px] bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800">
            PRD v1.0 Compliant
          </span>
        </div>

        {/* 4. BOTTOM BAR: COPYRIGHT & SOCIALS */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
            <span>© 2026 StayFinder, Inc. All rights reserved.</span>
            <span>·</span>
            <a href="#privacy" className="hover:text-white transition hover:underline">Privacy Policy</a>
            <span>·</span>
            <a href="#terms" className="hover:text-white transition hover:underline">Terms of Service</a>
            <span>·</span>
            <a href="#cookies" className="hover:text-white transition hover:underline">Cookie Policy</a>
            <span>·</span>
            <a href="#sitemap" className="hover:text-white transition hover:underline">Sitemap</a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#twitter" className="hover:text-emerald-400 transition" aria-label="X / Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#linkedin" className="hover:text-emerald-400 transition" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 0 0 0-3.3 1.66 1.66 0 0 0 0 3.3m1.4 9.74v-8.37H5.06v8.37h2.8z" />
              </svg>
            </a>
            <a href="#instagram" className="hover:text-emerald-400 transition" aria-label="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#facebook" className="hover:text-emerald-400 transition" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
