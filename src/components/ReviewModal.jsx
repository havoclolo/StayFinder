import React, { useState } from 'react';
import { marketplaceStore } from '../services/marketplaceStore';

export default function ReviewModal({ targetLister, listingTitle, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [tag, setTag] = useState('Accurate Photos & $0 Viewing Fee');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tags = [
    'Accurate Photos & $0 Viewing Fee',
    'Clean Title & Punctual Viewing',
    'No Hidden Charges',
    'Professional & Courteous Lister',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      marketplaceStore.addReview({
        targetId: targetLister?.id || 'lister',
        targetName: targetLister?.name || 'Verified Lister',
        targetType: targetLister?.type?.includes('Agent') ? 'agent' : 'landlord',
        rating,
        tag,
        comment,
      });
      setSubmitting(false);
      onSuccess?.();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Verified Seeker Review
            </span>
            <h3 className="text-base font-black text-gray-900 mt-1">Review {targetLister?.name || 'Lister'}</h3>
            <p className="text-[11px] text-gray-500">{listingTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-2">
            <p className="text-xs font-bold text-gray-600 mb-1">Your Rating</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {star <= rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Trust Highlight Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2"
            >
              {tags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Your Feedback & Experience</label>
            <textarea
              required
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was the property as advertised? Did the agent show up on time with no surprise fees?"
              className="w-full text-xs rounded-xl border border-gray-300 p-3"
            />
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
              disabled={submitting || !comment.trim()}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
