/**
 * Auth Service (100% Client-Side LocalStorage Backend)
 * Manages authenticated user sessions without external server dependencies.
 */
import { PRESET_USERS, marketplaceStore } from './marketplaceStore';

const STORAGE_KEY = 'stayfinder_user';

function normalizeRoleName(role) {
  if (!role) return 'seeker';
  const normalized = role.toLowerCase();
  if (normalized === 'landlord' || normalized === 'agent') return 'lister';
  if (normalized === 'seller' || normalized === 'lister') return 'lister';
  if (normalized === 'admin' || normalized === 'ops') return 'admin';
  return normalized;
}

function resolveRoleFromEmail(email, explicitRole = null) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const knownRoles = {
    'amaka.nwosu@stayfinder.ng': 'seeker',
    'tunde.b@stayfinder.ng': 'seeker',
    'folake.okafor@stayfinder.ng': 'lister',
    'dele.alabi@stayfinder.ng': 'lister',
    'ops@stayfinder.ng': 'admin',
  };

  if (knownRoles[normalizedEmail]) return knownRoles[normalizedEmail];

  if (explicitRole) {
    const role = normalizeRoleName(explicitRole);
    if (role === 'seeker' || role === 'lister') return role;
  }

  if (
    normalizedEmail.includes('okafor') ||
    normalizedEmail.includes('dele') ||
    normalizedEmail.includes('landlord') ||
    normalizedEmail.includes('agent') ||
    normalizedEmail.includes('seller') ||
    normalizedEmail.includes('lister')
  ) {
    return 'lister';
  }

  return 'seeker';
}

export async function loginUser({ email, password, role = null }) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error('Enter your email and password to continue.');
  }

  if (password.length < 6) {
    throw new Error('Your password must contain at least 6 characters.');
  }

  if (role) {
    const normalizedRole = normalizeRoleName(role);
    if (normalizedRole === 'admin') {
      throw new Error('Signing up as an administrator is not permitted.');
    }
  }

  const resolvedRole = resolveRoleFromEmail(normalizedEmail, role);
  const safeRole = resolvedRole === 'landlord' || resolvedRole === 'agent' ? 'lister' : resolvedRole;
  let matchedUser = PRESET_USERS[safeRole];

  const presetEmails = [
    'amaka.nwosu@stayfinder.ng',
    'tunde.b@stayfinder.ng',
    'folake.okafor@stayfinder.ng',
    'dele.alabi@stayfinder.ng',
    'ops@stayfinder.ng',
  ];

  if (!presetEmails.includes(normalizedEmail)) {
    const namePart = normalizedEmail.split('@')[0].replace(/[._-]/g, ' ');
    const accountRole = safeRole === 'lister' ? 'lister' : 'seeker';
    matchedUser = {
      ...(accountRole === 'lister' ? PRESET_USERS.lister : PRESET_USERS.seeker),
      id: `user-${Date.now()}`,
      name: namePart.split(' ').map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(' '),
      email: normalizedEmail,
      phone: '+234 800 000 0000',
      role: accountRole,
      personaType: accountRole === 'lister' ? 'property_lister' : 'property_seeker',
      headline:
        accountRole === 'lister'
          ? 'Property Lister (Custom Account)'
          : 'Property Seeker (Custom Account)',
      verifiedKYC: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    };
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matchedUser));
  marketplaceStore.setCurrentUser(matchedUser);
  return matchedUser;
}

export function getStoredUser() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors in non-browser environments
  }
  return null;
}

export function logoutUser() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors in non-browser environments
  }
  marketplaceStore.setCurrentUser(null);
}
