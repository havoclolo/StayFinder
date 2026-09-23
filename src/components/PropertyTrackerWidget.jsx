import React, { useState, useMemo } from 'react';

/**
 * PropertyTrackerWidget
 * Only rendered for authenticated seekers who have active applications, offers, or viewings.
 * Completely empty/hidden for unauthenticated users and seekers who have not yet started a rent or buy action.
 */
export default function PropertyTrackerWidget({
  currentUser,
  viewings = [],
  applications = [],
  offers = [],
  leases = [],
  onNavigate = () => {},
  onSelectProperty = () => {},
}) {
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'rent' | 'buy' | 'viewings'

  const isSeeker = currentUser?.role === 'seeker';
  const userEmail = (currentUser?.email || '').toLowerCase().trim();
  const userId = currentUser?.id;
  const userName = (currentUser?.name || '').toLowerCase().trim();

  // Helper to determine if a record belongs to this seeker
  const isUserMatch = (recordEmail, recordUserId, recordName) => {
    const e = (recordEmail || '').toLowerCase().trim();
    if (userEmail && e && userEmail === e) return true;
    if (userId && recordUserId && userId === recordUserId) return true;

    // Handle preset account mappings (Amaka / Tunde)
    if (userEmail === 'amaka.nwosu@stayfinder.ng' || userId === 'user-seeker' || userId === 'user-amaka') {
      if (e === 'amaka.nwosu@stayfinder.ng' || recordUserId === 'user-amaka' || recordUserId === 'user-seeker') {
        return true;
      }
    }
    if (userEmail === 'tunde.b@stayfinder.ng' || userId === 'user-tunde') {
      if (e === 'tunde.b@stayfinder.ng' || recordUserId === 'user-tunde') {
        return true;
      }
    }

    const n = (recordName || '').toLowerCase().trim();
    if (userName && n && userName === n) return true;

    return false;
  };

  // Compile ONLY the items that belong to this active seeker
  const userRelevantItems = useMemo(() => {
    if (!currentUser || !isSeeker) return [];

    const list = [];

    // 1. Applications & Digital Leases (Rent Journey)
    applications.forEach((app) => {
      if (!isUserMatch(app.applicantEmail, app.seekerId, app.applicantName)) return;

      const associatedLease = leases.find(
        (l) => (l.applicationId === app.id || l.listingId === app.listingId) &&
               isUserMatch(l.tenantEmail, null, l.tenantName)
      );

      let progressStage = 2; // 1: Submitted, 2: Review, 3: Lease Ready, 4: Active/Moved In
      let statusLabel = 'Application Under Review';
      let statusType = 'amber';

      if (associatedLease?.status === 'active' || associatedLease?.tenantSigned) {
        progressStage = 4;
        statusLabel = 'Lease Executed & Active';
        statusType = 'emerald';
      } else if (associatedLease && !associatedLease.tenantSigned) {
        progressStage = 3;
        statusLabel = 'Digital Lease Ready to Sign';
        statusType = 'emerald';
      } else if (app.status === 'approved') {
        progressStage = 3;
        statusLabel = 'Application Approved';
        statusType = 'emerald';
      } else if (app.status === 'rejected') {
        progressStage = 2;
        statusLabel = 'Application Declined';
        statusType = 'rose';
      }

      list.push({
        id: app.id,
        category: 'rent',
        type: 'Rental Application',
        title: app.listingTitle,
        location: app.listingLocation,
        listingId: app.listingId,
        date: app.submittedAt || 'Recent',
        status: statusLabel,
        statusType,
        progressStage,
        totalStages: 4,
        stages: ['Submitted', 'Lister Review', 'Digital Lease', 'Move-in'],
        details: {
          monthlyRent: app.monthlyRent ? `$${app.monthlyRent.toLocaleString()}/mo` : null,
          deposit: app.cautionDeposit ? `$${app.cautionDeposit.toLocaleString()}` : null,
          moveInDate: app.moveInDate,
          applicantName: app.applicantName,
          hasLease: Boolean(associatedLease),
          leasePendingSignature: associatedLease && !associatedLease.tenantSigned,
        },
        dashboardTab: 'applications',
      });
    });

    // 2. Purchase Offers & Acquisition Deal Rooms (Buy Journey)
    offers.forEach((offer) => {
      if (!isUserMatch(offer.buyerEmail, offer.buyerId, offer.buyerName)) return;

      let progressStage = 1;
      let statusLabel = 'Offer Under Review';
      let statusType = 'blue';

      if (offer.status === 'accepted') {
        progressStage = 3;
        statusLabel = 'Offer Accepted · Deal Room Active';
        statusType = 'emerald';
      } else if (offer.status === 'countered') {
        progressStage = 2;
        statusLabel = 'Counter-Offer Received';
        statusType = 'amber';
      } else if (offer.status === 'rejected') {
        progressStage = 1;
        statusLabel = 'Offer Not Accepted';
        statusType = 'rose';
      }

      list.push({
        id: offer.id,
        category: 'buy',
        type: 'Purchase Offer',
        title: offer.listingTitle,
        location: offer.listingLocation,
        listingId: offer.listingId,
        date: offer.submittedAt || 'Recent',
        status: statusLabel,
        statusType,
        progressStage,
        totalStages: 5,
        stages: ['Offer Submitted', 'Counter / Terms', 'Due Diligence', 'Escrow', 'Closing'],
        details: {
          offeredAmount: offer.offerAmount ? `$${offer.offerAmount.toLocaleString()}` : null,
          askingPrice: offer.askingPrice ? `$${offer.askingPrice.toLocaleString()}` : null,
          earnestDeposit: offer.earnestDepositAmount ? `$${offer.earnestDepositAmount.toLocaleString()}` : null,
          timeline: `${offer.closingTimelineDays || 30} Days Closing`,
          isAccepted: offer.status === 'accepted',
        },
        dashboardTab: 'offers',
      });
    });

    // 3. Booked Viewings
    viewings.forEach((v) => {
      if (!isUserMatch(v.seekerEmail, v.seekerId, v.seekerName)) return;

      const isConfirmed = v.status === 'confirmed';
      list.push({
        id: v.id,
        category: 'viewing',
        type: 'Viewing Appointment',
        title: v.listingTitle,
        location: v.listingLocation,
        listingId: v.listingId,
        image: v.image,
        date: `${v.date} @ ${v.time}`,
        status: isConfirmed ? 'Confirmed · Address Unlocked' : 'Pending Confirmation',
        statusType: isConfirmed ? 'emerald' : 'amber',
        progressStage: isConfirmed ? 3 : 2,
        totalStages: 3,
        stages: ['Requested', 'Lister Confirmation', 'Address & Tour'],
        details: {
          viewingMode: v.viewingMode === 'virtual_video' ? 'Virtual Video Tour' : 'In-Person Inspection',
          exactAddress: isConfirmed ? v.exactAddress : 'Exact address revealed once lister confirms',
          isAddressUnlocked: isConfirmed,
          price: v.price,
        },
        dashboardTab: 'viewings',
      });
    });

    return list;
  }, [currentUser, isSeeker, applications, offers, leases, viewings, userEmail, userId, userName]);

  // If user is not logged in, not a seeker, or has not made any attempt to rent/buy, do not render anything
  if (!currentUser || !isSeeker || userRelevantItems.length === 0) {
    return null;
  }

  // Filter items by category tab
  const displayedItems = userRelevantItems.filter((i) => {
    if (selectedFilter === 'all') return true;
    return i.category === selectedFilter;
  });

  const rentCount = userRelevantItems.filter((i) => i.category === 'rent').length;
  const buyCount = userRelevantItems.filter((i) => i.category === 'buy').length;
  const viewingCount = userRelevantItems.filter((i) => i.category === 'viewing').length;

  return (
    <section className="bg-gradient-to-b from-emerald-950 via-slate-900 to-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-y border-emerald-900/50">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Deal & Application Tracker
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Your active property journey
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl">
              Track landlord reviews, confirmed viewing locations, digital lease agreements, and purchase offer progress in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl text-xs font-black">
              {userRelevantItems.length} Active {userRelevantItems.length === 1 ? 'Property' : 'Properties'} in Pipeline
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="inline-flex p-1 bg-white/10 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition text-xs ${
                selectedFilter === 'all' ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'text-gray-300 hover:text-white'
              }`}
            >
              All Updates ({userRelevantItems.length})
            </button>
            {rentCount > 0 && (
              <button
                type="button"
                onClick={() => setSelectedFilter('rent')}
                className={`px-3 py-1 rounded-lg font-bold transition text-xs ${
                  selectedFilter === 'rent' ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                Rent Applications ({rentCount})
              </button>
            )}
            {buyCount > 0 && (
              <button
                type="button"
                onClick={() => setSelectedFilter('buy')}
                className={`px-3 py-1 rounded-lg font-bold transition text-xs ${
                  selectedFilter === 'buy' ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                Purchase Offers ({buyCount})
              </button>
            )}
            {viewingCount > 0 && (
              <button
                type="button"
                onClick={() => setSelectedFilter('viewings')}
                className={`px-3 py-1 rounded-lg font-bold transition text-xs ${
                  selectedFilter === 'viewings' ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                Viewings ({viewingCount})
              </button>
            )}
          </div>
        </div>

        {/* Live Tracking Cards Display */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedItems.map((item) => {
            const isRent = item.category === 'rent';
            const isBuy = item.category === 'buy';
            const isViewing = item.category === 'viewing';

            return (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 flex flex-col justify-between hover:border-emerald-400/40 transition shadow-lg group"
              >
                <div>
                  {/* Top Row: Type & Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/15 text-gray-200">
                      {item.type}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.statusType === 'emerald'
                          ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                          : item.statusType === 'amber'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : item.statusType === 'blue'
                          ? 'bg-blue-400/20 text-cyan-300 border border-cyan-400/30'
                          : 'bg-rose-400/20 text-rose-300 border border-rose-400/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Property Title & Location */}
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.location}
                  </p>

                  {/* Milestone Progress Pipeline */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold mb-1.5">
                      <span>Milestone Progress</span>
                      <span className="text-emerald-400">Step {item.progressStage} of {item.totalStages}</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
                      {item.stages.map((stageName, idx) => {
                        const isCompleted = idx + 1 < item.progressStage;
                        const isCurrent = idx + 1 === item.progressStage;
                        return (
                          <div key={stageName} className="flex flex-col gap-1">
                            <div
                              className={`h-1.5 rounded-full transition ${
                                isCompleted
                                  ? 'bg-emerald-400'
                                  : isCurrent
                                  ? 'bg-emerald-300 animate-pulse'
                                  : 'bg-white/20'
                              }`}
                            />
                            <span className="text-[9px] text-gray-400 truncate" title={stageName}>
                              {stageName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Context Specific Details */}
                  <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/10 text-xs space-y-1.5">
                    {isRent && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Monthly Rent:</span>
                          <span className="font-black text-emerald-300">{item.details?.monthlyRent}</span>
                        </div>
                        {item.details?.deposit && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Caution Deposit:</span>
                            <span className="font-semibold text-gray-200">{item.details?.deposit}</span>
                          </div>
                        )}
                        {item.details?.moveInDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Move-in Target:</span>
                            <span className="font-medium text-gray-200">{item.details?.moveInDate}</span>
                          </div>
                        )}
                        {item.details?.leasePendingSignature && (
                          <div className="pt-1 mt-1 border-t border-white/10 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                            <span>✍️ Action required: Digital lease waiting for your e-signature</span>
                          </div>
                        )}
                      </>
                    )}

                    {isBuy && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Formal Offer:</span>
                          <span className="font-black text-cyan-300">{item.details?.offeredAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Asking Price:</span>
                          <span className="font-semibold text-gray-400 line-through">{item.details?.askingPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Earnest Escrow:</span>
                          <span className="font-semibold text-gray-200">{item.details?.earnestDeposit}</span>
                        </div>
                        {item.details?.isAccepted && (
                          <div className="pt-1 mt-1 border-t border-white/10 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                            <span>🏛️ 5-Stage Due Diligence Deal Room is active</span>
                          </div>
                        )}
                      </>
                    )}

                    {isViewing && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Appointment:</span>
                          <span className="font-bold text-white">📅 {item.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tour Format:</span>
                          <span className="font-medium text-gray-200">{item.details?.viewingMode}</span>
                        </div>
                        <div className="pt-1.5 border-t border-white/10">
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Exact Unit Address:</span>
                          <span className={`text-xs font-mono block mt-0.5 ${item.details?.isAddressUnlocked ? 'text-emerald-300 font-bold' : 'text-amber-300/80 italic'}`}>
                            {item.details?.isAddressUnlocked ? `🔓 ${item.details?.exactAddress}` : `🔒 ${item.details?.exactAddress}`}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProperty(item.listingId)}
                    className="text-xs font-bold text-gray-300 hover:text-white underline transition"
                  >
                    View Property
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard', { tab: item.dashboardTab })}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <span>Open in Dashboard</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Info */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 border-t border-white/10 pt-4">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Updates automatically sync when landlords confirm viewings, counter offers, or sign leases.</span>
          </p>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline"
          >
            Go to Full Seeker Dashboard →
          </button>
        </div>
      </div>
    </section>
  );
}
