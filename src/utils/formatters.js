/**
 * StayFinder Formatters & Utility Helpers
 * Formats pricing for Rent (monthly/annual) vs. Buy, dates, areas, and badges.
 */

export function formatPrice(amount, listingType = 'rent', tenure = 'month', currency = 'USD') {
  if (amount == null) return 'Price on Request';

  const symbol = currency === 'NGN' ? '₦' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  const formattedNumber = new Intl.NumberFormat('en-US').format(amount);

  if (listingType === 'buy') {
    return `${symbol}${formattedNumber}`;
  }

  // For rent: e.g. $2,500/mo or ₦4,500,000/yr
  const period = tenure === 'year' || tenure === 'yr' ? 'yr' : 'mo';
  return `${symbol}${formattedNumber}/${period}`;
}

export function formatArea(sqm, unit = 'sqm') {
  if (!sqm) return null;
  return `${new Intl.NumberFormat('en-US').format(sqm)} ${unit}`;
}

export function formatViewingDate(dateString, timeSlot) {
  if (!dateString) return 'Flexible viewing';
  const date = new Date(dateString);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return timeSlot ? `${formattedDate} @ ${timeSlot}` : formattedDate;
}

export function getVerificationColor(level) {
  switch (level) {
    case 'physical_inspected':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badge: 'Physical Inspection Verified',
        icon: 'ShieldCheck',
      };
    case 'title_verified':
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        badge: 'Title & Ownership Verified',
        icon: 'DocumentCheck',
      };
    default:
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        badge: 'Verified Agent / Landlord',
        icon: 'BadgeCheck',
      };
  }
}
