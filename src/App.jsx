import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function StayFinderApp() {
  const [activePage, setActivePage] = useState('login');
  const [navigationData, setNavigationData] = useState(null);
  const { user: currentUser, logout } = useAuth();

  useEffect(() => {
    if (!currentUser) return undefined;

    window.history.pushState({ stayFinderHome: true }, '', window.location.href);

    const handleBrowserBack = () => {
      logout();
      setActivePage('login');
      setNavigationData(null);
    };

    window.addEventListener('popstate', handleBrowserBack);
    return () => window.removeEventListener('popstate', handleBrowserBack);
  }, [currentUser, logout]);

  const handleNavigate = (page, data = null) => {
    console.log(`Navigating to: ${page}`, data);
    setActivePage(page);
    setNavigationData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setActivePage('login');
    setNavigationData(null);
  };

  if (!currentUser) {
    return <LoginPage initialMode="login" onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Navbar
        user={currentUser}
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogin={() => handleNavigate('login')}
        onSignup={() => handleNavigate('login', { mode: 'signup' })}
        onLogout={handleLogout}
        onSearchClick={() => handleNavigate('search')}
        unreadNotifications={2}
        savedCount={3}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProperty={(id, property) => handleNavigate('property-detail', { id, property })}
            onSearch={(searchParams) => handleNavigate('search', searchParams)}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            user={currentUser || { name: 'Guest User', role: 'guest' }}
            initialTab={navigationData?.tab || 'viewings'}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            initialMode={navigationData?.mode || 'login'}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'search' && (
          <SearchPage
            initialFilters={navigationData || {}}
            onNavigate={handleNavigate}
            onSelectProperty={(id, property) => handleNavigate('property-detail', { id, property })}
          />
        )}

        {activePage === 'property-detail' && (
          <PropertyDetailPage
            property={navigationData?.property}
            openBooking={navigationData?.openBooking}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'create-listing' && <CreateListingPage onNavigate={handleNavigate} />}

        {activePage === 'admin' && <AdminPage onNavigate={handleNavigate} />}

        {!['home', 'dashboard', 'login', 'search', 'property-detail', 'create-listing', 'admin'].includes(activePage) && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                Routing Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
                {activePage.replace('-', ' ')} Page
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                Navigated to <code>{activePage}</code>. Next step: implement this page component.
              </p>
              {navigationData && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 text-left text-xs font-mono text-gray-700 max-w-md mx-auto overflow-auto">
                  <span className="font-bold text-gray-900 block mb-1">Route Payload:</span>
                  <pre>{JSON.stringify(navigationData, null, 2)}</pre>
                </div>
              )}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleNavigate('dashboard')}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-xs hover:bg-black transition"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StayFinderApp />
    </AuthProvider>
  );
}
