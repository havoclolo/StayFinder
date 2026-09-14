import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function StayFinderApp() {
  const { user: currentUser, logout } = useAuth();
  const [activePage, setActivePage] = useState(currentUser ? 'home' : 'login');
  const [navigationData, setNavigationData] = useState(null);

  const handleNavigate = (page, data = null) => {
    console.log(`Navigating to: ${page}`, data);
    window.history.pushState({ stayfinderPage: page }, '', window.location.href);
    setActivePage(page);
    setNavigationData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    window.history.replaceState({ stayfinderPage: 'login' }, '', window.location.href);
    setActivePage('login');
    setNavigationData(null);
  };

  useEffect(() => {
    window.history.replaceState(
      { stayfinderPage: currentUser ? 'home' : 'login' },
      '',
      window.location.href,
    );

    const handleBrowserBack = (event) => {
      if (event.state?.stayfinderPage === 'login' || !event.state?.stayfinderPage) {
        logout();
        setActivePage('login');
        setNavigationData(null);
        return;
      }

      setActivePage(event.state.stayfinderPage);
    };

    window.addEventListener('popstate', handleBrowserBack);
    return () => window.removeEventListener('popstate', handleBrowserBack);
  }, [currentUser, logout]);

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

        {activePage !== 'home' && activePage !== 'dashboard' && activePage !== 'login' && (
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
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-xs hover:bg-emerald-700 transition"
                >
                  Back to Login
                </button>
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
