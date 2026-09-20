import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import AdminPage from './pages/AdminPage';
import MessagingDrawer from './components/MessagingDrawer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

function StayFinderApp() {
  const [activePage, setActivePage] = useState('home');
  const [navigationData, setNavigationData] = useState(null);
  const [globalMessagingOpen, setGlobalMessagingOpen] = useState(false);
  const { user: currentUser, logout } = useAuth();

  useEffect(() => {
    if (!currentUser) return undefined;

    if (currentUser.role === 'admin' && activePage === 'home') {
      setActivePage('admin');
    } else if (currentUser.role === 'lister' && activePage === 'home') {
      setActivePage('dashboard');
      setNavigationData({ tab: 'listings' });
    }

    window.history.pushState({ stayFinderHome: true }, '', window.location.href);

    const handleBrowserBack = () => {
      logout();
      setActivePage('login');
      setNavigationData(null);
    };

    window.addEventListener('popstate', handleBrowserBack);
    return () => window.removeEventListener('popstate', handleBrowserBack);
  }, [currentUser, activePage, logout]);

  const handleNavigate = (page, data = null) => {
    const roleLandingPage = currentUser?.role === 'admin' ? 'admin' : 'dashboard';
    const roleLandingData = currentUser?.role === 'lister' ? { tab: 'listings' } : null;
    const canBrowseMarketplace = !currentUser || currentUser.role === 'seeker';
    const canAccess =
      ((page === 'home' || page === 'search' || page === 'property-detail') && canBrowseMarketplace) ||
      page === 'login' ||
      (page === 'dashboard' && ['seeker', 'lister'].includes(currentUser?.role)) ||
      (page === 'create-listing' && currentUser?.role === 'lister') ||
      (page === 'admin' && currentUser?.role === 'admin');

    if (!canAccess) {
      setActivePage(currentUser ? roleLandingPage : 'login');
      setNavigationData(currentUser ? roleLandingData : { mode: 'login' });
      return;
    }

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

  const renderedPage =
    currentUser?.role === 'admin' && ['home', 'search', 'property-detail'].includes(activePage)
      ? 'admin'
      : currentUser?.role === 'lister' && ['home', 'search', 'property-detail'].includes(activePage)
        ? 'dashboard'
        : activePage;
  const renderedNavigationData =
    renderedPage === 'dashboard' && currentUser?.role === 'lister'
      ? { tab: 'listings' }
      : navigationData;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      {renderedPage !== 'login' && (
        <Navbar
          user={currentUser}
          activePage={renderedPage}
          onNavigate={handleNavigate}
          onLogin={() => handleNavigate('login')}
          onSignup={() => handleNavigate('login', { mode: 'signup' })}
          onLogout={handleLogout}
          onSearchClick={() => handleNavigate('search')}
          onOpenMessages={() => setGlobalMessagingOpen(true)}
          unreadNotifications={2}
          savedCount={3}
        />
      )}

      <main className="flex-1">
        {renderedPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProperty={(id, property) => handleNavigate('property-detail', { id, property })}
            onSearch={(searchParams) => handleNavigate('search', searchParams)}
          />
        )}

        {renderedPage === 'dashboard' && (
          <DashboardPage
            user={currentUser || { name: 'Guest User', role: 'guest' }}
            initialTab={renderedNavigationData?.tab || 'viewings'}
            onNavigate={handleNavigate}
          />
        )}

        {renderedPage === 'login' && (
          <LoginPage
            initialMode={renderedNavigationData?.mode || 'login'}
            onNavigate={handleNavigate}
          />
        )}

        {renderedPage === 'search' && (
          <SearchPage
            initialFilters={renderedNavigationData || {}}
            onNavigate={handleNavigate}
            onSelectProperty={(id, property) => handleNavigate('property-detail', { id, property })}
          />
        )}

        {renderedPage === 'property-detail' && (
          <PropertyDetailPage
            property={navigationData?.property}
            openBooking={navigationData?.openBooking}
            onNavigate={handleNavigate}
          />
        )}

        {renderedPage === 'create-listing' && <CreateListingPage onNavigate={handleNavigate} />}

        {renderedPage === 'admin' && <AdminPage onNavigate={handleNavigate} />}

        {!['home', 'dashboard', 'login', 'search', 'property-detail', 'create-listing', 'admin'].includes(renderedPage) && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                Routing Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
                {renderedPage.replace('-', ' ')} Page
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                Navigated to <code>{renderedPage}</code>. Next step: implement this page component.
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

      <MessagingDrawer
        isOpen={globalMessagingOpen}
        onClose={() => setGlobalMessagingOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <StayFinderApp />
      </AuthProvider>
    </CurrencyProvider>
  );
}
