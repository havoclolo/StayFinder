import React, { useState } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';
import { formatPrice } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';

export default function RentalApplicationModal({ property, onClose, onSuccess }) {
  const { currency } = useCurrency();
  const currentUser = marketplaceStore.getCurrentUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    employer: 'TechCorp Africa',
    jobTitle: 'Senior Product Designer',
    annualIncome: '₦42,000,000 / ~$40,000 USD',
    moveInDate: '2026-11-01',
    occupants: '1',
    guarantorName: 'Chief O. Nwosu',
    guarantorPhone: '+234 803 111 2222',
    guarantorRelationship: 'Parent / Senior Civil Servant',
    idFileName: 'NIN_National_ID_Card.pdf',
    proofOfIncomeFileName: 'Official_3Month_BankStatement.pdf',
    notes: 'Non-smoker, no pets. Prepared to pay 1-year upfront upon approval.',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      marketplaceStore.submitRentalApplication({
        listingId: property.id,
        listingTitle: property.title,
        listingLocation: property.location,
        monthlyRent: property.price,
        cautionDeposit: property.cautionDeposit || Math.round(property.price * 0.15),
        ...formData,
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
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Rental Application · PRD Flow 5.5
            </span>
            <h2 className="text-xl font-black text-gray-900 mt-2">Apply for Tenancy</h2>
            <p className="text-xs text-gray-500 mt-0.5">{property.title} · {formatPrice(property.price, 'rent', property.tenure, currency)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center justify-between mb-6 px-2 text-xs font-bold text-gray-400">
          <span className={step >= 1 ? 'text-emerald-700' : ''}>1. Employment & Income</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-emerald-700' : ''}>2. Guarantor & Tenancy</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-emerald-700' : ''}>3. Document Upload</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Employer / Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.employer}
                  onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                  placeholder="e.g. Paystack / Flutterwave / Shell"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Annual Income</label>
                  <input
                    type="text"
                    required
                    value={formData.annualIncome}
                    onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <span className="text-emerald-600 font-bold">🔒 Privacy Protected:</span>
                <span>Your income details are encrypted and shared only with the verified landlord.</span>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                >
                  Continue to Guarantor Info →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Guarantor Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.guarantorName}
                    onChange={(e) => setFormData({ ...formData, guarantorName: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Guarantor Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.guarantorPhone}
                    onChange={(e) => setFormData({ ...formData, guarantorPhone: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Desired Move-in Date</label>
                  <input
                    type="date"
                    required
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Number of Occupants</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.occupants}
                    onChange={(e) => setFormData({ ...formData, occupants: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition"
                >
                  Continue to Documents →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50 text-center">
                <p className="text-xs font-bold text-gray-700">1. Government Issued Photo ID (NIN, Passport or Driver's License)</p>
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-emerald-700 font-bold bg-white p-2 rounded-xl border border-emerald-200">
                  <span>📄 {formData.idFileName}</span>
                  <span className="text-gray-400">· Ready</span>
                </div>
              </div>

              <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50 text-center">
                <p className="text-xs font-bold text-gray-700">2. Proof of Income / Employment Letter</p>
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-emerald-700 font-bold bg-white p-2 rounded-xl border border-emerald-200">
                  <span>📊 {formData.proofOfIncomeFileName}</span>
                  <span className="text-gray-400">· Ready</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Additional Message to Landlord</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application for Review'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
