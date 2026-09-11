import React, { useState, useMemo } from 'react';
import PropertyCard from '../components/PropertyCard';
import SlotPicker from '../components/SlotPicker';
import QuickViewModal from '../components/QuickViewModal';
import Footer from '../components/Footer';
import { PROPERTY_TYPES, MOCK_PROPERTIES } from '../utils/constants';

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
  onNavigate = () => {},
  onSelectProperty = () => {},
  onSearch = () => {},
  onLanguageClick = () => {},
}) {
  // Search Mode: 'rent' | 'buy'
  const [listingMode, setListingMode] = useState('rent');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState('any');
  const [maxBudget, setMaxBudget] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  // Active Modals
  const [bookingSlotProperty, setBookingSlotProperty] = useState(null);
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [favorites, setFavorites] = useState(new Set(['sf-201', 'sf-202']));

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((p) => {
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
    if (onSearch) onSearch(queryPayload);
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
      <section className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[600px] h-[500px] bg-rose-600 rounded-full blur-[140px]" />
          <div className="absolute top-24 right-1/4 w-[500px] h-[450px] bg-indigo-600 rounded-full blur-[140px]" />
        </div>

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
          <div className="mt-6 bg-white rounded-3xl p-4 sm:p-5 text-gray-900 shadow-2xl border border-gray-100 max-w-4xl mx-auto text-left">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Location */}
              <div className="p-3 rounded-2xl border border-gray-200 hover:border-gray-900 transition">
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
              <div className="p-3 rounded-2xl border border-gray-200 hover:border-gray-900 transition">
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
              <div className="p-3 rounded-2xl border border-gray-200 hover:border-gray-900 transition">
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

              {/* Budget & Search Submit */}
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 rounded-2xl border border-gray-200 hover:border-gray-900 transition">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                    Max Budget ({listingMode === 'rent' ? '/mo' : 'Price'})
                  </label>
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-bold text-gray-500 mr-1">$</span>
                    <input
                      type="number"
                      placeholder={listingMode === 'rent' ? '4000' : '900000'}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      className="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-full px-5 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Anti-Scam Toggle */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <span className="text-emerald-700">🛡️ Only show verified listings</span>
                  <span className="text-gray-400 font-normal">(Title deed & physical inspection verified)</span>
                </span>
              </label>

              <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Zero viewing fees</span>
                <span>·</span>
                <span>Direct verified contacts</span>
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
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
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
              onClick={() => onNavigate('search', { mode: listingMode })}
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
                isFavorite={favorites.has(property.id)}
                onToggleFavorite={handleFavoriteToggle}
                onQuickView={setQuickViewProperty}
                onBookViewing={setBookingSlotProperty}
                onSelect={(id, prop) => {
                  if (onSelectProperty) onSelectProperty(id, prop);
                  else if (onNavigate) onNavigate('property-detail', { id, property: prop });
                }}
              />
            ))}
          </div>
        )}

        {/* 4. LANDLORD & AGENT CALLOUT (PRD: Property owners/agents efficient listing) */}
        <div className="mt-16 rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 via-gray-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-gray-800">
          <div className="max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
              For Landlords, Sellers & Certified Agents
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-3 tracking-tight">
              List once. Reach serious, verified seekers without WhatsApp chaos.
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
              Stop answering endless unfiltered messages from unqualified leads. Manage scheduled viewings, review digital tenant/buyer applications, and close deals securely on StayFinder.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('create-listing')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                List Your Property
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition border border-white/20"
              >
                Agent / Host Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 5. SLOT PICKER VIEWING MODAL */}
      {bookingSlotProperty && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <SlotPicker
            property={bookingSlotProperty}
            onCancel={() => setBookingSlotProperty(null)}
            onBookingConfirmed={(booking) => {
              console.log('Viewing booked successfully:', booking);
              setTimeout(() => {
                setBookingSlotProperty(null);
              }, 1500);
            }}
          />
        </div>
      )}

      {/* 6. QUICK VIEW MODAL */}
      {quickViewProperty && (
        <QuickViewModal
          property={quickViewProperty}
          isFavorite={favorites.has(quickViewProperty.id)}
          onToggleFavorite={handleFavoriteToggle}
          onClose={() => setQuickViewProperty(null)}
          onViewDetails={(id, prop) => {
            setQuickViewProperty(null);
            if (onSelectProperty) onSelectProperty(id, prop);
            else if (onNavigate) onNavigate('property-detail', { id, property: prop });
          }}
        />
      )}

      {/* 7. FOOTER */}
      <Footer onNavigate={onNavigate} onLanguageClick={onLanguageClick} />
    </div>
  );
}
