import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigate = () => {}, initialMode = 'login', returnTo = null }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seeker'); // 'seeker' | 'lister' | 'admin'
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const authenticatedUser = await login({
        email,
        password,
        role: mode === 'signup' ? role : null,
      });

      if (authenticatedUser.role === 'admin') {
        onNavigate('admin');
      } else if (authenticatedUser.role === 'lister') {
        onNavigate('dashboard', { tab: 'listings' });
      } else {
        onNavigate(returnTo?.page || 'home', {
          ...(returnTo?.data || {}),
          replaceHistory: true,
        });
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-10 flex items-center justify-center">
      <div className="grid w-full max-w-5xl min-h-[560px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)] lg:grid-cols-2">
        {/* Left Brand Panel */}
        <section className="hidden bg-gray-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-500 text-gray-900 flex items-center justify-center font-black">
                S
              </span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
                StayFinder
              </span>
            </div>
            <h1 className="mt-8 text-2xl sm:text-3xl font-black leading-tight">
              Welcome back to verified living.
            </h1>
            <p className="mt-4 max-w-sm text-[11px] leading-5 text-gray-300">
              Manage your viewings, applications, and property listings from one trusted marketplace.
            </p>
          </div>
          <p className="text-[10px] font-semibold text-gray-400">
            Verified homes. Transparent transactions.
          </p>
        </section>

        {/* Right Form Panel */}
        <section className="p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Normal Auth Form */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Member access</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950">
                  {mode === 'signup' ? 'Create your account' : 'Sign in to StayFinder'}
                </h2>
                <p className="mt-1 text-[11px] text-gray-500">Use your account details to continue.</p>
              </div>
              <span className="mt-1 hidden h-2 w-2 rounded-full bg-emerald-500 sm:block" />
            </div>
            {mode === 'signup' && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">Select Primary Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'seeker', label: 'Property Seeker' },
                    { id: 'lister', label: 'Property Lister' },
                    { id: 'admin', label: 'Admin' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        role === r.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@stayfinder.ng"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-black text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : mode === 'signup' ? 'Create Free Account' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            {mode === 'signup' ? 'Already have an account? ' : 'New to StayFinder? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="font-bold text-emerald-700 hover:underline"
            >
              {mode === 'signup' ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
