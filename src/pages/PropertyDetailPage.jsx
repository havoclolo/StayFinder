import React, { useState } from 'react';
import SlotPicker from '../components/SlotPicker';
import RentalApplicationModal from '../components/RentalApplicationModal';
import PurchaseOfferModal from '../components/PurchaseOfferModal';
import FraudReportModal from '../components/FraudReportModal';
import ReviewModal from '../components/ReviewModal';
import MessagingDrawer from '../components/MessagingDrawer';
import { MOCK_PROPERTIES } from '../utils/constants';
import { formatPrice } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import { marketplaceStore } from '../services/marketplaceStore';

export default function PropertyDetailPage({
  property: suppliedProperty,
  openBooking = false,
  isAuthenticated = false,
  onNavigate = () => {},
}) {
  const { currency } = useCurrency();
  const allListings = marketplaceStore.getListings();
  const property = suppliedProperty || allListings[0];
  const [bookingOpen, setBookingOpen] = useState(openBooking);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [fraudModalOpen, setFraudModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [messagingOpen, setMessagingOpen] = useState(false);

  const [alertNotice, setAlertNotice] = useState('');

  const isRent = property?.listingType === 'rent';
  const comparableProperties = allListings.filter(
    (item) => item.id !== property?.id && item.listingType === property?.listingType
  ).slice(0, 2);

  const showNotice = (msg) => {
    setAlertNotice(msg);
    setTimeout(() => setAlertNotice(''), 4000);
  };

  const requireAccount = (callback) => {
    if (!isAuthenticated) {
      onNavigate('login', {
        mode: 'login',
        returnTo: { page: 'property-detail', data: { property } },
      });
      return;
    }
    callback();
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => requireAccount(() => setFraudModalOpen(true))}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
            >
              <span>🛡️</span> Report Listing / Fraud
            </button>
            <button
              type="button"
              onClick={() => requireAccount(() => setReviewModalOpen(true))}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
            >
              ★ Leave Review
            </button>
          </div>
        </div>

        {alertNotice && (
          <div className="mt-4 p-3.5 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-sm animate-fadeIn">
            {alertNotice}
          </div>
        )}

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Main Details Section */}
          <section>
            {/* Image Gallery */}
            <div className="grid gap-3 sm:grid-cols-2">
              {property.images?.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  className={`h-64 w-full rounded-3xl object-cover shadow-sm ${
                    index === 0 ? 'sm:col-span-2 sm:h-96' : ''
                  }`}
                />
              ))}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {property.verificationBadge || 'Verified Listing & Authenticity Checked'}
                </span>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {formatPrice(0, 'buy', 'month', currency)} Viewing Fee Guarantee
                </span>
              </div>

              <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                {property.title}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {property.neighborhood}, {property.location}
              </p>

              {/* Approximate Location Notice (PRD Section 5.3 & 7) */}
              <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
                <span className="text-base">📍</span>
                <div>
                  <strong className="block text-blue-950 font-bold">Privacy & Security Location Policy:</strong>
                  <span>
                    To protect landlords and prevent address-scraping scams, this public pin is approximate ({property.neighborhood}). The exact private unit address and access instructions are automatically unlocked in your dashboard upon viewing confirmation.
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-gray-700 border-y border-gray-200 py-3">
                <span>🛏️ {property.bedrooms} Bedrooms</span>
                <span>·</span>
                <span>🚿 {property.bathrooms} Bathrooms</span>
                <span>·</span>
                <span>📐 {property.areaSqM} m²</span>
                <span>·</span>
                <span>🏷️ {isRent ? 'Residential Lease' : 'Freehold Sale'}</span>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-600">
                {property.description}
              </p>

              {/* Title & Trust Verification Grid */}
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
                  <p className="text-[10px] font-black uppercase text-gray-400">Legal Title Status</p>
                  <p className="mt-1 text-xs font-black text-gray-900">
                    {property.titleStatus || 'Governor’s Consent / Registered Deed'}
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Verified by Ops</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
                  <p className="text-[10px] font-black uppercase text-gray-400">Viewing Fee Policy</p>
                  <p className="mt-1 text-xs font-black text-emerald-700">100% Free ({formatPrice(0, 'buy', 'month', currency)} Fee)</p>
                  <p className="mt-1 text-[11px] text-gray-500">Atomic slot booking</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
                  <p className="text-[10px] font-black uppercase text-gray-400">Authorized Lister</p>
                  <p className="mt-1 text-xs font-black text-gray-900">{property.lister?.name || 'Verified Agent'}</p>
                  <p className="mt-1 text-[11px] text-gray-500">{property.lister?.type || 'Licensed Broker'}</p>
                </div>
              </div>

              {/* Amenities List */}
              <div className="mt-8">
                <h2 className="text-base font-black text-gray-900 mb-3">Amenities & Security Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-gray-700">
                  {(property.amenities || [
                    '24/7 Serviced Power',
                    'Gated Estate Security',
                    'Treated Water Plant',
                    'Fitted Kitchen',
                    'Ample Dedicated Parking',
                    'Swimming Pool',
                  ]).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-gray-200">
                      <span className="text-emerald-600 font-black">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparable Properties */}
              <div className="mt-8">
                <h2 className="text-base font-black text-gray-900 mb-3">Comparable Homes in Area</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {comparableProperties.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => onNavigate('property-detail', { property: item })}
                      className="rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-emerald-400 transition"
                    >
                      <p className="text-sm font-bold text-gray-900">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-500">{item.location} · {item.areaSqM} m²</p>
                      <p className="mt-2 text-sm font-black text-emerald-700">
                        {formatPrice(item.price, item.listingType, item.tenure, currency)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sticky Transaction Action Sidebar */}
          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-28 space-y-4">
            <div>
              <p className="text-3xl font-black text-gray-900">
                {formatPrice(property.price, property.listingType, property.tenure, currency)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Transparent pricing & zero viewing fees</p>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-2 border-y border-gray-100 py-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{isRent ? 'Base Monthly Rent' : 'Asking Price'}</span>
                <span className="font-bold text-gray-900">{formatPrice(property.price, property.listingType, property.tenure, currency)}</span>
              </div>
              {isRent && (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>Caution Deposit (Refundable)</span>
                    <span className="font-bold text-gray-900">{formatPrice(property.cautionDeposit || Math.round(property.price * 0.15), 'rent', property.tenure, currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service Charge</span>
                    <span className="font-bold text-gray-900">{formatPrice(350000, 'rent', 'month', currency)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-emerald-700 font-black">
                <span>Viewing / Inspection Fee</span>
                <span>{formatPrice(0, 'buy', 'month', currency)} (Free)</span>
              </div>
            </div>

            {/* Action 1: Schedule Free Viewing */}
            <button
              type="button"
              onClick={() => requireAccount(() => setBookingOpen(true))}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-xs font-black text-white hover:bg-emerald-700 transition shadow-sm"
            >
              📅 Schedule Free Viewing (Pick Slot)
            </button>

            {/* Action 2: Transaction Flow (Apply for Rent OR Submit Buy Offer) */}
            {isRent ? (
              <button
                type="button"
                onClick={() => requireAccount(() => setApplicationModalOpen(true))}
                className="w-full rounded-xl bg-gray-900 px-4 py-3 text-xs font-black text-white hover:bg-black transition"
              >
                📝 Start Rental Application (Amaka Flow)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => requireAccount(() => setOfferModalOpen(true))}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-xs font-black text-white hover:bg-blue-700 transition"
              >
                💼 Submit Formal Purchase Offer (Tunde Flow)
              </button>
            )}

            {/* Action 3: Message Lister Drawer */}
            <button
              type="button"
              onClick={() => requireAccount(() => setMessagingOpen(true))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              💬 Inquire / Message Lister
            </button>

            <div className="rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-900 space-y-1">
              <strong className="block">Verified Transaction Guarantee:</strong>
              <p className="text-[11px] text-emerald-800">
                Digital agreements, payments, and document sharing are monitored under StayFinder anti-fraud escrow rules.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Viewing Slot Picker Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <SlotPicker
            property={property}
            onCancel={() => setBookingOpen(false)}
            onBookingConfirmed={() => {
              setBookingOpen(false);
              showNotice('Viewing booked successfully! Check your dashboard for confirmation and exact directions.');
              onNavigate('dashboard', { tab: 'viewings' });
            }}
          />
        </div>
      )}

      {/* Rental Application Modal */}
      {applicationModalOpen && (
        <RentalApplicationModal
          property={property}
          onClose={() => setApplicationModalOpen(false)}
          onSuccess={() => {
            setApplicationModalOpen(false);
            showNotice('Rental application submitted! Lister has been notified.');
            onNavigate('dashboard', { tab: 'applications' });
          }}
        />
      )}

      {/* Purchase Offer Modal */}
      {offerModalOpen && (
        <PurchaseOfferModal
          property={property}
          onClose={() => setOfferModalOpen(false)}
          onSuccess={() => {
            setOfferModalOpen(false);
            showNotice('Purchase offer submitted! Seller notified to counter or accept.');
            onNavigate('dashboard', { tab: 'offers' });
          }}
        />
      )}

      {/* Fraud Report Modal */}
      {fraudModalOpen && (
        <FraudReportModal
          listing={property}
          onClose={() => setFraudModalOpen(false)}
          onSuccess={() => {
            setFraudModalOpen(false);
            showNotice('Report escalated to Ops Trust & Safety queue.');
          }}
        />
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <ReviewModal
          targetLister={property.lister}
          listingTitle={property.title}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => {
            setReviewModalOpen(false);
            showNotice('Review published! Thank you for strengthening marketplace trust.');
          }}
        />
      )}

      {/* Messaging Drawer */}
      <MessagingDrawer
        isOpen={messagingOpen}
        onClose={() => setMessagingOpen(false)}
        defaultListingId={property.id}
      />
    </main>
  );
}
