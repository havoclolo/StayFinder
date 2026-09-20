import React, { useState } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';
import { PROPERTY_TYPES } from '../utils/constants';

export default function CreateListingPage({ onNavigate = () => {} }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    listingType: 'rent', // 'rent' | 'buy'
    propertyType: 'apartment',
    price: '',
    tenure: 'year',
    cautionDeposit: '',
    serviceCharge: '',
    city: 'Lagos',
    neighborhood: 'Lekki Phase 1',
    approximateLocation: 'Near Admiralty Way, Lekki Phase 1',
    exactAddress: '', // Locked until viewing confirmed
    titleStatus: 'Governor’s Consent',
    bedrooms: '3',
    bathrooms: '3',
    areaSqM: '180',
    description: '',
    amenities: ['24/7 Electricity & Serviced Generator', 'Gated Security Estate', 'Treated Water', 'Fitted Kitchen'],
    ownershipDocName: 'Deed_of_Assignment_or_C_of_O.pdf',
    agencyMandateDocName: 'Exclusive_Agency_Mandate_Letter.pdf',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80',
    ],
    videoUrl: '',
    slots: [
      { date: 'Tomorrow', time: '10:00 AM' },
      { date: 'Tomorrow', time: '02:00 PM' },
      { date: 'Saturday', time: '11:00 AM' },
    ],
  });

  const availableAmenities = [
    '24/7 Electricity & Serviced Generator',
    'Gated Security Estate',
    'Treated Water',
    'Swimming Pool',
    'Gym & Fitness Center',
    'Fitted Kitchen',
    'Balcony / Terrace',
    'Ample Parking (2+ cars)',
    'Boys Quarters (BQ)',
    'CCTV & Access Control',
  ];

  const toggleAmenity = (item) => {
    if (formData.amenities.includes(item)) {
      setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== item) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, item] });
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const created = marketplaceStore.createListing({
      ...formData,
      price: Number(formData.price),
      cautionDeposit: Number(formData.cautionDeposit || 0),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      areaSqM: Number(formData.areaSqM),
      location: `${formData.neighborhood}, ${formData.city}`,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
            ✓
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Admin Verification Queue Gate Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Listing Submitted for Trust Review</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            In compliance with StayFinder anti-fraud policy, listings cannot go live until proof of ownership / agency mandate is verified by Ops (turnaround under 6 hours).
          </p>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-left text-xs space-y-1 max-w-md mx-auto">
            <p><strong>Property:</strong> {formData.title}</p>
            <p><strong>Type:</strong> {formData.listingType === 'rent' ? 'For Rent' : 'For Sale'} · ${Number(formData.price).toLocaleString()}</p>
            <p><strong>Title Status:</strong> {formData.titleStatus}</p>
            <p><strong>Status:</strong> <span className="text-amber-600 font-bold">Pending Ops Verification</span></p>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="rounded-xl bg-gray-900 px-5 py-3 text-xs font-black text-white hover:bg-black transition"
            >
              Open Admin Queue to Verify Now →
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard', { tab: 'listings' })}
              className="rounded-xl border border-gray-300 px-5 py-3 text-xs font-black text-gray-700 hover:bg-gray-50"
            >
              Go to Lister Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Lister Portal · PRD Module 5.3</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-gray-900">List a Verified Property</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Reach qualified, identity-verified seekers with zero scam tolerance.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 underline"
          >
            Cancel
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold">
          <span className={step >= 1 ? 'text-emerald-700' : 'text-gray-400'}>1. Details</span>
          <span className="text-gray-300">›</span>
          <span className={step >= 2 ? 'text-emerald-700' : 'text-gray-400'}>2. Location & Privacy</span>
          <span className="text-gray-300">›</span>
          <span className={step >= 3 ? 'text-emerald-700' : 'text-gray-400'}>3. Pricing & Title</span>
          <span className="text-gray-300">›</span>
          <span className={step >= 4 ? 'text-emerald-700' : 'text-gray-400'}>4. Amenities</span>
          <span className="text-gray-300">›</span>
          <span className={step >= 5 ? 'text-emerald-700' : 'text-gray-400'}>5. Verification Docs</span>
        </div>

        <div className="mt-6 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
          {/* STEP 1: BASIC DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-gray-900">Step 1: Property Overview</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Listing Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['rent', 'buy'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, listingType: type })}
                        className={`py-2.5 rounded-xl text-xs font-black uppercase transition border ${
                          formData.listingType === type
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {type === 'rent' ? 'For Rent' : 'For Sale'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Property Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Ultra-Modern 4-Bedroom Semi-Detached Duplex with Swimming Pool"
                    className="w-full text-xs sm:text-sm rounded-xl border border-gray-300 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Property Category</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5"
                  >
                    {PROPERTY_TYPES.filter((t) => t.id !== 'all').map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Living Area (m²)</label>
                  <input
                    type="number"
                    required
                    value={formData.areaSqM}
                    onChange={(e) => setFormData({ ...formData, areaSqM: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Highlight neighborhood advantages, finishing materials, move-in readiness, and security..."
                    className="w-full text-xs rounded-xl border border-gray-300 p-3"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.title.trim()) alert('Please enter a property title.');
                    else setStep(2);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                >
                  Continue to Location & Privacy →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & PRIVACY GATE */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-gray-900">Step 2: Location & Address Privacy Gate</h2>
              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                🔒 <strong>Anti-Poaching Privacy Policy:</strong> Your exact street unit number remains hidden on the public map. It is unlocked automatically only to identity-verified seekers after you confirm their viewing appointment.
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City / State</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Neighborhood / Area</label>
                  <input
                    type="text"
                    required
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Public Approximate Location (Shown on Map)</label>
                  <input
                    type="text"
                    required
                    value={formData.approximateLocation}
                    onChange={(e) => setFormData({ ...formData, approximateLocation: e.target.value })}
                    placeholder="e.g. Admiralty Way Waterfront, Lekki Phase 1"
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Exact Unit Address (Locked until viewing confirmed)</label>
                  <input
                    type="text"
                    required
                    value={formData.exactAddress}
                    onChange={(e) => setFormData({ ...formData, exactAddress: e.target.value })}
                    placeholder="e.g. Flat 3B, Plot 14 Admiralty Way, Lekki Phase 1"
                    className="w-full text-xs rounded-xl border border-emerald-300 bg-emerald-50/30 px-3 py-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                >
                  Continue to Pricing & Title →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FINANCIALS & LEGAL TITLE */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-gray-900">Step 3: Pricing Transparency & Legal Title</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {formData.listingType === 'rent' ? 'Rent Amount ($ USD / Mo equivalent)' : 'Asking Price ($ USD)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 3500"
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5 font-bold"
                  />
                </div>

                {formData.listingType === 'rent' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Caution Deposit ($)</label>
                    <input
                      type="number"
                      value={formData.cautionDeposit}
                      onChange={(e) => setFormData({ ...formData, cautionDeposit: e.target.value })}
                      placeholder="e.g. 500"
                      className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title Status / Document Type</label>
                    <select
                      value={formData.titleStatus}
                      onChange={(e) => setFormData({ ...formData, titleStatus: e.target.value })}
                      className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5"
                    >
                      <option value="Certificate of Occupancy (C of O)">Certificate of Occupancy (C of O)</option>
                      <option value="Governor’s Consent">Governor’s Consent</option>
                      <option value="Lagos State Gazette">Lagos State Gazette / Excision</option>
                      <option value="Registered Deed of Assignment">Registered Deed of Assignment</option>
                      <option value="Federal C of O">Federal C of O (Ikoyi / VI)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bedrooms</label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5"
                  >
                    {[1, 2, 3, 4, 5, 6].map((b) => (
                      <option key={b} value={b}>{b} Bedrooms</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bathrooms</label>
                  <select
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5"
                  >
                    {[1, 2, 3, 4, 5, 6].map((b) => (
                      <option key={b} value={b}>{b} Bathrooms</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.price) alert('Please enter a price.');
                    else setStep(4);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                >
                  Continue to Amenities →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: AMENITIES */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-gray-900">Step 4: Amenities & Features Checklist</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                {availableAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-bold transition ${
                      formData.amenities.includes(amenity)
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded text-emerald-600"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                >
                  Continue to Verification Docs →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: VERIFICATION DOCS & ATOMIC VIEWING SLOTS */}
          {step === 5 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <h2 className="text-base font-black text-gray-900">Step 5: Trust Verification Documents & Scheduling</h2>

              <div className="border border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50/40 space-y-2">
                <p className="text-xs font-bold text-emerald-900">1. Proof of Ownership or Agency Mandate</p>
                <p className="text-[11px] text-gray-500">Attach title deed, C of O, or landlord mandate letter for Admin verification review.</p>
                <div className="flex items-center gap-2 text-xs font-bold bg-white p-2.5 rounded-xl border border-emerald-200 text-emerald-800">
                  <span>📑 {formData.ownershipDocName}</span>
                  <span className="text-[10px] text-gray-400">· Ready for review</span>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50 space-y-2">
                <p className="text-xs font-bold text-gray-800">2. Scheduled Viewing Slots (Atomic Booking)</p>
                <p className="text-[11px] text-gray-500">Pre-set viewing windows to prevent double booking chaos.</p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  {formData.slots.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-gray-700">
                      📅 {s.date} @ {s.time}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-900 text-white rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold">Verification Gate Active:</span>
                  <p className="text-[10px] text-gray-300">Listing goes live immediately upon Admin Ops verification approval.</p>
                </div>
                <span className="text-emerald-400 font-black text-xs">SLA: &lt;6 hrs</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition shadow-md"
                >
                  Submit Listing for Verification Gate →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
