import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigate = () => {}, initialMode = 'login' }) {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		setIsSubmitting(true);

		try {
			await login({ email, password });
			onNavigate('home');
		} catch (submitError) {
			setError(submitError.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:grid-cols-2">
				<section className="hidden bg-gray-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
					<div>
						<span className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">StayFinder</span>
						<h1 className="mt-8 text-4xl font-black leading-tight">Welcome back to verified living.</h1>
						<p className="mt-4 max-w-sm text-sm leading-6 text-gray-300">
							Manage your viewings, applications, and property listings from one trusted marketplace.
						</p>
					</div>
					<p className="text-xs font-semibold text-gray-400">Verified homes. Transparent transactions.</p>
				</section>

				<section className="p-6 sm:p-10">
					<button
						type="button"
						onClick={() => onNavigate('home')}
						className="text-xs font-bold text-gray-500 transition hover:text-gray-900"
					>
						&larr; Back to home
					</button>

					<div className="mt-10">
						<p className="text-xs font-black uppercase tracking-widest text-emerald-700">{initialMode === 'signup' ? 'Create account' : 'Member access'}</p>
						<h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Sign in to StayFinder</h2>
						<p className="mt-2 text-sm text-gray-500">Use your account details to continue.</p>
					</div>

					<form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
						<div>
							<label htmlFor="email" className="mb-2 block text-xs font-bold text-gray-700">Email address</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="you@example.com"
								className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
							/>
						</div>

						<div>
							<div className="mb-2 flex items-center justify-between">
								<label htmlFor="password" className="text-xs font-bold text-gray-700">Password</label>
								<button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">Forgot password?</button>
							</div>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								minLength="6"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="At least 6 characters"
								className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
							/>
						</div>

						{error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{error}</p>}

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isSubmitting ? 'Signing in...' : 'Sign in'}
						</button>
					</form>

					<p className="mt-8 text-center text-xs text-gray-500">
						New to StayFinder? <button type="button" onClick={() => onNavigate('login', { mode: 'signup' })} className="font-bold text-emerald-700 hover:text-emerald-900">Create an account</button>
					</p>
				</section>
			</div>
		</main>
	);
}
