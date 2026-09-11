import React, { useState } from 'react';
import { MOCK_PROPERTIES } from '../utils/constants';
import { INITIAL_VIEWING_REQUESTS, INITIAL_OFFERS_APPLICATIONS } from '../services/viewingService';
import { formatPrice } from '../utils/formatters';

/**
 * DashboardPage Component
 * Dedicated workspace for:
 * - Mrs. Okafor (Landlord) & Agent Dele (Real Estate Agent) to manage listings,
 *   scheduled viewings, and digital tenant/buyer applications.
 * - Amaka & Tunde (Seekers) to track their booked viewings and offers.
 */
export default function DashboardPage({
  user = {
    name: 'Agent Dele Alabi',
    email: 'dele.alabi@lagosproperties.ng',
    role: 'host', // 'host' | 'landlord' | 'guest'
    agencyName: 'Premier Heritage Partners',
    licenseNumber: 'LAG-REA-2024-88',
    verifiedKYC: true,
  },
  initialTab = 'viewings',
  onNavigate = () => {},
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [viewings, setViewings] = useState(INITIAL_VIEWING_REQUESTS);
  const [applications, setApplications] = useState(INITIAL_OFFERS_APPLICATIONS);
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [viewingFilter, setViewingFilter] = useState('all'); // 'all' | 'pending' | 'confirmed'
  const [personaView, setPersonaView] = useState('agent'); // 'agent' | 'seeker'

  // Notification / Alert message state
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3500);
  };

  // Confirm viewing slot action
  const handleConfirmViewing = (viewingId) => {
    setViewings((prev) =>
      prev.map((v) => (v.id === viewingId ? { ...v, status: 'confirmed' } : v))
    );
    showAlert('Viewing appointment confirmed! The seeker has been notified via email & SMS.');
  };

  // Cancel viewing slot
  const handleCancelViewing = (viewingId) => {
    setViewings((prev) =>
      prev.map((v) => (v.id === viewingId ? { ...v, status: 'cancelled' } : v))
    );
    showAlert('Viewing appointment cancelled.');
  };

  // Accept tenant application / buyer offer
  const handleAcceptApplication = (appId) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'accepted' } : a))
    );
    showAlert('Application accepted! Digital Lease Agreement has been dispatched to the tenant.');
  };

  // Filtered viewings
  const filteredViewings = viewings.filter((v) => {
    if (viewingFilter === 'pending') return v.status === 'pending';
    if (viewingFilter === 'confirmed') return v.status === 'confirmed';
    return true;
  });

  const pendingCount = viewings.filter((v) => v.status === 'pending').length;
  const underReviewAppsCount = applications.filter((a) => a.status === 'under_review').length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 pb-16">
      {/* Alert Banner */}
      {alertMessage && (
        <div className="sticky top-20 z-50 bg-emerald-600 text-white px-4 py-3 text-xs font-bold text-center shadow-lg transition-all flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{alertMessage}</span>
        </div>
      )}

      {/* 1. DASHBOARD HEADER & PROFILE OVERVIEW */}
      <header className="bg-white border-b border-gray-200 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-black text-xl flex items-center justify-center shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {user.name}
                </h1>
                {user.verifiedKYC && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <svg className="w-3 h-3 text-emerald-600 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>KYC Verified Lister</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {user.agencyName || 'Independent Property Owner'} · License: <span className="font-mono text-gray-700">{user.licenseNumber || 'VERIFIED-OWNER'}</span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Persona Switcher Toggle (For testing Landlord vs Seeker experience) */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
              <button
                type="button"
                onClick={() => setPersonaView('agent')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  personaView === 'agent' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
                }`}
              >
                Agent / Owner Hub
              </button>
              <button
                type="button"
                onClick={() => setPersonaView('seeker')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  personaView === 'seeker' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
                }`}
              >
                My Seeker Activity
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('create-listing')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-emerald-600/20 flex items-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ List New Property</span>
            </button>
          </div>
        </div>

        {/* 2. TOP KPI SUMMARY STATS (PRD Metrics) */}
        {personaView === 'agent' ? (
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Properties</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{properties.length}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Verified &amp; Listed</p>
            </div>

            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Viewing Requests</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-gray-900">{viewings.length}</span>
                {pendingCount > 0 && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">Zero WhatsApp chaos</p>
            </div>

            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Offers &amp; Applications</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{applications.length}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">2 Ready for Lease</p>
            </div>

            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Viewing-to-Offer Rate</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">25%</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Target: &gt;15% (PRD Metric)</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">My Scheduled Viewings</p>
              <p className="text-2xl font-black text-emerald-900 mt-1">2 Tours</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">1 In-Person · 1 Virtual Tour</p>
            </div>
            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
              <p className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">My Rental Applications</p>
              <p className="text-2xl font-black text-indigo-900 mt-1">1 Application</p>
              <p className="text-[11px] text-indigo-700 mt-0.5">Under Landlord Review</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Zero Fees Policy</p>
              <p className="text-lg font-black text-gray-900 mt-1">$0 Inspection Fees Paid</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Scam-free protected</p>
            </div>
          </div>
        )}

        {/* 3. WORKSPACE TABS */}
        <div className="max-w-7xl mx-auto flex items-center gap-3 mt-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          {personaView === 'agent' ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('viewings')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'viewings'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>Inbound Viewings</span>
                {pendingCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('applications')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'applications'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>Offers &amp; Applications</span>
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-extrabold flex items-center justify-center">
                  {applications.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
                  activeTab === 'listings'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                My Listed Properties ({properties.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('availability')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
                  activeTab === 'availability'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Viewing Schedule Availability
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('my_tours')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                  activeTab === 'my_tours' || activeTab === 'viewings'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500'
                }`}
              >
                My Booked Viewings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('my_offers')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                  activeTab === 'my_offers'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500'
                }`}
              >
                My Submitted Applications
              </button>
            </>
          )}
        </div>
      </header>

      {/* 4. TAB PANELS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {/* TAB: INBOUND VIEWING REQUESTS (Agent Dele & Mrs. Okafor) */}
        {(activeTab === 'viewings' || activeTab === 'my_tours') && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {personaView === 'agent' ? 'Scheduled Viewing Appointments' : 'Your Upcoming Tours'}
                </h2>
                <p className="text-xs text-gray-500">
                  {personaView === 'agent'
                    ? 'Qualified seekers who have selected automated viewing slots on your verified properties.'
                    : 'Arrive at the property on time or join the video call via WhatsApp.'}
                </p>
              </div>

              {personaView === 'agent' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Filter:</span>
                  <div className="flex items-center bg-white border border-gray-300 rounded-xl p-0.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setViewingFilter('all')}
                      className={`px-3 py-1 rounded-lg transition ${
                        viewingFilter === 'all' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All ({viewings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingFilter('pending')}
                      className={`px-3 py-1 rounded-lg transition ${
                        viewingFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Pending ({pendingCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingFilter('confirmed')}
                      className={`px-3 py-1 rounded-lg transition ${
                        viewingFilter === 'confirmed' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Confirmed
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Viewings List */}
            <div className="space-y-4">
              {filteredViewings.map((viewing) => (
                <div
                  key={viewing.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Seeker details & Property snippet */}
                  <div className="flex items-start gap-4">
                    <img
                      src={viewing.propertyImage}
                      alt={viewing.propertyTitle}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-gray-100"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          viewing.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : viewing.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {viewing.status === 'confirmed' ? '✓ Confirmed' : 'Action Required'}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          {viewing.viewingMode === 'in_person' ? '🚶 In-Person Walkthrough' : '📹 Live Video Tour'}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                        {viewing.seekerName}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {viewing.seekerRole} · {viewing.seekerPhone} · {viewing.seekerEmail}
                      </p>
                      <p className="text-xs text-emerald-800 font-bold">
                        Property: {viewing.propertyTitle} ({viewing.propertyPrice})
                      </p>
                      {viewing.notes && (
                        <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 mt-2 max-w-xl italic">
                          "{viewing.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Appointment Time Slot & Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                    <div className="text-left lg:text-right">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Scheduled Slot
                      </span>
                      <p className="text-base font-extrabold text-gray-900">
                        {viewing.date} @ {viewing.time}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Zero Viewing Fee Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {viewing.status === 'pending' && personaView === 'agent' && (
                        <button
                          type="button"
                          onClick={() => handleConfirmViewing(viewing.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          Confirm Slot
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCancelViewing(viewing.id)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                      >
                        Decline / Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: APPLICATIONS & OFFERS (Viewing-to-Close Pipeline >15%) */}
        {(activeTab === 'applications' || activeTab === 'my_offers') && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-black text-gray-900">
                {personaView === 'agent' ? 'Tenant Applications & Purchase Offers' : 'My Active Offers & Applications'}
              </h2>
              <p className="text-xs text-gray-500">
                Structured transaction flow from verified viewing to signed agreement and move-in.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        app.type === 'rent_application' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {app.type === 'rent_application' ? 'Rental Application' : 'Purchase Offer'}
                      </span>
                      <span className="text-xs font-bold text-gray-400">
                        Submitted {app.submittedAt}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">{app.propertyTitle}</h3>
                      <p className="text-xs text-gray-500">{app.propertyLocation}</p>
                    </div>

                    {/* Applicant details */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5 text-xs text-gray-700">
                      <p>
                        <strong className="text-gray-900">Applicant:</strong> {app.applicantName} ({app.applicantPhone})
                      </p>
                      {app.employment && (
                        <p>
                          <strong className="text-gray-900">Employment / Credibility:</strong> {app.employment}
                        </p>
                      )}
                      {app.annualIncome && (
                        <p>
                          <strong className="text-gray-900">Verified Income:</strong> {app.annualIncome}
                        </p>
                      )}
                      {app.proposedMoveIn && (
                        <p>
                          <strong className="text-gray-900">Proposed Move-In Date:</strong> {app.proposedMoveIn} ({app.leaseDuration})
                        </p>
                      )}
                      {app.financingMethod && (
                        <p>
                          <strong className="text-gray-900">Financing Method:</strong> {app.financingMethod}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Financial offer & Decision CTA */}
                  <div className="flex flex-col justify-between items-start md:items-end gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                    <div className="text-left md:text-right">
                      <span className="block text-[11px] font-bold uppercase text-gray-400">Offered Terms</span>
                      <p className="text-2xl font-black text-gray-900 mt-0.5">{app.proposedPrice}</p>
                      {app.askingPrice && (
                        <p className="text-xs text-gray-400 line-through">Asking: {app.askingPrice}</p>
                      )}
                      <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status === 'accepted' ? '✓ Accepted · Drafting Lease' : 'Under Review'}
                      </span>
                    </div>

                    {personaView === 'agent' && app.status !== 'accepted' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAcceptApplication(app.id)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm active:scale-95"
                        >
                          Accept &amp; Send Agreement
                        </button>
                        <button
                          type="button"
                          className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                        >
                          Counter Offer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: MY LISTED PROPERTIES */}
        {activeTab === 'listings' && personaView === 'agent' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900">Your Managed Properties</h2>
                <p className="text-xs text-gray-500">
                  All listings are physically inspected and title-verified before public display.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('create-listing')}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>+ Add Property</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/60 backdrop-blur-md text-white">
                        {prop.listingType === 'rent' ? 'Rent' : 'Sale'}
                      </span>
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">
                        ✓ Verified Active
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm truncate">{prop.title}</h3>
                    <p className="text-xs text-gray-500">{prop.location}</p>
                    <p className="text-base font-black text-gray-900 mt-2">
                      {formatPrice(prop.price, prop.listingType, prop.tenure)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">3 Inbound Requests</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('property-detail', { id: prop.id, property: prop })}
                      className="font-bold text-emerald-600 hover:underline"
                    >
                      View Live Page →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: VIEWING AVAILABILITY CONFIGURATION */}
        {activeTab === 'availability' && personaView === 'agent' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm max-w-2xl">
            <h2 className="text-lg font-black text-gray-900">Manage Default Viewing Slots</h2>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Set the days and time windows when you or your on-site caretaker are available for in-person or live video tours.
            </p>

            <div className="space-y-4">
              {[
                { day: 'Tuesdays & Thursdays', times: '02:00 PM – 05:00 PM', active: true },
                { day: 'Saturdays (Open House Window)', times: '10:00 AM – 04:00 PM', active: true },
                { day: 'Sundays', times: '12:00 PM – 03:00 PM', active: false },
              ].map((slot, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-200">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{slot.day}</p>
                    <p className="text-xs text-gray-500">{slot.times}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    slot.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {slot.active ? 'Active' : 'Paused'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => showAlert('Viewing schedule updated successfully.')}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
              >
                Save Availability
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
