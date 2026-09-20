import React, { useState, useEffect } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';
import { formatPrice } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import DigitalLeaseModal from '../components/DigitalLeaseModal';
import DueDiligenceModal from '../components/DueDiligenceModal';
import MessagingDrawer from '../components/MessagingDrawer';

export default function DashboardPage({
  user: propUser,
  initialTab = 'viewings',
  onNavigate = () => {},
}) {
  const { currency } = useCurrency();
  const [currentUser, setCurrentUser] = useState(() => propUser || marketplaceStore.getCurrentUser());
  const [activeTab, setActiveTab] = useState(initialTab);
  const [viewings, setViewings] = useState(marketplaceStore.getViewings());
  const [applications, setApplications] = useState(marketplaceStore.getApplications());
  const [leases, setLeases] = useState(marketplaceStore.getLeases());
  const [offers, setOffers] = useState(marketplaceStore.getOffers());
  const [listings, setListings] = useState(marketplaceStore.getListings());
  const [dueDiligenceRooms, setDueDiligenceRooms] = useState(marketplaceStore.getDueDiligenceRooms());

  // Active Modals
  const [activeLeaseModal, setActiveLeaseModal] = useState(null);
  const [activeDueDiligenceModal, setActiveDueDiligenceModal] = useState(null);
  const [activeMessagingListingId, setActiveMessagingListingId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const unsub = marketplaceStore.subscribe(() => {
      setCurrentUser(marketplaceStore.getCurrentUser() || propUser);
      setViewings(marketplaceStore.getViewings());
      setApplications(marketplaceStore.getApplications());
      setLeases(marketplaceStore.getLeases());
      setOffers(marketplaceStore.getOffers());
      setListings(marketplaceStore.getListings());
      setDueDiligenceRooms(marketplaceStore.getDueDiligenceRooms());
    });
    return unsub;
  }, [propUser]);

  const isSeeker = currentUser?.role === 'seeker';
  const isLister = ['lister', 'landlord', 'agent', 'host'].includes(currentUser?.role);

  const showAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(''), 4000);
  };

  // Lister Actions
  const handleConfirmViewing = (viewingId) => {
    marketplaceStore.updateViewingStatus(viewingId, 'confirmed');
    showAlert('Viewing appointment confirmed! The exact unit address is now unlocked for the seeker.');
  };

  const handleDeclineViewing = (viewingId) => {
    marketplaceStore.updateViewingStatus(viewingId, 'cancelled');
    showAlert('Viewing appointment cancelled.');
  };

  const handleApproveApplication = (appId) => {
    marketplaceStore.updateApplicationStatus(appId, 'approved');
    showAlert('Application approved! Digital lease agreement generated for tenant e-signature.');
  };

  const handleAcceptOffer = (offerId) => {
    marketplaceStore.counterOrAcceptOffer(offerId, 'accept', null, 'Seller accepted purchase offer.');
    showAlert('Purchase offer accepted! 5-Stage Due Diligence Deal Room is now active.');
  };

  const handleCounterOffer = (offerId) => {
    const counterAmt = prompt('Enter counter-offer amount ($ USD):', '835000');
    if (counterAmt && !isNaN(Number(counterAmt))) {
      marketplaceStore.counterOrAcceptOffer(offerId, 'counter', Number(counterAmt), `Counter offer of $${Number(counterAmt).toLocaleString()}`);
      showAlert(`Counter-offer of $${Number(counterAmt).toLocaleString()} sent to buyer.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 pb-16">
      {/* Alert Banner */}
      {alertMessage && (
        <div className="sticky top-24 z-40 bg-emerald-600 text-white px-4 py-3 text-xs font-bold text-center shadow-lg flex items-center justify-center gap-2 animate-fadeIn">
          <span>✓</span>
          <span>{alertMessage}</span>
        </div>
      )}

      {/* DASHBOARD HEADER */}
      <header className="bg-white border-b border-gray-200 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-gray-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {currentUser.personaType ? `${currentUser.personaType.toUpperCase()}` : currentUser.role.toUpperCase()}
                </span>
                {currentUser.verifiedKYC && (
                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-0.5">
                    ✓ Verified KYC
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {currentUser.headline || currentUser.email} · {currentUser.agencyName || 'StayFinder Verified Member'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMessagingListingId('sf-201')}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs"
            >
              <span>💬</span> Messages
            </button>
            {isLister && (
              <button
                type="button"
                onClick={() => onNavigate('create-listing')}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700 shadow-sm transition"
              >
                + Create New Listing
              </button>
            )}
            {currentUser.role === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white hover:bg-rose-700 shadow-sm"
              >
                Trust & Ops Center
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          {isSeeker ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('viewings')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeTab === 'viewings' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                My Booked Viewings ({viewings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeTab === 'applications' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Rental Applications & Leases ({applications.length + leases.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('offers')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeTab === 'offers' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Purchase Offers & Deal Rooms ({offers.length})
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('viewings')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeTab === 'viewings' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Inbound Viewing Requests ({viewings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeTab === 'applications' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Applications & Offers Queue ({applications.length + offers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                  activeTab === 'listings' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                My Listings Portfolio ({listings.length})
              </button>
            </>
          )}
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex-1">
        {/* TAB 1: VIEWINGS */}
        {activeTab === 'viewings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {isSeeker ? 'My Scheduled Viewings' : 'Inbound Viewing Requests (Atomic Slots)'}
                </h2>
                <p className="text-xs text-gray-500">
                  {isSeeker
                    ? 'Exact property unit addresses unlock automatically once confirmed by the lister.'
                    : 'Approve or reschedule viewing appointments to unlock exact directions for verified seekers.'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {viewings.map((v) => {
                const isConfirmed = v.status === 'confirmed';

                return (
                  <div key={v.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <img
                          src={v.image}
                          alt={v.listingTitle}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                isConfirmed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : v.status === 'cancelled'
                                  ? 'bg-gray-100 text-gray-600'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {v.status}
                            </span>
                            <span className="text-xs font-bold text-gray-700">
                              {v.viewingMode === 'virtual_video' ? '📹 Virtual Video' : '📍 In-Person'}
                            </span>
                          </div>
                          <h3 className="text-sm font-black text-gray-900 mt-1 line-clamp-1">{v.listingTitle}</h3>
                          <p className="text-xs font-bold text-emerald-700">{v.price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1">
                      <p>
                        <strong>Appointment:</strong> 📅 {v.date} @ {v.time}
                      </p>
                      <p>
                        <strong>{isSeeker ? 'Lister' : 'Seeker'}:</strong>{' '}
                        {isSeeker ? v.listerName : `${v.seekerName} (${v.seekerPhone})`}
                      </p>
                      {v.notes && <p className="text-gray-500 italic">"{v.notes}"</p>}
                    </div>

                    {/* Exact Address Privacy Section (PRD Section 5.3 & 7) */}
                    <div
                      className={`p-3 rounded-2xl border text-xs ${
                        isConfirmed
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[11px] uppercase tracking-wider">
                          {isConfirmed ? '🔓 Exact Unit Address (Unlocked)' : '🔒 Exact Unit Address (Locked)'}
                        </span>
                        {isConfirmed && <span className="text-[10px] font-bold text-emerald-700">Directions Sent</span>}
                      </div>
                      <p className="mt-1 font-mono text-xs">
                        {isConfirmed
                          ? v.exactAddress
                          : `${v.listingLocation} (Full street & unit revealed upon confirmation)`}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setActiveMessagingListingId(v.listingId)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                      >
                        💬 Open Chat
                      </button>

                      {isLister && v.status === 'requested' && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmViewing(v.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                          >
                            Confirm & Release Address
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeclineViewing(v.id)}
                            className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATIONS & DIGITAL LEASES (RENT PATH) */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                {isSeeker ? 'My Rental Applications & Digital Leases' : 'Tenant Applications & Lease Workflow'}
              </h2>
              <p className="text-xs text-gray-500">
                End-to-end rental execution: application review → digital lease agreement → Paystack / off-platform deposit payment.
              </p>
            </div>

            {/* Applications Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
                Submitted Applications ({applications.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800">
                          {app.status}
                        </span>
                        <h4 className="text-sm font-black text-gray-900 mt-1">{app.listingTitle}</h4>
                        <p className="text-xs text-gray-500">{app.listingLocation}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{app.submittedAt}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1 text-gray-700">
                      <p><strong>Applicant:</strong> {app.applicantName} ({app.applicantPhone})</p>
                      <p><strong>Employment:</strong> {app.employer} · {app.jobTitle}</p>
                      <p><strong>Annual Income:</strong> {app.annualIncome}</p>
                      <p><strong>Move-in Target:</strong> {app.moveInDate}</p>
                      <p><strong>Guarantor:</strong> {app.guarantorName} ({app.guarantorPhone})</p>
                    </div>

                    {/* Lister Action: Approve Application */}
                    {isLister && app.status === 'under_review' && (
                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleApproveApplication(app.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                        >
                          Approve & Generate Digital Lease
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Leases Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-black text-emerald-800 uppercase tracking-wider">
                Digital Leases & Signatures ({leases.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {leases.map((lease) => {
                  const isActive = lease.status === 'active';

                  return (
                    <div
                      key={lease.id}
                      className={`bg-white rounded-3xl border p-5 shadow-2xs space-y-3 ${
                        isActive ? 'border-emerald-300 bg-emerald-50/20' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isActive ? 'Lease Active ✓' : 'Awaiting Tenant E-Signature'}
                          </span>
                          <h4 className="text-sm font-black text-gray-900 mt-1">{lease.listingTitle}</h4>
                          <p className="text-xs text-gray-500">Term: {lease.leaseTerm}</p>
                        </div>
                        <span className="text-xs font-black text-gray-900">${lease.rentAmount}/mo</span>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1">
                        <p><strong>Tenant:</strong> {lease.tenantName}</p>
                        <p><strong>Total Due at Signing:</strong> ${lease.totalDueAtSigning?.toLocaleString()}</p>
                        <p>
                          <strong>Landlord Signature:</strong>{' '}
                          <span className="text-emerald-700 font-bold">Executed by {lease.landlordName}</span>
                        </p>
                        <p>
                          <strong>Tenant Signature:</strong>{' '}
                          {lease.tenantSigned ? (
                            <span className="text-emerald-700 font-bold">Signed ({lease.tenantSignatureText})</span>
                          ) : (
                            <span className="text-amber-700 font-bold">Pending E-Signature</span>
                          )}
                        </p>
                        {isActive && (
                          <p className="text-emerald-800 font-bold">
                            Payment: {lease.paymentMethod === 'off_platform' ? 'Marked Paid Off-Platform' : 'Paid via Paystack'} ({lease.paymentReference})
                          </p>
                        )}
                      </div>

                      {/* Seeker Action: Sign & Pay */}
                      {isSeeker && !lease.tenantSigned && (
                        <div className="flex justify-end pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => setActiveLeaseModal(lease)}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition shadow-sm"
                          >
                            ✍️ Review & E-Sign Lease (Paystack / Off-Platform)
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PURCHASE OFFERS & DUE DILIGENCE (BUY PATH FOR TUNDE) */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">Purchase Offers & Acquisition Deal Rooms</h2>
              <p className="text-xs text-gray-500">
                PRD Buy Flow 5.6: Formal offer submission → counter negotiation → 5-stage due diligence deal room & document vault.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {offers.map((offer) => {
                const isAccepted = offer.status === 'accepted';
                const ddRoom = dueDiligenceRooms.find((r) => r.offerId === offer.id);

                return (
                  <div key={offer.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800'
                              : offer.status === 'countered'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {offer.status}
                        </span>
                        <h4 className="text-sm font-black text-gray-900 mt-1">{offer.listingTitle}</h4>
                        <p className="text-xs text-gray-500">{offer.listingLocation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Asking: ${offer.askingPrice?.toLocaleString()}</p>
                        <p className="text-sm font-black text-blue-700">Offer: ${offer.offerAmount?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1">
                      <p><strong>Buyer:</strong> {offer.buyerName} ({offer.buyerPhone})</p>
                      <p><strong>Earnest Escrow:</strong> {offer.earnestDepositPercent}% (${offer.earnestDepositAmount?.toLocaleString()})</p>
                      <p><strong>Financing:</strong> {offer.financingType}</p>
                      <p><strong>Closing Window:</strong> {offer.closingTimelineDays} Days</p>
                    </div>

                    {/* Counter Offer History */}
                    {offer.counterHistory?.length > 0 && (
                      <div className="p-2.5 bg-gray-100 rounded-xl text-[11px] space-y-1 font-mono text-gray-700 max-h-24 overflow-y-auto">
                        <p className="font-bold text-gray-900">Negotiation Trail:</p>
                        {offer.counterHistory.map((h, i) => (
                          <p key={i}>
                            • [{h.sender.toUpperCase()}]: ${h.amount?.toLocaleString()} — {h.note}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setActiveMessagingListingId(offer.listingId)}
                        className="text-xs font-bold text-blue-700 underline"
                      >
                        💬 Message Counterparty
                      </button>

                      {isAccepted && ddRoom && (
                        <button
                          type="button"
                          onClick={() => setActiveDueDiligenceModal(ddRoom)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition shadow-sm"
                        >
                          🏛️ Enter 5-Stage Deal Room
                        </button>
                      )}

                      {isLister && offer.status !== 'accepted' && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleAcceptOffer(offer.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                          >
                            Accept Offer
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCounterOffer(offer.id)}
                            className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                          >
                            Counter
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: LISTER PORTFOLIO */}
        {activeTab === 'listings' && isLister && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-gray-900">My Listings Portfolio</h2>
                <p className="text-xs text-gray-500">
                  Track verification status, public visibility, and inbound inquiries across your properties.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('create-listing')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
              >
                + Add Listing
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {listings.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-2xs space-y-3">
                  <div className="flex gap-3">
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            p.status === 'live'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          {p.listingType === 'rent' ? 'Rental' : 'Sale'}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-gray-900 mt-1 line-clamp-1">{p.title}</h4>
                      <p className="text-xs font-black text-emerald-700">
                        {formatPrice(p.price, p.listingType, p.tenure, currency)}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">{p.location}</p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-gray-50 rounded-xl text-xs flex justify-between font-semibold text-gray-600">
                    <span>Title: <strong>{p.titleStatus || 'Deed Registered'}</strong></span>
                    <span>Views: <strong>{p.viewsCount || 142}</strong></span>
                    <span>Inquiries: <strong>{p.inquiriesCount || 12}</strong></span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => onNavigate('property-detail', { property: p })}
                      className="text-xs font-bold text-gray-700 hover:text-gray-900 underline"
                    >
                      View Marketplace Page →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Digital Lease Modal */}
      {activeLeaseModal && (
        <DigitalLeaseModal
          lease={activeLeaseModal}
          onClose={() => setActiveLeaseModal(null)}
          onSuccess={() => {
            setActiveLeaseModal(null);
            showAlert('Lease signed and payment processed successfully!');
          }}
        />
      )}

      {/* Due Diligence Modal */}
      {activeDueDiligenceModal && (
        <DueDiligenceModal
          room={activeDueDiligenceModal}
          onClose={() => setActiveDueDiligenceModal(null)}
        />
      )}

      {/* In-App Messaging Drawer */}
      <MessagingDrawer
        isOpen={Boolean(activeMessagingListingId)}
        onClose={() => setActiveMessagingListingId(null)}
        defaultListingId={activeMessagingListingId}
      />
    </div>
  );
}
