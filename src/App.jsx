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
    if (!window.history.state?.stayFinderPage) {
      window.history.replaceState(
        { stayFinderPage: activePage, navigationData },
        '',
        window.location.href,
      );
    }

    const handleBrowserBack = (event) => {
      const nextPage = event.state?.stayFinderPage || 'home';
      const nextData = event.state?.navigationData || null;
      const needsAuthentication = ['search', 'property-detail'].includes(nextPage);

      if (needsAuthentication && !currentUser) {
        setActivePage('login');
        setNavigationData({ mode: 'login' });
        return;
      }

      setActivePage(nextPage);
      setNavigationData(nextData);
    };

    window.addEventListener('popstate', handleBrowserBack);
    return () => window.removeEventListener('popstate', handleBrowserBack);
  }, [activePage, currentUser, navigationData]);

  const handleNavigate = (page, data = null) => {
    const roleLandingPage = currentUser?.role === 'admin' ? 'admin' : 'dashboard';
    const roleLandingData = currentUser?.role === 'lister' ? { tab: 'listings' } : null;
    const canBrowseMarketplace = currentUser?.role === 'seeker';
    const canAccess =
      (page === 'home' && (!currentUser || ['seeker', 'lister', 'admin'].includes(currentUser.role))) ||
      ((page === 'search' || page === 'property-detail') && canBrowseMarketplace) ||
      page === 'login' ||
      (page === 'dashboard' && ['seeker', 'lister'].includes(currentUser?.role)) ||
      (page === 'create-listing' && currentUser?.role === 'lister') ||
      (page === 'admin' && currentUser?.role === 'admin');

    if (!canAccess) {
      setActivePage(currentUser ? roleLandingPage : 'login');
      setNavigationData(currentUser ? roleLandingData : { mode: 'login' });
      return;
    }

    const replaceHistory = Boolean(data?.replaceHistory);
    const nextData = data?.replaceHistory ? { ...data, replaceHistory: undefined } : data;
    const historyState = {
      stayFinderPage: page,
      navigationData: nextData,
    };
    window.history[replaceHistory ? 'replaceState' : 'pushState'](
      historyState,
      '',
      window.location.href,
    );
    setActivePage(page);
    setNavigationData(nextData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    window.history.pushState(
      { stayFinderPage: 'home', navigationData: null },
      '',
      window.location.href,
    );
    setActivePage('home');
    setNavigationData(null);
  };

  const renderedPage = activePage;
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
          onOpenMessages={() => {
            if (currentUser) setGlobalMessagingOpen(true);
            else handleNavigate('login', { mode: 'login' });
          }}
          unreadNotifications={2}
          savedCount={3}
        />
      )}

      <main className="flex-1">
        {renderedPage === 'home' && (
          <HomePage
            isAuthenticated={Boolean(currentUser)}
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
            returnTo={renderedNavigationData?.returnTo}
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
            isAuthenticated={Boolean(currentUser)}
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
