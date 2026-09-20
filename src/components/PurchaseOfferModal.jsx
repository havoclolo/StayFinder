import React, { useState } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';
import { formatPrice } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';

export default function PurchaseOfferModal({ property, onClose, onSuccess }) {
  const { currency } = useCurrency();
  const [offerAmount, setOfferAmount] = useState(property.price ? Math.round(property.price * 0.95) : 500000);
  const [earnestDepositPercent, setEarnestDepositPercent] = useState(10);
  const [closingTimelineDays, setClosingTimelineDays] = useState(30);
  const [financingType, setFinancingType] = useState('Cash / Verified Wire Transfer');
  const [selectedConditions, setSelectedConditions] = useState([
    'Clean Land Registry search and verification of Governor’s Consent / C of O at Alausa.',
    'Structural & engineering inspection without unresolvable structural defects.',
    'Vacant possession and execution of Deed of Assignment upon final settlement.',
  ]);
  const [submitting, setSubmitting] = useState(false);

  const earnestAmount = Math.round(offerAmount * (earnestDepositPercent / 100));

  const toggleCondition = (cond) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      marketplaceStore.submitPurchaseOffer({
        listing: property,
        offerAmount: Number(offerAmount),
        earnestDepositPercent: Number(earnestDepositPercent),
        closingTimelineDays: Number(closingTimelineDays),
        financingType,
        conditions: selectedConditions,
      });
      setSubmitting(false);
      onSuccess?.();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 my-8 border border-gray-100 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              Purchase Offer · PRD Buy Flow 5.6
            </span>
            <h2 className="text-xl font-black text-gray-900 mt-2">Submit Formal Purchase Offer</h2>
            <p className="text-xs text-gray-500 mt-0.5">{property.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400">Asking Price</p>
              <p className="text-lg font-black text-gray-900">{formatPrice(property.price, 'buy', 'month', currency)}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400">Title Status</p>
              <p className="text-xs font-bold text-emerald-700 mt-1">{property.titleStatus || 'Governor’s Consent'}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Your Formal Offer Price ({currency} equivalent)</label>
            <input
              type="number"
              required
              min="1000"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-bold text-gray-900"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Difference from asking: <span className={offerAmount < property.price ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                {offerAmount < property.price ? `-${formatPrice(property.price - offerAmount, 'buy', 'month', currency)} (${Math.round(((property.price - offerAmount) / property.price) * 100)}% under asking)` : 'Matches or exceeds asking'}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Earnest Deposit (%)</label>
              <select
                value={earnestDepositPercent}
                onChange={(e) => setEarnestDepositPercent(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs"
              >
                <option value={5}>5% ({formatPrice(offerAmount * 0.05, 'buy', 'month', currency)})</option>
                <option value={10}>10% ({formatPrice(offerAmount * 0.10, 'buy', 'month', currency)}) - Standard</option>
                <option value={20}>20% ({formatPrice(offerAmount * 0.20, 'buy', 'month', currency)})</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Closing Timeline</label>
              <select
                value={closingTimelineDays}
                onChange={(e) => setClosingTimelineDays(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs"
              >
                <option value={14}>14 Days (Fast cash close)</option>
                <option value={30}>30 Days (Standard due diligence)</option>
                <option value={60}>60 Days (Subject to mortgage)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Financing & Funding Method</label>
            <select
              value={financingType}
              onChange={(e) => setFinancingType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs"
            >
              <option value="Cash / Verified Wire Transfer">Cash / Verified Wire Transfer (Proof of Funds)</option>
              <option value="Pre-Approved Mortgage Loan">Pre-Approved Mortgage Loan</option>
              <option value="Structured Staged Installments">Structured Staged Installments</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Legal Conditions & Due Diligence Clauses</label>
            <div className="space-y-2">
              {[
                'Clean Land Registry search and verification of Governor’s Consent / C of O at Alausa.',
                'Structural & engineering inspection without unresolvable structural defects.',
                'Vacant possession and execution of Deed of Assignment upon final settlement.',
                'Immediate refund of earnest deposit if title search proves encumbered.',
              ].map((cond) => (
                <label key={cond} className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(cond)}
                    onChange={() => toggleCondition(cond)}
                    className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{cond}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900">
            <strong>Due Diligence Protection:</strong> Once accepted, this offer unlocks the 5-stage Deal Room for legal searches, document exchange, and escrow.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition disabled:opacity-50"
            >
              {submitting ? 'Submitting Offer...' : `Submit Offer (${formatPrice(Number(offerAmount), 'buy', 'month', currency)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
