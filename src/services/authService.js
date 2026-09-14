const STORAGE_KEY = 'stayfinder_user';

const demoUser = {
	name: 'Agent Dele Alabi',
	email: 'dele.alabi@stayfinder.ng',
	role: 'host',
	agencyName: 'Premier Heritage Partners',
	licenseNumber: 'LAG-REA-2024-88',
	verifiedKYC: true,
	avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
};

export async function loginUser({ email, password }) {
	const normalizedEmail = email.trim().toLowerCase();

	if (!normalizedEmail || !password) {
		throw new Error('Enter your email and password to continue.');
	}

	if (password.length < 6) {
		throw new Error('Your password must contain at least 6 characters.');
	}

	const user = { ...demoUser, email: normalizedEmail };
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
	return user;
}

export function getStoredUser() {
	try {
		const storedUser = window.localStorage.getItem(STORAGE_KEY);
		return storedUser ? JSON.parse(storedUser) : null;
	} catch {
		return null;
	}
}

export function logoutUser() {
	window.localStorage.removeItem(STORAGE_KEY);
}
