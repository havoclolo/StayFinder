import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [navigationData, setNavigationData] = useState(null);

  // Demo user state that can be toggled for testing both guest and authenticated views
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@stayfinder.com',
    role: 'host', // 'guest' | 'host' | 'admin'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
  });

  const handleNavigate = (page, data = null) => {
    console.log(`Navigating to: ${page}`, data);
    setActivePage(page);
    setNavigationData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setCurrentUser({
      name: 'Alex Johnson',
      email: 'alex.johnson@stayfinder.com',
      role: 'host',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Navbar
        user={currentUser}
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogin={handleLogin}
        onSignup={handleLogin}
        onLogout={handleLogout}
        onSearchClick={() => handleNavigate('search')}
        unreadNotifications={3}
        savedCount={5}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProperty={(id, property) => handleNavigate('property-detail', { id, property })}
            onSearch={(searchParams) => handleNavigate('search', searchParams)}
          />
        )}

        {activePage !== 'home' && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm">
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
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
                  onClick={() => handleNavigate('home')}
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-xl font-semibold text-xs hover:bg-rose-700 transition"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
