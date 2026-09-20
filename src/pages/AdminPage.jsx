import React, { useState, useEffect } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';
import { formatPrice } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';

export default function AdminPage({ onNavigate = () => {} }) {
  const { currency } = useCurrency();
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'agents' | 'fraud' | 'metrics'
  const [listings, setListings] = useState(marketplaceStore.getListings());
  const [fraudReports, setFraudReports] = useState(marketplaceStore.getFraudReports());
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const unsub = marketplaceStore.subscribe(() => {
      setListings(marketplaceStore.getListings());
      setFraudReports(marketplaceStore.getFraudReports());
    });
    return unsub;
  }, []);

  const pendingListings = listings.filter((l) => l.status === 'pending_verification' || !l.isVerified);
  const liveListings = listings.filter((l) => l.status === 'live');
  const openFraudReports = fraudReports.filter((r) => r.status === 'open' || r.status === 'investigating');

  const handleApproveListing = (listingId) => {
    marketplaceStore.verifyListing(listingId, true, 'All title deeds and ownership certificates verified by Ops.');
    setNotice(`Listing ${listingId} approved and is now LIVE in public marketplace search!`);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleRejectListing = (listingId) => {
    marketplaceStore.verifyListing(listingId, false, 'Incomplete documentation or unverified ownership.');
    setNotice(`Listing ${listingId} rejected.`);
    setTimeout(() => setNotice(''), 4000);
  };

  const handleResolveFraud = (reportId, action) => {
    marketplaceStore.resolveFraudReport(reportId, action);
    setNotice(`Fraud report resolved with action: ${action}.`);
    setTimeout(() => setNotice(''), 4000);
  };

  // Mock Agent Accreditation Queue
  const [agentVerifications, setAgentVerifications] = useState([
    {
      id: 'agent-req-1',
      name: 'Agent Dele Alabi',
      agency: 'Premier Heritage Partners',
      license: 'LAG-REA-2024-88 (LSRRDA Certified)',
      submittedDocs: 'CAC_Registration_Certificate.pdf, Professional_Indemnity_Insurance.pdf',
      status: 'verified',
      date: 'Yesterday',
    },
    {
      id: 'agent-req-2',
      name: 'Mrs. Folake Okafor',
      agency: 'Okafor Family Holdings',
      license: 'Individual Landlord Ownership Proof',
      submittedDocs: 'Lagos_Governor_Consent_Title_Deed.pdf, Utility_Bill_Ikoyi.pdf',
      status: 'pending',
      date: 'Today',
    },
  ]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                PRD Module 5.11 · Trust, Safety & Operations Center
              </span>
              <span className="text-xs font-bold text-gray-500">SLA: &lt;6 hours</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-gray-900">Platform Moderation & Verification</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Uphold the scam-free trust gate: verify listing authenticity, license accreditation, and resolve reported fraud.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Public Marketplace
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-black"
            >
              Lister Dashboard
            </button>
          </div>
        </div>

        {/* Notice alert banner */}
        {notice && (
          <div className="mt-4 p-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-sm animate-fadeIn flex items-center gap-2">
            <span>✓</span>
            <span>{notice}</span>
          </div>
        )}

        {/* Platform Metric Pillars */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
            <p className="text-[10px] font-black uppercase text-gray-400">Active Live Listings</p>
            <p className="mt-1 text-2xl font-black text-gray-900">{liveListings.length}</p>
            <span className="text-[10px] text-emerald-600 font-bold">Target: 200+ per launch city</span>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
            <p className="text-[10px] font-black uppercase text-amber-700">Pending Verification</p>
            <p className="mt-1 text-2xl font-black text-amber-900">{pendingListings.length}</p>
            <span className="text-[10px] text-amber-700 font-bold">Requires document review</span>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-2xs">
            <p className="text-[10px] font-black uppercase text-rose-700">Fraud & Scam Reports</p>
            <p className="mt-1 text-2xl font-black text-rose-900">{openFraudReports.length}</p>
            <span className="text-[10px] text-rose-700 font-bold">Target: &lt; 0.5% fraud rate</span>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-2xs">
            <p className="text-[10px] font-black uppercase text-indigo-700">Viewing-to-Close Rate</p>
            <p className="mt-1 text-2xl font-black text-indigo-900">22.4%</p>
            <span className="text-[10px] text-indigo-700 font-bold">Exceeds &gt;15% PRD Target</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'listings'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Listing Verification Queue ({pendingListings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'agents'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Agent & Landlord Accreditation (2)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fraud')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'fraud'
                ? 'bg-rose-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Fraud & Scam Reports ({openFraudReports.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              activeTab === 'metrics'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            PRD Funnel Analytics
          </button>
        </div>

        {/* TAB 1: LISTING VERIFICATION QUEUE */}
        {activeTab === 'listings' && (
          <div className="mt-6 space-y-4">
            {pendingListings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-xs text-gray-500">
                🎉 All submitted listings have been reviewed! Marketplace trust gate is 100% up to date.
              </div>
            ) : (
              pendingListings.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'}
                      alt={p.title}
                      className="w-28 h-28 object-cover rounded-2xl shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800">
                          {p.status}
                        </span>
                        <span className="text-xs font-bold text-gray-500">{p.listingType === 'rent' ? 'Rental' : 'For Sale'}</span>
                      </div>
                      <h3 className="text-base font-black text-gray-900">{p.title}</h3>
                      <p className="text-xs text-gray-500">{p.location} · {formatPrice(p.price, p.listingType, p.tenure, currency)}</p>
                      <div className="pt-2 text-[11px] text-gray-600 space-y-0.5">
                        <p><strong>Title Status:</strong> {p.titleStatus || 'Deed / C of O submitted'}</p>
                        <p><strong>Lister:</strong> {p.lister?.name} ({p.lister?.type})</p>
                        <p><strong>Submitted Document:</strong> <span className="text-blue-600 font-semibold underline cursor-pointer">View Verified_Title_Document.pdf</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleApproveListing(p.id)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                    >
                      Approve & Publish Live
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectListing(p.id)}
                      className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition"
                    >
                      Reject / Flag Info
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: AGENT & LANDLORD ACCREDITATION */}
        {activeTab === 'agents' && (
          <div className="mt-6 space-y-4">
            {agentVerifications.map((agent) => (
              <div key={agent.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-gray-900">{agent.name}</span>
                    <span className="text-xs text-gray-500 font-semibold">({agent.agency})</span>
                    {agent.status === 'verified' && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
                        KYC & License Verified ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600"><strong>License / Credential:</strong> {agent.license}</p>
                  <p className="text-xs text-gray-500"><strong>Submitted Credentials:</strong> {agent.submittedDocs}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => alert(`Accreditation credentials for ${agent.name} verified.`)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Grant Verified Badge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: FRAUD REPORTS */}
        {activeTab === 'fraud' && (
          <div className="mt-6 space-y-4">
            {fraudReports.map((report) => (
              <div key={report.id} className="bg-white rounded-3xl border border-rose-200 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                      {report.priority} Priority
                    </span>
                    <span className="text-xs font-bold text-gray-500">{report.date}</span>
                    <span className="text-xs text-gray-400">· Reported by: {report.reportedBy}</span>
                  </div>
                  <h3 className="text-base font-black text-gray-900">{report.reason}</h3>
                  <p className="text-xs text-gray-700 bg-rose-50/50 p-3 rounded-xl border border-rose-100">{report.detail}</p>
                  <p className="text-xs text-gray-500">Target: <strong>{report.listingTitle}</strong></p>
                </div>

                <div className="flex md:flex-col justify-end gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleResolveFraud(report.id, 'suspend')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                  >
                    Suspend Listing & Warn Lister
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolveFraud(report.id, 'dismiss')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold"
                  >
                    Dismiss Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: METRICS & CONVERSION FUNNEL (PRD Section 2) */}
        {activeTab === 'metrics' && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-gray-900">PRD 6-Month Target Tracking</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Supply Liquidity (Verified active listings in Lagos)</span>
                    <span className="text-emerald-700 font-black">214 / 200+ Target (107%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Search-to-Viewing Conversion Rate</span>
                    <span className="text-emerald-700 font-black">6.8% (Target &gt; 5%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-[70%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Viewing-to-Close Conversion Rate</span>
                    <span className="text-emerald-700 font-black">18.2% (Target &gt; 15%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-[80%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Average Days from Listing to Lease Signed (Rentals)</span>
                    <span className="text-emerald-700 font-black">14.2 Days (Target &lt; 21 Days)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-[90%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-gray-900">Scam & Fraud Eradication Policy</h3>
              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>100% Verified Gate:</strong> No listing can appear on public search without prior title/agency document verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Zero Viewing Fees:</strong> Asking seekers to pay for inspections triggers automated suspension.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Approximate Location Pins:</strong> Reduces address-scraping risk until viewings are mutually confirmed.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
