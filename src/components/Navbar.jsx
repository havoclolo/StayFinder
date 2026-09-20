import React, { useState, useEffect, useRef } from 'react';
import { useCurrency } from '../context/CurrencyContext';

/**
 * StayFinder Navbar Component (Real Estate Edition)
 * Aligned with Emmanuel Eseyin's PRD:
 * - Brand: Property marketplace for buying & renting verified houses
 * - Quick Navigation: Rent, Buy, Verified Inspections
 * - Landlord/Agent CTA: "List Property"
 * - User Menu: Scheduled viewings, offers/applications, agent listing manager
 * - Mobile responsive drawer & outside-click handling
 */

export default function Navbar({
  user = null,
  onNavigate = () => {},
  onLogin = () => {},
  onSignup = () => {},
  onLogout = () => {},
  onSearchClick = () => {},
  activePage = 'home',
  unreadNotifications = 2,
  savedCount = 0,
  onOpenMessages = () => {},
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [scrolled, setScrolled] = useState(false);
  const { currency: selectedCurrency, setCurrency } = useCurrency();

  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('#mobile-menu-button')
      ) {
        setIsMobileNavOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsMobileNavOpen(false);
        setIsLanguageModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNav = (targetPage, data) => {
    setIsProfileMenuOpen(false);
    setIsMobileNavOpen(false);
    if (onNavigate) {
      onNavigate(targetPage, data);
    }
  };

  const currencies = [
    { code: 'USD', symbol: '$', label: 'United States Dollar' },
    { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'CAD', symbol: '$', label: 'Canadian Dollar' },
  ];

  const languages = [
    { code: 'en', name: 'English', region: 'Global' },
    { code: 'fr', name: 'Français', region: 'France / West Africa' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* 1. BRAND LOGO */}
            <div className="flex-shrink-0 flex items-center">
              <button
                type="button"
                onClick={() => handleNav('home')}
                className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl py-1 px-1 transition"
                aria-label="StayFinder Home"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-xl font-black tracking-tight text-gray-900 bg-gradient-to-r from-emerald-700 via-teal-700 to-gray-900 bg-clip-text text-transparent block leading-tight">
                    StayFinder
                  </span>
                  <span className="hidden sm:block text-[9px] font-extrabold uppercase tracking-widest text-emerald-700">
                    Verified Property Marketplace
                  </span>
                </div>
              </button>
            </div>

            {/* 2. CENTER REAL ESTATE NAVIGATION */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-100/70 p-1.5 rounded-2xl border border-gray-200/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleNav('home', { mode: 'rent' })}
                className="px-4 py-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-white transition shadow-xs"
              >
                Rent
              </button>
              <button
                type="button"
                onClick={() => handleNav('home', { mode: 'buy' })}
                className="px-4 py-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-white transition shadow-xs"
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => handleNav('search')}
                className="px-4 py-2 rounded-xl text-emerald-800 bg-white shadow-xs flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Verified Listings</span>
              </button>
            </nav>

            {/* 3. RIGHT NAVIGATION & USER PROFILE MENU */}
            <div className="flex items-center gap-2">
              {/* Property Lister CTA */}
              {user?.role === 'lister' && (
                <button
                  type="button"
                  onClick={() => handleNav('create-listing')}
                  className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition duration-150"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>List Property</span>
                </button>
              )}

              {/* In-App Messages Drawer Button */}
              <button
                type="button"
                onClick={onOpenMessages}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition relative"
                aria-label="Messages"
                title="In-App Messages & Activity"
              >
                <span className="text-base">💬</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>

              {/* Admin Ops Link */}
              {user?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => handleNav('admin')}
                  className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
                  title="Admin Verification & Moderation Queue"
                >
                  <span>🛡️ Ops</span>
                </button>
              )}

              {/* Currency & Language Button */}
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
                aria-label="Currency and Language"
                title={`${selectedLanguage} · ${selectedCurrency}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </button>

              {/* User Profile Menu Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  id="user-menu-button"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-2.5 border border-gray-300 rounded-2xl py-1.5 pl-3 pr-1.5 hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isProfileMenuOpen ? 'shadow-md border-gray-400' : ''
                  }`}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>

                  <div className="relative">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User Avatar'}
                        className="w-8 h-8 rounded-xl object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                          <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 rounded">
                            {user.role === 'host' ? 'Verified Agent / Landlord' : user.role || 'Property Seeker'}
                          </span>
                        </div>

                        {/* Seeker Actions */}
                        {user.role === 'seeker' && (
                          <div className="py-1">
                          <button
                            type="button"
                            onClick={() => handleNav('dashboard', { tab: 'viewings' })}
                            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>My Scheduled Viewings</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                              2 Active
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNav('dashboard', { tab: 'applications' })}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Offers &amp; Applications
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNav('search', { savedOnly: true })}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>Saved Properties</span>
                            {savedCount > 0 && <span className="text-gray-400 text-[11px]">{savedCount}</span>}
                          </button>
                          </div>
                        )}

                        {/* Property Lister Tools */}
                        {user.role === 'lister' && (
                          <div className="border-t border-gray-100 py-1">
                          <button
                            type="button"
                            onClick={() => handleNav('dashboard', { tab: 'manage-listings' })}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>Manage My Listings</span>
                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Host/Agent</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNav('create-listing')}
                            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Create New Property Listing</span>
                          </button>

                          </div>
                        )}

                        {user.role === 'admin' && (
                          <div className="border-t border-gray-100 py-1">
                            <button
                              type="button"
                              onClick={() => handleNav('admin')}
                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span>Admin Verification Queue</span>
                            </button>
                          </div>
                        )}

                        {/* Logout */}
                        <div className="border-t border-gray-100 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              if (onLogout) onLogout();
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Log Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      // Guest Menu
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            if (onLogin) onLogin();
                            else handleNav('login');
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-900 hover:bg-gray-50"
                        >
                          Log In as Seeker or Landlord
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            if (onSignup) onSignup();
                            else handleNav('login', { mode: 'signup' });
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Create Account
                        </button>

                        <div className="border-t border-gray-100 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            if (onSignup) onSignup();
                            else handleNav('login', { mode: 'signup' });
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                        >
                          List a Property for Rent / Sale
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                id="mobile-menu-button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl ml-1"
                aria-label="Open mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileNavOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileNavOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gray-100">
              <button
                type="button"
                onClick={() => handleNav('home', { mode: 'rent' })}
                className="py-2 text-center text-xs font-bold bg-emerald-50 text-emerald-800 rounded-xl"
              >
                Rent a House
              </button>
              <button
                type="button"
                onClick={() => handleNav('home', { mode: 'buy' })}
                className="py-2 text-center text-xs font-bold bg-indigo-50 text-indigo-800 rounded-xl"
              >
                Buy a Property
              </button>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleNav('search')}
                className="w-full text-left px-3 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 rounded-lg"
              >
                🛡️ Verified Properties
              </button>

              <button
                type="button"
                onClick={() => {
                  if (user?.role === 'lister') {
                    handleNav('create-listing');
                  } else if (onSignup) {
                    onSignup();
                  } else {
                    handleNav('login', { mode: 'signup' });
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg"
              >
                + List Property (Landlords &amp; Agents)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Language & Currency Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-base font-black text-gray-900 mb-4">Currency Preferences</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setCurrency(curr.code);
                    setIsLanguageModalOpen(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition ${
                    selectedCurrency === curr.code
                      ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <p className="text-xs font-bold">{curr.code} ({curr.symbol})</p>
                  <p className="text-[10px] text-gray-500 truncate">{curr.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
