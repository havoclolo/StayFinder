import React, { useState, useMemo, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import SlotPicker from '../components/SlotPicker';
import QuickViewModal from '../components/QuickViewModal';
import Footer from '../components/Footer';
import PropertyTrackerWidget from '../components/PropertyTrackerWidget';
import { PROPERTY_TYPES } from '../utils/constants';
import { marketplaceStore } from '../services/marketplaceStore';
import { useCurrency } from '../context/CurrencyContext';

const userPersonas = [
  {
    title: 'Amaka & Tunde — Renter/Buyer',
    description:
      'Amaka and Tunde are looking for a property to rent or purchase. They want properties within their budget and preferred area, with detailed and accurate information. Renters prioritize move-in-ready properties, verified listings, real photos, transparent pricing, and a fast path from search to signed lease. Buyers have a longer decision cycle and need details such as title status, property size, neighborhood data, comparable properties, and a structured offer process.',
  },
  {
    title: 'Mrs. Okafor & Agent Dele — Landlord/Seller/Agent',
    description:
      'Mrs. Okafor and Agent Dele are property owners and agents who manage one or multiple properties. They want a simple way to create and manage listings, upload quality photos, attract qualified leads, and organize viewing requests. Agents managing multiple listings need a dashboard to efficiently track properties, leads, and viewing requests instead of relying on a chat inbox.',
  },
  {
    title: 'Admin/Ops',
    description:
      'Admin/Ops verifies listings and agents, moderates content, handles fraud reports, and resolves disputes.',
  },
];

/**
 * HomePage Component (Real Estate Marketplace Edition)
 * Aligned with Emmanuel Eseyin's PRD 1.0:
 * - Rent vs. Buy dual-mode toggle
 * - Structured property search (Location, Type, Budget, Bedrooms)
 * - Scam-Free Verified Marketplace Trust Pillars
 * - Direct SlotPicker viewing scheduler integration
 * - Landlord / Agent listing acquisition CTA
 */
export default function HomePage({
  isAuthenticated = false,
  onNavigate = () => {},
  onSelectProperty = () => {},
  onSearch = () => {},
  onLanguageClick = () => {},
}) {
  const { currency } = useCurrency();
  const [properties, setProperties] = useState(() => marketplaceStore.getListings());
  const [currentUser, setCurrentUser] = useState(() => marketplaceStore.getCurrentUser());
  const [viewings, setViewings] = useState(() => marketplaceStore.getViewings());
  const [applications, setApplications] = useState(() => marketplaceStore.getApplications());
  const [offers, setOffers] = useState(() => marketplaceStore.getOffers());
  const [leases, setLeases] = useState(() => marketplaceStore.getLeases());

  useEffect(() => {
    const unsub = marketplaceStore.subscribe(() => {
      setProperties(marketplaceStore.getListings());
      setCurrentUser(marketplaceStore.getCurrentUser());
      setViewings(marketplaceStore.getViewings());
      setApplications(marketplaceStore.getApplications());
      setOffers(marketplaceStore.getOffers());
      setLeases(marketplaceStore.getLeases());
    });
    return unsub;
  }, []);

  // Track if current authenticated user is a seeker who has actually started to buy or rent a house
  const hasActiveSeekerDeals = useMemo(() => {
    if (!isAuthenticated || !currentUser || currentUser.role !== 'seeker') return false;
    const userEmail = (currentUser.email || '').toLowerCase().trim();
    const userId = currentUser.id;
    const userName = (currentUser.name || '').toLowerCase().trim();

    const isUserMatch = (recordEmail, recordUserId, recordName) => {
      const e = (recordEmail || '').toLowerCase().trim();
      if (userEmail && e && userEmail === e) return true;
      if (userId && recordUserId && userId === recordUserId) return true;
      if (userEmail === 'amaka.nwosu@stayfinder.ng' || userId === 'user-seeker' || userId === 'user-amaka') {
        if (e === 'amaka.nwosu@stayfinder.ng' || recordUserId === 'user-amaka' || recordUserId === 'user-seeker') return true;
      }
      if (userEmail === 'tunde.b@stayfinder.ng' || userId === 'user-tunde') {
        if (e === 'tunde.b@stayfinder.ng' || recordUserId === 'user-tunde') return true;
      }
      const n = (recordName || '').toLowerCase().trim();
      if (userName && n && userName === n) return true;
      return false;
    };

    const hasApp = applications.some((a) => isUserMatch(a.applicantEmail, a.seekerId, a.applicantName));
    const hasOffer = offers.some((o) => isUserMatch(o.buyerEmail, o.buyerId, o.buyerName));
    const hasViewing = viewings.some((v) => isUserMatch(v.seekerEmail, v.seekerId, v.seekerName));

    return hasApp || hasOffer || hasViewing;
  }, [isAuthenticated, currentUser, applications, offers, viewings]);

  // Search Mode: 'rent' | 'buy'
  const [listingMode, setListingMode] = useState('rent');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState('any');
  const [maxBudget, setMaxBudget] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const currencySymbol = currency === 'NGN' ? '₦' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';

  // Active Modals
  const [bookingSlotProperty, setBookingSlotProperty] = useState(null);
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [favorites, setFavorites] = useState(new Set(['sf-201', 'sf-202']));

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // 1. Listing Mode (Rent vs Buy)
      if (p.listingType !== listingMode) return false;

      // 2. Verified Only Filter
      if (verifiedOnly && !p.isVerified) return false;

      // 3. Property Type
      if (selectedPropertyType !== 'all' && p.propertyType !== selectedPropertyType) {
        return false;
      }

      // 4. Location / Neighborhood
      if (locationQuery.trim()) {
        const q = locationQuery.toLowerCase().trim();
        const matches =
          p.location.toLowerCase().includes(q) ||
          (p.neighborhood && p.neighborhood.toLowerCase().includes(q)) ||
          p.title.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 5. Bedrooms
      if (selectedBedrooms !== 'any') {
        const req = selectedBedrooms === '4+' ? 4 : Number(selectedBedrooms);
        if (p.bedrooms < req) return false;
      }

      // 6. Max Budget
      if (maxBudget) {
        const budgetNum = Number(maxBudget);
        if (p.price > budgetNum) return false;
      }

      return true;
    });
  }, [listingMode, verifiedOnly, selectedPropertyType, locationQuery, selectedBedrooms, maxBudget]);

  const handleFavoriteToggle = (id, isLiked) => {
    if (!isAuthenticated) {
      onNavigate('login', { mode: 'login' });
      return;
    }

    setFavorites((prev) => {
      const next = new Set(prev);
      if (isLiked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const queryPayload = {
      mode: listingMode,
      location: locationQuery,
      type: selectedPropertyType,
      bedrooms: selectedBedrooms,
      maxBudget,
    };

    if (!isAuthenticated) {
      onNavigate('login', {
        mode: 'login',
        returnTo: { page: 'search', data: queryPayload },
      });
      return;
    }

    if (onSearch) onSearch(queryPayload);
  };

  const handleProtectedHomeAction = (callback, returnTo = null) => {
    if (!isAuthenticated) {
      onNavigate('login', { mode: 'login', returnTo });
      return;
    }
    callback();
  };

  const handleResetFilters = () => {
    setLocationQuery('');
    setSelectedPropertyType('all');
    setSelectedBedrooms('any');
    setMaxBudget('');
    setVerifiedOnly(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* 1. HERO SECTION & STRUCTURED REAL ESTATE SEARCH */}
      <section
        className="relative bg-cover bg-center text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85')",
        }}
      >
        <div className="absolute inset-0 bg-gray-950/65 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* PRD Value Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-emerald-300 border border-emerald-400/20 mb-6 shadow-inner">
            <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verified Marketplace · Zero Viewing Fees · End-to-End Move In</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            Find verified houses to{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              rent or buy
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-medium">
            Connect directly with verified landlords, certified agents, and sellers. Schedule free viewings and complete transactions transparently.
          </p>

          {/* RENT VS BUY TOGGLE PILLS */}
          <div className="mt-8 inline-flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
            <button
              type="button"
              onClick={() => setListingMode('rent')}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                listingMode === 'rent'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Rent a House
            </button>
            <button
              type="button"
              onClick={() => setListingMode('buy')}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                listingMode === 'buy'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Buy a Property
            </button>
          </div>

          {/* STRUCTURED SEARCH BAR */}
          <div className="mt-8 bg-white/95 rounded-[2rem] p-4 sm:p-5 text-gray-900 shadow-2xl border border-white/70 max-w-5xl mx-auto text-left backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1 mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Search verified homes</p>
                <p className="mt-1 text-xs text-gray-500">Find real, inspected properties across Nigeria.</p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {listingMode === 'rent' ? '70 homes for rent' : '100 homes for sale'}
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_0.9fr_1.2fr_auto] gap-2.5">
              {/* Location */}
              <div className="min-h-[64px] p-3 rounded-2xl border border-gray-200 hover:border-emerald-500 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  Location / Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lekki, Ikoyi, Victoria Island"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full mt-1 text-xs font-bold text-gray-900 bg-transparent focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Property Type */}
              <div className="min-h-[64px] p-3 rounded-2xl border border-gray-200 hover:border-emerald-500 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  Property Type
                </label>
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="w-full mt-1 text-xs font-bold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.id} value={t.id} className="text-gray-900">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="min-h-[64px] p-3 rounded-2xl border border-gray-200 hover:border-emerald-500 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  Bedrooms
                </label>
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="w-full mt-1 text-xs font-bold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="any">Any Bedrooms</option>
                  <option value="1">1+ Bedroom</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4+">4+ Bedrooms</option>
                </select>
              </div>

              {/* Budget */}
              <div className="min-h-[64px] p-3 rounded-2xl border border-gray-200 hover:border-emerald-500 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  Max {listingMode === 'rent' ? 'Yearly Rent' : 'Purchase Price'}
                </label>
                <div className="flex items-center mt-1">
                  <span className="text-xs font-black text-emerald-700 mr-1">{currencySymbol}</span>
                  <input
                    type="number"
                    placeholder={listingMode === 'rent' ? '12,000,000' : '250,000,000'}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="min-h-[64px] px-5 rounded-2xl bg-gray-950 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>Search</span>
              </button>
            </form>

            {/* Anti-Scam Toggle */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-700">🛡️ Only show verified listings</span>
                  <span className="text-gray-400 font-normal hidden md:inline">Title deed & physical inspection verified</span>
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-2 text-gray-500 text-[11px]">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700">₦0 viewing fees</span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 font-bold text-gray-600">Direct verified contacts</span>
                {hasActiveSeekerDeals && (
                  <a
                    href="#property-tracker"
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-3 py-1 font-bold text-white transition flex items-center gap-1 shadow-xs"
                  >
                    <span>📍 Track Rent / Buy Progress</span>
                    <span>↓</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRD TRUST PILLARS (Addressing Fragmentation & Scams) */}
      <section className="bg-emerald-50/50 border-b border-emerald-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Physically Verified</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Every home inspected by StayFinder agents to eliminate fake listings.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Zero Viewing Fees</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Never pay "inspection" or "agent mobilization" fees to view properties.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Instant Viewing Slots</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Book guaranteed in-person or live video tours directly without endless calls.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Guided Transaction</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Structured offer → verified agreement → secure escrow deposit → move-in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 LIVE DEALS & APPLICATION PROGRESS TRACKER (Only for seekers with active deals) */}
      {hasActiveSeekerDeals && (
        <div id="property-tracker">
          <PropertyTrackerWidget
            currentUser={currentUser}
            viewings={viewings}
            applications={applications}
            offers={offers}
            leases={leases}
            currency={currency}
            onNavigate={onNavigate}
            onSelectProperty={(id) => {
              const prop = properties.find((p) => p.id === id);
              handleProtectedHomeAction(() => {
                if (onSelectProperty) onSelectProperty(id, prop);
                else if (onNavigate) onNavigate('property-detail', { id, property: prop });
              }, { page: 'property-detail', data: { id, property: prop } });
            }}
          />
        </div>
      )}

      {/* 3. PROPERTY MARKETPLACE CATALOG */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${
                listingMode === 'rent' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {listingMode === 'rent' ? 'Properties For Rent' : 'Properties For Sale'}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                ({filteredProperties.length} verified listings available)
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
              {locationQuery ? `Verified Homes in "${locationQuery}"` : `Available Stays & Houses to ${listingMode === 'rent' ? 'Rent' : 'Buy'}`}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 underline"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => handleProtectedHomeAction(
                () => onNavigate('search', { mode: listingMode }),
                { page: 'search', data: { mode: listingMode } },
              )}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-xs font-bold transition"
            >
              Explore Map View 🗺️
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200 p-8 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900">No matching listings found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try switching between "Rent" and "Buy", clearing the location search, or widening your budget.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isAuthenticated={isAuthenticated}
                isFavorite={favorites.has(property.id)}
                onToggleFavorite={handleFavoriteToggle}
                onQuickView={(property) => handleProtectedHomeAction(
                  () => setQuickViewProperty(property),
                  null,
                )}
                onBookViewing={(property) => handleProtectedHomeAction(
                  () => setBookingSlotProperty(property),
                  null,
                )}
                onSelect={(id, prop) => {
                  handleProtectedHomeAction(() => {
                    if (onSelectProperty) onSelectProperty(id, prop);
                    else if (onNavigate) onNavigate('property-detail', { id, property: prop });
                  }, { page: 'property-detail', data: { id, property: prop } });
                }}
              />
            ))}
          </div>
        )}

      </main>

      {/* 6. SLOT PICKER VIEWING MODAL */}
      {bookingSlotProperty && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <SlotPicker
            property={bookingSlotProperty}
            onCancel={() => setBookingSlotProperty(null)}
            onBookingConfirmed={() => {
              setTimeout(() => {
                setBookingSlotProperty(null);
              }, 1500);
            }}
          />
        </div>
      )}

      {/* 7. QUICK VIEW MODAL */}
      {quickViewProperty && (
        <QuickViewModal
          property={quickViewProperty}
          isFavorite={favorites.has(quickViewProperty.id)}
          onToggleFavorite={handleFavoriteToggle}
          onClose={() => setQuickViewProperty(null)}
          onViewDetails={(id, prop) => {
            setQuickViewProperty(null);
            handleProtectedHomeAction(() => {
              onNavigate('property-detail', { id, property: prop });
            }, { page: 'property-detail', data: { id, property: prop } });
          }}
        />
      )}

      {/* 8. FOOTER */}
      <Footer onNavigate={onNavigate} onLanguageClick={onLanguageClick} />
    </div>
  );
}
