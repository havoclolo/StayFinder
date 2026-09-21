import React, { useState } from 'react';
import { formatPrice } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';

/**
 * PropertyCard Component (Real Estate Edition)
 * Aligned with StayFinder PRD:
 * - Rent vs Buy pricing & tenure indicators
 * - Verification Trust Badges (Physical Inspection / Title Verified)
 * - Area in SqM, Bedrooms & Bathrooms
 * - Book Viewing trigger & Wishlist toggle
 */
export default function PropertyCard({
  property,
  onSelect = () => {},
  onQuickView = () => {},
  onBookViewing = () => {},
  onToggleFavorite = () => {},
  isFavorite = false,
  isAuthenticated = false,
}) {
  const { currency } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(isFavorite);
  const [isAnimatingHeart, setIsAnimatingHeart] = useState(false);

  if (!property) return null;

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setIsAnimatingHeart(true);
    setTimeout(() => setIsAnimatingHeart(false), 300);
    if (onToggleFavorite) {
      onToggleFavorite(property.id, newStatus);
    }
  };

  const isRent = property.listingType === 'rent';

  return (
    <div
      onClick={() => onSelect(property.id, property)}
      className="group flex flex-col cursor-pointer transition duration-300 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-3xl p-1 bg-white border border-transparent hover:border-gray-200"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(property.id, property);
        }
      }}
    >
      {/* Property Photo & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xs group-hover:shadow-md transition-all duration-300">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none z-10" />

        <img
          src={images[currentImageIndex]}
          alt={property.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges: Listing Type & Verification */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md ${
            isRent ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
          }`}>
            {isRent ? 'For Rent' : 'For Sale'}
          </span>

          {property.isVerified && (
            <div className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-emerald-200">
              <svg className="w-3 h-3 text-emerald-600 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-bold text-gray-900">
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isLiked ? 'Remove from saved' : 'Save property'}
          title={isAuthenticated ? (isLiked ? 'Remove from saved' : 'Save property') : 'Sign in to save property'}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full hover:scale-110 active:scale-95 transition-all text-white hover:bg-black/10 focus:outline-none ${
            isAnimatingHeart ? 'animate-heart-pop' : ''
          }`}
        >
          <svg
            className={`w-6 h-6 transition-colors duration-200 ${
              isLiked
                ? 'fill-rose-500 stroke-rose-500 drop-shadow-md'
                : 'fill-black/30 stroke-white stroke-[2.2]'
            }`}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Quick Action Overlay (Book Viewing) */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookViewing(property);
              }}
              className="pointer-events-auto px-3.5 py-1.5 bg-gray-900/90 hover:bg-black text-white text-[11px] font-bold rounded-full shadow-lg backdrop-blur-sm transition active:scale-95"
            >
              📅 Schedule Viewing
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(property);
              }}
              className="pointer-events-auto px-3 py-1.5 bg-white/95 hover:bg-white text-gray-900 text-[11px] font-bold rounded-full shadow-lg backdrop-blur-sm transition"
            >
              Quick View
            </button>
        </div>

        {/* Left & Right Slider Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:scale-105 z-20"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:scale-105 z-20"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Property Details */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-black text-gray-900">
            {formatPrice(property.price, property.listingType, property.tenure, currency)}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            Free Viewing
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-emerald-700 transition-colors">
          {property.title}
        </h3>

        <p className="text-xs text-gray-500 truncate">
          {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.location}
        </p>

        {/* Specs: Beds, Baths, Area */}
        <div className="flex items-center gap-3 text-xs text-gray-600 font-medium pt-1">
          <span>{property.bedrooms} Beds</span>
          <span>·</span>
          <span>{property.bathrooms} Baths</span>
          {property.areaSqM && (
            <>
              <span>·</span>
              <span>{property.areaSqM} m²</span>
            </>
          )}
        </div>

        {/* Lister Summary */}
        {property.lister && (
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100 mt-1 text-[11px] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="truncate font-semibold text-gray-700">{property.lister.name}</span>
            <span className="text-gray-400">({property.lister.type})</span>
          </div>
        )}
      </div>
    </div>
  );
}
