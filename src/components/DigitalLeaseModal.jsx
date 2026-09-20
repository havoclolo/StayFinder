import React, { useState } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';
import { formatPrice } from '../utils/formatters';

export default function DigitalLeaseModal({ lease, onClose, onSuccess }) {
  const [signature, setSignature] = useState('Amaka Nwosu');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [paymentOption, setPaymentOption] = useState('paystack'); // 'paystack' | 'off_platform'
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignAndPay = (e) => {
    e.preventDefault();
    if (!signature.trim() || !agreedToTerms) return;

    setProcessing(true);
    setTimeout(() => {
      marketplaceStore.signLeaseAndPay(lease.id, signature, {
        method: paymentOption,
        reference: paymentOption === 'paystack' ? `PSTK-${Math.floor(100000 + Math.random() * 900000)}` : 'OFF-PLATFORM-CONFIRMED',
      });
      setProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 border border-gray-100 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              PRD 5.5 · Digital Lease Agreement & E-Signature
            </span>
            <h2 className="text-xl font-black text-gray-900 mt-2">Standard Residential Tenancy Agreement</h2>
            <p className="text-xs text-gray-500 mt-0.5">{lease.listingTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              ✓
            </div>
            <h3 className="text-xl font-black text-gray-900">Lease Executed Successfully!</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Your digital signature has been recorded with a cryptographic timestamp. Payment is confirmed and the keys handover has been triggered!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignAndPay} className="space-y-4">
            {/* Agreement Terms Box */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 max-h-56 overflow-y-auto space-y-3 leading-relaxed font-mono">
              <p className="font-bold text-gray-900 border-b pb-1">PARTIES & PREMISES</p>
              <p>Landlord: <strong>{lease.landlordName}</strong></p>
              <p>Tenant: <strong>{lease.tenantName}</strong> ({lease.tenantEmail})</p>
              <p>Premises: <strong>{lease.listingLocation}</strong></p>
              <p>Term: <strong>{lease.leaseTerm}</strong> (Commencing: {lease.startDate} to {lease.endDate})</p>

              <p className="font-bold text-gray-900 border-b pb-1 pt-2">FINANCIAL BREAKDOWN</p>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span>Rent: <strong>${lease.rentAmount?.toLocaleString()}</strong></span>
                <span>Caution Deposit: <strong>${lease.cautionDeposit?.toLocaleString()}</strong></span>
                <span>Service Charge: <strong>${lease.serviceCharge?.toLocaleString()}</strong></span>
                <span className="font-bold text-emerald-800">Total Due at Signing: <strong>${lease.totalDueAtSigning?.toLocaleString()}</strong></span>
              </div>

              <p className="font-bold text-gray-900 border-b pb-1 pt-2">CORE STATUTORY COVENANTS</p>
              <ul className="list-disc pl-4 space-y-1">
                {(lease.terms || []).map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ul>
            </div>

            {/* Landlord Sign Status */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <div>
                <span className="font-bold text-emerald-900">Landlord Signature:</span>
                <span className="ml-2 font-mono text-emerald-700">✓ Executed by {lease.landlordName}</span>
              </div>
              <span className="text-[10px] text-emerald-600 uppercase font-black tracking-wider">Verified</span>
            </div>

            {/* Tenant Signature Pad */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-800">
                Tenant E-Signature (Type your full legal name)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Enter full legal name to sign"
                  className="w-full font-serif text-lg italic text-emerald-900 bg-emerald-50/50 border border-emerald-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-200 outline-none"
                />
                <span className="absolute right-3 top-3 text-[10px] uppercase font-bold text-gray-400">Digital Stamp</span>
              </div>
            </div>

            {/* Payment Method Selection (PRD Section 5.9) */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-gray-800">Payment Method for First Rent & Deposit</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between ${
                    paymentOption === 'paystack'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === 'paystack'}
                      onChange={() => setPaymentOption('paystack')}
                      className="text-emerald-600"
                    />
                    <span className="font-black text-xs">Paystack / Flutterwave</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">Simulate instant checkout (Card, Transfer, USSD)</p>
                </label>

                <label
                  className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between ${
                    paymentOption === 'off_platform'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === 'off_platform'}
                      onChange={() => setPaymentOption('off_platform')}
                      className="text-emerald-600"
                    />
                    <span className="font-black text-xs">Confirm Paid Off-Platform</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">Direct bank wire to landlord escrow with receipt confirmation</p>
                </label>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer pt-2">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded text-emerald-600"
              />
              <span>
                I agree to the legally binding terms of this tenancy agreement and authorize the release of deposit & initial rent upon signing.
              </span>
            </label>

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
                disabled={processing || !agreedToTerms || !signature.trim()}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? 'Executing Lease & Processing...' : `Sign Digitally & Complete ($${lease.totalDueAtSigning?.toLocaleString()})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
