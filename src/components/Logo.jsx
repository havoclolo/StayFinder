import React from 'react';

export default function Logo({ compact = false, light = false }) {
  return (
    <span className={`inline-flex items-center ${compact ? '' : 'gap-2.5'}`}>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/25 transition-transform duration-200 group-hover:scale-105">
        <span className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-emerald-400/40" />
        <span className="absolute -bottom-5 -left-3 h-8 w-8 rounded-full bg-amber-300/30" />
        <svg
          className="relative h-9 w-9"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 4.5C12.5 4.5 6.5 10.5 6.5 18c0 9.5 13.5 17.5 13.5 17.5S33.5 27.5 33.5 18C33.5 10.5 27.5 4.5 20 4.5Z" fill="#059669" stroke="white" strokeWidth="2.5" />
          <path d="m11.5 18.5 8.5-7 8.5 7M14.5 17.5V27h12v-9.5M18 27v-5h4v5" stroke="white" strokeWidth="2.5" />
          <path d="M9.5 8.5 6.5 5.5M30.5 8.5l3-3M20 2V5" stroke="#fbbf24" strokeWidth="2.5" />
        </svg>
      </span>
      {!compact && (
        <span className="text-left">
          <span className={`block text-2xl font-black leading-none tracking-[-0.04em] ${light ? 'text-white' : 'text-gray-950'}`}>
            STAY<span className="text-emerald-600">FINDER</span><span className="text-amber-400">.</span>
          </span>
          <span className={`hidden text-[9px] font-extrabold uppercase tracking-[0.18em] sm:block ${light ? 'text-emerald-300' : 'text-emerald-700'}`}>
            Global stays · verified homes
          </span>
        </span>
      )}
    </span>
  );
}