import React, { createContext, useContext, useState } from 'react';
import { getStoredUser, loginUser, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(getStoredUser);

	const login = async (credentials) => {
		const authenticatedUser = await loginUser(credentials);
		setUser(authenticatedUser);
		return authenticatedUser;
	};

	const logout = () => {
		logoutUser();
		setUser(null);
	};

	return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used inside an AuthProvider.');
	}

	return context;
}
