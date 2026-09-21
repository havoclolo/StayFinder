import React, { useState } from 'react';
import { formatViewingDate } from '../utils/formatters';

/**
 * SlotPicker Component
 * Key Anti-Fraud Pillar of StayFinder (PRD 1.0):
 * Allows property seekers to book verified in-person or virtual viewing slots
 * directly with verified landlords and certified agents.
 * Eliminates "inspection fee" extortion and fake listing scams.
 */
export default function SlotPicker({
  property,
  onBookingConfirmed = () => {},
  onCancel = () => {},
}) {
  const availableSlots = property?.availableViewingSlots || [
    { date: 'Tomorrow', times: ['10:00 AM', '02:00 PM', '04:30 PM'] },
    { date: 'Saturday', times: ['11:00 AM', '01:30 PM', '03:30 PM'] },
    { date: 'Monday', times: ['09:30 AM', '12:00 PM'] },
  ];

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(availableSlots[0]?.times[0] || '10:00 AM');
  const [viewingMode, setViewingMode] = useState('in_person'); // 'in_person' | 'virtual_video'
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const activeDateSlot = availableSlots[selectedDateIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const bookingData = {
      propertyId: property.id,
      propertyTitle: property.title,
      viewingDate: activeDateSlot?.date,
      viewingTime: selectedTime,
      viewingMode,
      seekerName: fullName,
      seekerPhone: phone,
      notes,
      lister: property.lister,
      bookedAt: new Date().toISOString(),
    };

    setIsSuccess(true);
    setTimeout(() => {
      onBookingConfirmed(bookingData);
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="p-6 sm:p-8 text-center bg-white rounded-3xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-gray-900">Viewing Appointment Confirmed!</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-sm mx-auto">
          Your {viewingMode === 'in_person' ? 'in-person' : 'video'} tour for <strong className="text-gray-900">{property.title}</strong> is scheduled for <strong className="text-gray-900">{activeDateSlot?.date} at {selectedTime}</strong>.
        </p>

        <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-left text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <svg className="w-4 h-4 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>StayFinder Scam-Free Guarantee</span>
          </div>
          <p className="text-emerald-800 leading-relaxed">
            You will NOT be charged any viewing or mobilization fee. The verified host has been notified directly on the platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl max-w-lg w-full text-left">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Verified Viewing Scheduler
          </span>
          <h3 className="text-lg font-black text-gray-900 mt-1">Book a Verified Viewing</h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
          aria-label="Cancel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* 1. Viewing Mode (In-Person vs Virtual) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Tour Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setViewingMode('in_person')}
              className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                viewingMode === 'in_person'
                  ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900 font-bold'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">🚶</span>
              <div>
                <p className="text-xs font-bold text-gray-900">In-Person Tour</p>
                <p className="text-[10px] text-gray-500">Walkthrough property</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setViewingMode('virtual_video')}
              className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                viewingMode === 'virtual_video'
                  ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900 font-bold'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">📹</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Live Video Tour</p>
                <p className="text-[10px] text-gray-500">Virtual walkthrough</p>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Date Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Select Day</label>
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {availableSlots.map((slot, index) => (
              <button
                key={slot.date}
                type="button"
                onClick={() => {
                  setSelectedDateIndex(index);
                  if (slot.times.length > 0) setSelectedTime(slot.times[0]);
                }}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold shrink-0 transition ${
                  selectedDateIndex === index
                    ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                    : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                }`}
              >
                {slot.date}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Time Slots */}
        {activeDateSlot && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Available Time Slots</label>
            <div className="grid grid-cols-3 gap-2">
              {activeDateSlot.times.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition ${
                    selectedTime === time
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Seeker Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Emmanuel Eseyin"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Phone / WhatsApp</label>
            <input
              type="tel"
              required
              placeholder="+234 800 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Anti-Scam Security Notice (Directly answering PRD problem statement) */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-[11px] text-amber-900">
          <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>
            <strong>Scam Protection:</strong> StayFinder prohibits agents or landlords from charging upfront viewing or inspection fees. Viewings on StayFinder are 100% free.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold rounded-xl transition shadow-md shadow-emerald-500/20 active:scale-95"
          >
            Confirm Viewing Appointment
          </button>
        </div>
      </form>
    </div>
  );
}
