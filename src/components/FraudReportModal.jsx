import React, { useState } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';

export default function FraudReportModal({ listing, onClose, onSuccess }) {
  const [reason, setReason] = useState('Demanded viewing / inspection fee (Scam)');
  const [detail, setDetail] = useState('');
  const [priority, setPriority] = useState('Urgent');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reasons = [
    'Demanded viewing / inspection fee (Scam)',
    'Fake or stolen property photos',
    'Property does not exist / No-show agent',
    'Impersonating rightful landlord or broker',
    'Price inflated upon arrival (bait-and-switch)',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!detail.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      marketplaceStore.reportFraud({
        listingId: listing.id,
        listingTitle: listing.title,
        reason,
        detail,
        priority,
      });
      setSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-gray-100 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
              🛡️
            </span>
            <div>
              <h3 className="text-base font-black text-gray-900">Report Listing or Scam</h3>
              <p className="text-[10px] text-gray-500">Fast-response Trust & Safety Queue</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-black">
              ✓
            </div>
            <h4 className="text-base font-black text-gray-900">Report Dispatched to Ops</h4>
            <p className="text-xs text-gray-600">
              Our Trust & Operations team investigates all fraud claims within 4 hours. Thank you for protecting the StayFinder community!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900">
              <strong>Zero Tolerance Policy:</strong> StayFinder strictly prohibits upfront inspection fees. Legitimate viewings are always free.
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Evidence & Incident Details</label>
              <textarea
                required
                rows="3"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Describe what happened, including phone numbers or payment links if an inspection fee was demanded..."
                className="w-full text-xs rounded-xl border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Priority Level</label>
              <div className="flex gap-2">
                {['Normal', 'High', 'Urgent'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                      priority === p
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !detail.trim()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Fraud Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
