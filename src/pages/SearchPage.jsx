import React, { useMemo, useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { PROPERTY_TYPES } from '../utils/constants';
import { marketplaceStore } from '../services/marketplaceStore';

export default function SearchPage({ initialFilters = {}, onSelectProperty = () => {}, onNavigate = () => {} }) {
	const [properties, setProperties] = useState(() => marketplaceStore.getListings());

	useEffect(() => {
		const unsub = marketplaceStore.subscribe(() => {
			setProperties(marketplaceStore.getListings());
		});
		return unsub;
	}, []);

	const [mode, setMode] = useState(initialFilters.mode || 'rent');
	const [location, setLocation] = useState(initialFilters.location || '');
	const [type, setType] = useState(initialFilters.type || 'all');
	const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms || 'any');
	const [maxBudget, setMaxBudget] = useState(initialFilters.maxBudget || '');
	const [verifiedOnly, setVerifiedOnly] = useState(true);
	const [saved, setSaved] = useState(new Set(['sf-201', 'sf-202']));

	const results = useMemo(() => properties.filter((property) => {
		if (property.listingType !== mode || (verifiedOnly && !property.isVerified)) return false;
		if (type !== 'all' && property.propertyType !== type) return false;
		if (bedrooms !== 'any' && property.bedrooms < Number(bedrooms.replace('+', ''))) return false;
		if (maxBudget && property.price > Number(maxBudget)) return false;
		if (location) {
			const query = location.toLowerCase();
			if (![property.title, property.location, property.neighborhood].some((value) => value?.toLowerCase().includes(query))) return false;
		}
		return true;
	}), [mode, type, bedrooms, maxBudget, location, verifiedOnly]);

	const toggleSaved = (id, value) => setSaved((previous) => {
		const next = new Set(previous);
		value ? next.add(id) : next.delete(id);
		return next;
	});

	return (
		<main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Property Seeker search</p>
				<div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div><h1 className="text-3xl font-black tracking-tight text-gray-900">Find verified homes that fit.</h1><p className="mt-2 text-sm text-gray-500">Filter by budget and area, compare details, and move from viewing to offer.</p></div>
				</div>
				<section className="mt-8 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
					<div className="flex flex-wrap gap-2">{['rent', 'buy'].map((value) => <button key={value} type="button" onClick={() => setMode(value)} className={`rounded-xl px-5 py-2 text-xs font-black uppercase tracking-wider transition ${mode === value ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>{value === 'rent' ? 'Rent' : 'Buy'}</button>)}</div>
					<div className="mt-4 grid gap-3 md:grid-cols-5">
						<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Area or neighborhood" className="rounded-xl border border-gray-300 px-3 py-3 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 md:col-span-2" />
						<select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-gray-300 px-3 py-3 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100">{PROPERTY_TYPES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
						<select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} className="rounded-xl border border-gray-300 px-3 py-3 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"><option value="any">Any bedrooms</option><option value="1">1+ bedroom</option><option value="2">2+ bedrooms</option><option value="3">3+ bedrooms</option><option value="4+">4+ bedrooms</option></select>
						<input type="number" value={maxBudget} onChange={(event) => setMaxBudget(event.target.value)} placeholder={mode === 'rent' ? 'Max monthly budget' : 'Max purchase price'} className="rounded-xl border border-gray-300 px-3 py-3 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
					</div>
					<label className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-700"><input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} className="h-4 w-4 rounded text-emerald-600" /> Only verified listings and real photos</label>
				</section>
				<div className="mt-8 flex items-center justify-between"><h2 className="text-lg font-black text-gray-900">{results.length} homes match</h2><span className="text-xs font-semibold text-gray-500">{mode === 'rent' ? 'Move-in-ready focus' : 'Title and offer details'}</span></div>
				{results.length ? <div className="mt-4 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{results.map((property) => <PropertyCard key={property.id} property={property} isAuthenticated isFavorite={saved.has(property.id)} onToggleFavorite={toggleSaved} onSelect={onSelectProperty} onQuickView={(selected) => onNavigate('property-detail', { property: selected })} onBookViewing={(selected) => onNavigate('property-detail', { property: selected, openBooking: true })} />)}</div> : <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm text-gray-500">No verified homes match those filters. Try widening the area or budget.</div>}
			</div>
		</main>
	);
}
