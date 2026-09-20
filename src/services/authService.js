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

  const role = normalizeRoleName(explicitRole);
  if (role === 'seeker' || role === 'lister' || role === 'admin') return role;

  if (normalizedEmail.includes('admin') || normalizedEmail.includes('ops')) return 'admin';
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

  const resolvedRole = resolveRoleFromEmail(normalizedEmail, role);
  const safeRole = resolvedRole === 'landlord' || resolvedRole === 'agent' ? 'lister' : resolvedRole;
  let matchedUser = PRESET_USERS[safeRole];

  if (!normalizedEmail.includes('amaka') && !normalizedEmail.includes('tunde') && !normalizedEmail.includes('okafor') && !normalizedEmail.includes('dele') && !normalizedEmail.includes('admin') && !normalizedEmail.includes('ops')) {
    const namePart = normalizedEmail.split('@')[0].replace(/[._-]/g, ' ');
    matchedUser = {
      ...(safeRole === 'admin' ? PRESET_USERS.admin : safeRole === 'lister' ? PRESET_USERS.lister : PRESET_USERS.seeker),
      id: `user-${Date.now()}`,
      name: namePart.split(' ').map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(' '),
      email: normalizedEmail,
      phone: '+234 800 000 0000',
      role: safeRole,
      personaType: safeRole === 'admin' ? 'admin' : safeRole === 'lister' ? 'property_lister' : 'property_seeker',
      headline:
        safeRole === 'admin'
          ? 'Admin Console Access'
          : safeRole === 'lister'
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
  window.localStorage.removeItem(STORAGE_KEY);
  return null;
}

export function logoutUser() {
  window.localStorage.removeItem(STORAGE_KEY);
}
