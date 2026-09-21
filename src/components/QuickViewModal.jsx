import React, { useState } from 'react';

/**
 * QuickViewModal Component
 * Provides a fast modal preview for any property without leaving the current view.
 */
export default function QuickViewModal({
  property,
  onClose = () => {},
  onViewDetails = () => {},
  isFavorite = false,
  onToggleFavorite = () => {},
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  const images = property.images || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-md transition"
          aria-label="Close preview"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left: Photos Preview */}
        <div className="w-full md:w-1/2 bg-gray-900 flex flex-col relative">
          <div className="relative aspect-[4/3] md:h-full w-full">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail list if multiple images */}
          {images.length > 1 && (
            <div className="p-3 bg-black/40 backdrop-blur-md flex items-center gap-2 overflow-x-auto no-scrollbar absolute bottom-0 inset-x-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                    activeImageIndex === idx
                      ? 'border-white scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Property Information & Booking Action */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Badges & Location */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                {property.category?.replace('_', ' ')}
              </span>
              <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                <svg className="w-4 h-4 text-rose-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{property.rating}</span>
                <span className="text-gray-400 font-normal">({property.reviewsCount} reviews)</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
              {property.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {property.location}, {property.country}
            </p>

            {/* Room specs */}
            <div className="flex items-center gap-3 text-xs text-gray-600 my-4 py-3 border-y border-gray-100">
              <span>{property.maxGuests} guests</span>
              <span>·</span>
              <span>{property.bedrooms} bedrooms</span>
              <span>·</span>
              <span>{property.beds || property.bedrooms} beds</span>
              <span>·</span>
              <span>{property.bathrooms} baths</span>
            </div>

            {/* Description snippet */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
              {property.description}
            </p>

            {/* Host summary */}
            {property.host && (
              <div className="flex items-center gap-3 mt-5 p-3 rounded-2xl bg-gray-50">
                <img
                  src={property.host.avatar}
                  alt={property.host.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">Hosted by {property.host.name}</p>
                  <p className="text-[11px] text-gray-500">
                    Host since {property.host.joinedYear} · {property.host.responseRate || '100%'} response rate
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pricing & CTA */}
          <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900">${property.pricePerNight}</span>
                <span className="text-xs text-gray-500 font-medium">night</span>
              </div>
              <p className="text-[11px] text-gray-400">Taxes calculated at checkout</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewDetails(property.id, property);
                }}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-500/20 active:scale-95"
              >
                Schedule Viewing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
