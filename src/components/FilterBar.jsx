import React, { useState, useRef, useEffect } from 'react';
import { PROPERTY_CATEGORIES } from '../utils/constants';

/**
 * FilterBar Component
 * Includes:
 * - Category icon slider with scroll left/right arrows
 * - "Filters" modal button with active filter count badge
 * - "Display total before taxes" switch
 * - Comprehensive Airbnb-style Filter Dialog Modal
 */
export default function FilterBar({
  selectedCategory = 'all',
  onSelectCategory = () => {},
  filters = {},
  onApplyFilters = () => {},
  showTaxes = false,
  onToggleTaxes = () => {},
  totalMatchesCount = 0,
}) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    minPrice: filters.minPrice || 50,
    maxPrice: filters.maxPrice || 1000,
    placeType: filters.placeType || 'any', // 'any' | 'entire_place' | 'private_room'
    bedrooms: filters.bedrooms || 'any',
    bathrooms: filters.bathrooms || 'any',
    amenities: filters.amenities || [],
  });

  const categoryScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position for slider arrows
  const checkScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  // Calculate active filter count
  const activeFiltersCount = [
    localFilters.minPrice > 50 || localFilters.maxPrice < 1000,
    localFilters.placeType !== 'any',
    localFilters.bedrooms !== 'any',
    localFilters.bathrooms !== 'any',
    localFilters.amenities.length > 0,
  ].filter(Boolean).length;

  const handleAmenityToggle = (amenityId) => {
    setLocalFilters((prev) => {
      const exists = prev.amenities.includes(amenityId);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenityId)
          : [...prev.amenities, amenityId],
      };
    });
  };

  const handleResetFilters = () => {
    const reset = {
      minPrice: 50,
      maxPrice: 1000,
      placeType: 'any',
      bedrooms: 'any',
      bathrooms: 'any',
      amenities: [],
    };
    setLocalFilters(reset);
    onApplyFilters(reset);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setIsFilterModalOpen(false);
  };

  const amenityOptions = [
    { id: 'wifi', label: 'Fast Wifi', icon: '📶' },
    { id: 'pool', label: 'Pool', icon: '🏊' },
    { id: 'hottub', label: 'Hot tub', icon: '🛁' },
    { id: 'free_parking', label: 'Free parking', icon: '🚗' },
    { id: 'air_conditioning', label: 'Air conditioning', icon: '❄️' },
    { id: 'kitchen', label: 'Full Kitchen', icon: '🍳' },
    { id: 'fireplace', label: 'Indoor fireplace', icon: '🔥' },
    { id: 'dedicated_workspace', label: 'Dedicated workspace', icon: '💻' },
    { id: 'pet_friendly', label: 'Pet friendly', icon: '🐾' },
    { id: 'waterfront', label: 'Waterfront', icon: '🌊' },
  ];

  // Map category icons to SVG paths
  const renderCategoryIcon = (id) => {
    switch (id) {
      case 'beachfront':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        );
      case 'cabins':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        );
      case 'mansions':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.333M4.5 21V10.333" />
          </svg>
        );
      case 'lakefront':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        );
      case 'trending':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          </svg>
        );
      case 'countryside':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        );
      case 'tiny_homes':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        );
      case 'ski_in':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5" />
          </svg>
        );
      case 'iconic_cities':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        );
    }
  };

  return (
    <>
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              className="hidden md:flex shrink-0 w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-gray-900 shadow-sm items-center justify-center text-gray-700 hover:scale-105 transition"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Categories Slider */}
          <div
            ref={categoryScrollRef}
            onScroll={checkScroll}
            className="flex-1 flex items-center gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {PROPERTY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 transition group whitespace-nowrap focus:outline-none ${
                    isActive
                      ? 'border-gray-900 text-gray-900 font-bold opacity-100'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {renderCategoryIcon(cat.id)}
                  </div>
                  <span className="text-xs tracking-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollCategories('right')}
              className="hidden md:flex shrink-0 w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-gray-900 shadow-sm items-center justify-center text-gray-700 hover:scale-105 transition"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Filters Modal Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 hover:border-gray-900 rounded-xl text-xs font-semibold text-gray-800 bg-white shadow-xs hover:shadow-sm transition active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Display Total Before Taxes Toggle */}
            <div className="hidden lg:flex items-center gap-2.5 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700">
              <span className="truncate">Display taxes</span>
              <button
                type="button"
                onClick={onToggleTaxes}
                aria-label="Toggle tax calculation"
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition duration-300 ${
                  showTaxes ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                    showTaxes ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="font-bold text-base text-gray-900">Filters</h3>
              <div className="w-8" /> {/* Spacer */}
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 overflow-y-auto space-y-8 divide-y divide-gray-100">
              {/* 1. Type of Place */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-3">Type of place</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'any', label: 'Any type', desc: 'Rooms, homes & villas' },
                    { id: 'entire_place', label: 'Entire home', desc: 'A place all to yourself' },
                    { id: 'private_room', label: 'Room', desc: 'Your own private room' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setLocalFilters({ ...localFilters, placeType: type.id })}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        localFilters.placeType === type.id
                          ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-xs text-gray-900">{type.label}</p>
                      <p className="text-[11px] text-gray-500 mt-1 leading-snug">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Price Range */}
              <div className="pt-6">
                <h4 className="text-base font-bold text-gray-900 mb-1">Price range</h4>
                <p className="text-xs text-gray-500 mb-4">Nightly prices before taxes and fees</p>

                {/* Simulated Price Histogram */}
                <div className="flex items-end gap-1 h-14 mb-4 px-2">
                  {[20, 35, 60, 80, 95, 100, 75, 55, 40, 65, 85, 90, 70, 45, 30, 20, 15].map((val, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${val}%` }}
                      className="flex-1 bg-gray-200 rounded-t-sm"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-gray-900">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Minimum</label>
                    <div className="flex items-center text-sm font-bold text-gray-900">
                      <span>$</span>
                      <input
                        type="number"
                        min="20"
                        max={localFilters.maxPrice}
                        value={localFilters.minPrice}
                        onChange={(e) => setLocalFilters({ ...localFilters, minPrice: Number(e.target.value) })}
                        className="w-full bg-transparent focus:outline-none pl-1"
                      />
                    </div>
                  </div>

                  <span className="text-gray-400 font-bold">–</span>

                  <div className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-gray-900">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Maximum</label>
                    <div className="flex items-center text-sm font-bold text-gray-900">
                      <span>$</span>
                      <input
                        type="number"
                        min={localFilters.minPrice}
                        max="2500"
                        value={localFilters.maxPrice}
                        onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: Number(e.target.value) })}
                        className="w-full bg-transparent focus:outline-none pl-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Rooms and Beds */}
              <div className="pt-6">
                <h4 className="text-base font-bold text-gray-900 mb-4">Rooms and beds</h4>

                {/* Bedrooms */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {['any', 1, 2, 3, 4, '5+'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setLocalFilters({ ...localFilters, bedrooms: num })}
                        className={`px-5 py-2 rounded-full text-xs font-semibold border transition ${
                          localFilters.bedrooms === num
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-800 border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        {num === 'any' ? 'Any' : num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Bathrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {['any', 1, 2, 3, '4+'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setLocalFilters({ ...localFilters, bathrooms: num })}
                        className={`px-5 py-2 rounded-full text-xs font-semibold border transition ${
                          localFilters.bathrooms === num
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-800 border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        {num === 'any' ? 'Any' : num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Amenities */}
              <div className="pt-6">
                <h4 className="text-base font-bold text-gray-900 mb-3">Amenities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {amenityOptions.map((amenity) => {
                    const isSelected = localFilters.amenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                          isSelected
                            ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-base">{amenity.icon}</span>
                        <span className="text-xs font-semibold text-gray-900">{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-gray-900 underline hover:text-emerald-600 transition"
              >
                Clear all
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-md active:scale-95"
              >
                Show {totalMatchesCount} stays
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
