/**
 * StayFinder Marketplace Store & Service Layer
 * Fully aligned with Emmanuel Eseyin's PRD (v1.0):
 * - Personas: Amaka & Tunde (Seekers), Mrs. Okafor & Agent Dele (Listers), Admin/Ops
 * - Data Models: Listings, ViewingSlots, Applications, Leases, Offers, DueDiligence, Messages, Reviews, FraudReports
 * - LocalStorage-backed reactive state for full end-to-end user flows
 */

import { MOCK_PROPERTIES } from '../utils/constants';

const STORAGE_KEYS = {
  LISTINGS: 'stayfinder_listings_v2_nigeria_170',
  VIEWINGS: 'stayfinder_viewings_v1',
  APPLICATIONS: 'stayfinder_applications_v1',
  LEASES: 'stayfinder_leases_v1',
  OFFERS: 'stayfinder_offers_v1',
  DUE_DILIGENCE: 'stayfinder_due_diligence_v1',
  MESSAGES: 'stayfinder_messages_v1',
  REVIEWS: 'stayfinder_reviews_v1',
  FRAUD_REPORTS: 'stayfinder_fraud_reports_v1',
  ACTIVE_USER: 'stayfinder_user',
};

// Simplified personas: seeker, lister, admin
export const PRESET_USERS = {
  seeker: {
    id: 'user-seeker',
    name: 'Amaka Nwosu',
    email: 'amaka.nwosu@stayfinder.ng',
    phone: '+234 802 345 6789',
    role: 'seeker',
    personaType: 'property_seeker',
    headline: 'Property Seeker (Renter & Buyer)',
    verifiedKYC: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Lagos, Nigeria',
  },
  lister: {
    id: 'user-lister',
    name: 'Mrs. Folake Okafor',
    email: 'folake.okafor@stayfinder.ng',
    phone: '+234 803 445 6677',
    role: 'lister',
    personaType: 'property_lister',
    headline: 'Property Lister (Landlord + Agent)',
    agencyName: 'Okafor Family Holdings',
    licenseNumber: 'LAG-REA-2024-88',
    verifiedKYC: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Ikoyi, Lagos',
  },
  admin: {
    id: 'user-admin',
    name: 'StayFinder Trust & Ops Admin',
    email: 'ops@stayfinder.ng',
    phone: '+234 800 STAYFINDER',
    role: 'admin',
    personaType: 'admin',
    headline: 'Trust, Safety & Moderation Operations',
    agencyName: 'StayFinder HQ Ops',
    licenseNumber: 'OPS-LEAD-2026',
    verifiedKYC: true,
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=120&h=120&q=80',
    location: 'Lagos & Abuja',
  },
};

// Seed Listings (extended with PRD fields like exactAddress, titleStatus, verificationDoc, approxPin)
const INITIAL_LISTINGS = MOCK_PROPERTIES.map((p) => ({
  ...p,
  status: p.status || 'live', // 'draft' | 'pending_verification' | 'live' | 'under_offer' | 'closed'
  exactAddress: `${p.title.split(' ')[0]} Residence, Plot 14B Admiralty Way, ${p.location}`,
  approximateLocation: `${p.neighborhood || 'Central Area'}, ${p.location}`,
  titleStatus: p.titleStatus || (p.listingType === 'buy' ? 'Governor’s Consent & Registered Deed' : 'Verified Landlord Ownership'),
  ownershipDocument: 'https://example.com/docs/c-of-o-registered.pdf',
  verificationTier: p.verificationTier || 'title_verified',
  cautionDeposit: p.listingType === 'rent' ? Math.round(p.price * 0.15) : 0,
  availableSlots: [
    { id: 'slot-1', date: 'Tomorrow', time: '10:00 AM', isBooked: false },
    { id: 'slot-2', date: 'Tomorrow', time: '02:00 PM', isBooked: false },
    { id: 'slot-3', date: 'Saturday', time: '11:00 AM', isBooked: false },
    { id: 'slot-4', date: 'Saturday', time: '03:30 PM', isBooked: false },
  ],
}));

// Seed Viewing Requests
const INITIAL_VIEWINGS = [
  {
    id: 'view-301',
    listingId: 'sf-201',
    listingTitle: 'Contemporary 3-Bedroom Serviced Waterfront Apartment',
    listingLocation: 'Lekki Phase 1, Lagos',
    exactAddress: 'Block 4, Admiralty Waterfront Court, Admiralty Way, Lekki Phase 1',
    price: '$3,200/mo',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    seekerId: 'user-amaka',
    seekerName: 'Amaka Nwosu',
    seekerPhone: '+234 802 345 6789',
    seekerEmail: 'amaka.nwosu@stayfinder.ng',
    listerName: 'Agent Dele Alabi',
    listerRole: 'agent',
    viewingMode: 'in_person',
    date: 'Tomorrow',
    time: '02:00 PM',
    status: 'confirmed', // 'requested' | 'confirmed' | 'completed' | 'cancelled'
    notes: 'Relocating closer to Admiralty Way for work. Move-in target is Nov 1st.',
    isAddressUnlocked: true,
  },
  {
    id: 'view-302',
    listingId: 'sf-202',
    listingTitle: 'Modern 5-Bedroom Fully Detached Smart Duplex with Pool',
    listingLocation: 'Old Ikoyi, Lagos',
    exactAddress: 'No 7 Bourdillon Crescent, Old Ikoyi, Lagos',
    price: '$850,000',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
    seekerId: 'user-tunde',
    seekerName: 'Tunde Balogun',
    seekerPhone: '+234 809 112 2334',
    seekerEmail: 'tunde.b@stayfinder.ng',
    listerName: 'Mrs. Folake Okafor',
    listerRole: 'landlord',
    viewingMode: 'in_person',
    date: 'Saturday',
    time: '10:00 AM',
    status: 'confirmed',
    notes: 'Buyer with verified proof of funds. Would like structural engineer to attend.',
    isAddressUnlocked: true,
  },
  {
    id: 'view-303',
    listingId: 'sf-204',
    listingTitle: 'Luxury 2-Bedroom High-Rise Penthouse with Panoramic Views',
    listingLocation: 'Victoria Island, Lagos',
    exactAddress: 'Penthouse B, Eko Pearl Towers, Victoria Island',
    price: '$2,600/mo',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
    seekerId: 'user-amaka',
    seekerName: 'Amaka Nwosu',
    seekerPhone: '+234 802 345 6789',
    seekerEmail: 'amaka.nwosu@stayfinder.ng',
    listerName: 'Agent Dele Alabi',
    listerRole: 'agent',
    viewingMode: 'virtual_video',
    date: 'Friday',
    time: '10:00 AM',
    status: 'requested',
    notes: 'Requesting WhatsApp/Zoom video walkthrough of master bedroom and balcony.',
    isAddressUnlocked: false,
  },
];

// Seed Rental Applications (PRD Section 5.5)
const INITIAL_APPLICATIONS = [
  {
    id: 'app-501',
    listingId: 'sf-201',
    listingTitle: 'Contemporary 3-Bedroom Serviced Waterfront Apartment',
    listingLocation: 'Lekki Phase 1, Lagos',
    monthlyRent: 3200,
    cautionDeposit: 480,
    seekerId: 'user-amaka',
    applicantName: 'Amaka Nwosu',
    applicantEmail: 'amaka.nwosu@stayfinder.ng',
    applicantPhone: '+234 802 345 6789',
    employer: 'Paystack / Stripe West Africa',
    jobTitle: 'Lead Product Designer',
    annualIncome: '₦45,000,000 / ~$45,000',
    guarantorName: 'Chief O. Nwosu',
    guarantorPhone: '+234 803 111 2222',
    moveInDate: '2026-10-15',
    occupants: 1,
    idDocumentName: 'National_ID_Amaka_Nwosu.pdf',
    workProofDocumentName: 'Employment_Verification_Paystack.pdf',
    status: 'approved', // 'submitted' | 'under_review' | 'approved' | 'rejected'
    submittedAt: '2 days ago',
    reviewedAt: 'Yesterday',
    hasLease: true,
  },
];

// Seed Digital Leases (PRD Section 5.5)
const INITIAL_LEASES = [
  {
    id: 'lease-701',
    applicationId: 'app-501',
    listingId: 'sf-201',
    listingTitle: 'Contemporary 3-Bedroom Serviced Waterfront Apartment',
    listingLocation: 'Lekki Phase 1, Lagos',
    landlordName: 'Agent Dele Alabi (Premier Heritage)',
    tenantName: 'Amaka Nwosu',
    tenantEmail: 'amaka.nwosu@stayfinder.ng',
    rentAmount: 3200,
    cautionDeposit: 480,
    serviceCharge: 350,
    totalDueAtSigning: 4030,
    leaseTerm: '12 Months (Renewable)',
    startDate: '2026-10-15',
    endDate: '2027-10-14',
    terms: [
      'The tenant agrees to use the premises strictly for residential purposes.',
      'The landlord guarantees 24/7 serviced power and estate security.',
      'No subletting without prior written consent from the landlord/authorized broker.',
      'Caution deposit refundable within 14 days of lease expiration post-inspection.',
    ],
    landlordSigned: true,
    landlordSignedAt: '2026-09-14T14:30:00Z',
    tenantSigned: false,
    tenantSignatureText: '',
    signedAt: null,
    depositPaid: false,
    firstRentPaid: false,
    paymentMethod: null,
    status: 'pending_tenant_signature', // 'pending_tenant_signature' | 'active' | 'completed'
  },
];

// Seed Purchase Offers (PRD Section 5.6 - Buy Path for Tunde)
const INITIAL_OFFERS = [
  {
    id: 'offer-801',
    listingId: 'sf-202',
    listingTitle: 'Modern 5-Bedroom Fully Detached Smart Duplex with Pool',
    listingLocation: 'Old Ikoyi, Lagos',
    askingPrice: 850000,
    buyerId: 'user-tunde',
    buyerName: 'Tunde Balogun',
    buyerEmail: 'tunde.b@stayfinder.ng',
    buyerPhone: '+234 809 112 2334',
    offerAmount: 830000,
    earnestDepositPercent: 10,
    earnestDepositAmount: 83000,
    financingType: 'Cash / Wire Transfer (Proof of Funds provided)',
    closingTimelineDays: 30,
    conditions: [
      'Subject to clean Governor’s Consent and physical boundary search at Lagos Land Registry (Alausa).',
      'Structural and MEP inspection by registered COREN engineer without critical defects.',
      'Vacant possession guaranteed at completion.',
    ],
    status: 'accepted', // 'pending' | 'countered' | 'accepted' | 'rejected'
    submittedAt: '3 days ago',
    counterHistory: [
      { sender: 'buyer', amount: 810000, note: 'Initial formal offer with immediate 10% escrow readiness.', time: '3 days ago' },
      { sender: 'seller', amount: 835000, note: 'Seller countered, willing to close quickly if inspection is done within 10 days.', time: '2 days ago' },
      { sender: 'buyer', amount: 830000, note: 'Buyer agreed to ₦830,000 with 30-day closing condition.', time: 'Yesterday' },
      { sender: 'seller', amount: 830000, note: 'Seller accepted offer. Deal Room unlocked.', time: 'Yesterday' },
    ],
  },
];

// Seed Due Diligence Stages (PRD Section 5.6 - 5 Deal Milestones)
const INITIAL_DUE_DILIGENCE = [
  {
    id: 'dd-901',
    offerId: 'offer-801',
    listingId: 'sf-202',
    propertyTitle: 'Modern 5-Bedroom Fully Detached Smart Duplex with Pool',
    buyerName: 'Tunde Balogun',
    sellerName: 'Mrs. Folake Okafor',
    stages: [
      {
        stageKey: 'offer_accepted',
        title: 'Offer Accepted & Earnest Escrow',
        description: 'Letter of Intent executed and 10% earnest deposit confirmed in regulated stakeholder account.',
        status: 'completed', // 'pending' | 'in_progress' | 'completed'
        completedAt: 'Yesterday',
        assignedTo: 'Buyer & Seller',
      },
      {
        stageKey: 'physical_inspection',
        title: 'Physical & Structural Engineering Inspection',
        description: 'Independent inspection of foundation, electrical load, pool hydraulics, and damp-proofing.',
        status: 'in_progress',
        completedAt: null,
        assignedTo: 'COREN Certified Inspector',
        documentUrl: 'https://example.com/reports/structural-inspection-ikoyi.pdf',
      },
      {
        stageKey: 'title_verification',
        title: 'Land Registry Search & Title Verification',
        description: 'Verification of Governor’s Consent, Survey Beacon check, and non-encumbrance status at Alausa Land Registry.',
        status: 'pending',
        completedAt: null,
        assignedTo: 'Conveyancing Solicitor',
      },
      {
        stageKey: 'financing_confirmation',
        title: 'Financing & Proof of Settlement Funds',
        description: 'Bank escrow confirmation or mortgage underwriting final sign-off.',
        status: 'pending',
        completedAt: null,
        assignedTo: 'Buyer Financial Institution',
      },
      {
        stageKey: 'closing',
        title: 'Closing, Deed of Assignment & Keys Handover',
        description: 'Execution of Deed of Assignment, payment of stamp duty, and physical handover of property keys.',
        status: 'pending',
        completedAt: null,
        assignedTo: 'Solicitors & Parties',
      },
    ],
    documents: [
      { id: 'doc-1', name: 'Letter_of_Intent_Signed.pdf', type: 'contract', uploadedBy: 'Solicitor', date: 'Yesterday', size: '1.2 MB' },
      { id: 'doc-2', name: 'Land_Title_Governors_Consent_Extract.pdf', type: 'legal', uploadedBy: 'Seller', date: 'Yesterday', size: '4.8 MB' },
      { id: 'doc-3', name: 'Registered_Survey_Plan_Lagos.pdf', type: 'survey', uploadedBy: 'Seller', date: 'Yesterday', size: '3.1 MB' },
    ],
  },
];

// Seed Messages (PRD Section 5.7)
const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    threadId: 'thread-sf-201',
    listingId: 'sf-201',
    listingTitle: 'Contemporary 3-Bedroom Serviced Waterfront Apartment',
    participants: ['user-amaka', 'user-dele'],
    senderId: 'user-dele',
    senderName: 'Agent Dele Alabi',
    body: 'Hello Amaka! Your viewing appointment for tomorrow at 2:00 PM is confirmed. The exact gate access code is Plot 14B Admiralty Way. See you tomorrow!',
    timestamp: 'Yesterday at 3:15 PM',
    isSystem: false,
  },
  {
    id: 'msg-2',
    threadId: 'thread-sf-201',
    listingId: 'sf-201',
    listingTitle: 'Contemporary 3-Bedroom Serviced Waterfront Apartment',
    participants: ['user-amaka', 'user-dele'],
    senderId: 'user-amaka',
    senderName: 'Amaka Nwosu',
    body: 'Thank you Agent Dele! Looking forward to it. I have also submitted my rental credentials in advance.',
    timestamp: 'Yesterday at 3:45 PM',
    isSystem: false,
  },
  {
    id: 'msg-3',
    threadId: 'thread-sf-201',
    listingId: 'sf-201',
    listingTitle: 'Contemporary 3-Bedroom Serviced Waterfront Apartment',
    participants: ['user-amaka', 'user-dele'],
    senderId: 'system',
    senderName: 'StayFinder System',
    body: '🎉 Rental Application Approved! Digital Lease Agreement dispatched for review.',
    timestamp: 'Today at 09:15 AM',
    isSystem: true,
  },
  {
    id: 'msg-4',
    threadId: 'thread-sf-202',
    listingId: 'sf-202',
    listingTitle: 'Modern 5-Bedroom Fully Detached Smart Duplex with Pool',
    participants: ['user-tunde', 'user-okafor'],
    senderId: 'user-tunde',
    senderName: 'Tunde Balogun',
    body: 'Good day Mrs. Okafor. Our surveyor has commenced the Alausa search and the COREN engineer will visit Friday.',
    timestamp: 'Today at 10:20 AM',
    isSystem: false,
  },
];

// Seed Reviews (PRD Section 5.8)
const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    targetId: 'user-dele',
    targetType: 'agent',
    targetName: 'Agent Dele Alabi',
    authorName: 'Dr. Fatima Al-Hassan',
    rating: 5,
    tag: 'Accurate Photos & $0 Viewing Fee',
    comment: 'Zero scam fees! Dele was on time, transparent with service charge breakdown, and the apartment matched the photos 100%.',
    date: '3 days ago',
  },
  {
    id: 'rev-2',
    targetId: 'user-okafor',
    targetType: 'landlord',
    targetName: 'Mrs. Folake Okafor',
    authorName: 'Engr. Babatunde',
    rating: 5,
    tag: 'Clean Title & Professional Landlord',
    comment: 'All title documents were ready on demand. No surprise agency inflation.',
    date: '1 week ago',
  },
];

// Seed Fraud Reports (PRD Section 5.8 & 5.11)
const INITIAL_FRAUD_REPORTS = [
  {
    id: 'fraud-101',
    listingId: 'sf-203',
    listingTitle: 'Brand New 4-Bedroom Semi-Detached House with BQ',
    reportedBy: 'Seeker Community',
    reason: 'Suspicious Viewing Fee Solicitation',
    detail: 'An unverified third-party claimed to be representing the landlord and demanded ₦15,000 for "gate pass registration".',
    priority: 'Urgent',
    status: 'open', // 'open' | 'investigating' | 'resolved' | 'dismissed'
    date: '2 hours ago',
  },
  {
    id: 'fraud-102',
    listingId: 'ext-999',
    listingTitle: 'Unverified 2-Bedroom in Lekki Phase 1',
    reportedBy: 'Amaka Nwosu',
    reason: 'Duplicate Stolen Photos from Instagram',
    detail: 'Photos belong to an Airbnb in South Africa, claimed to be in Chevron.',
    priority: 'High',
    status: 'investigating',
    date: '1 day ago',
  },
];

// LocalStorage Helper with Safe JSON & Auto-Seeding
function loadFromStorage(key, defaultVal) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    // If key not present in localStorage, seed defaultVal immediately
    if (defaultVal !== undefined) {
      window.localStorage.setItem(key, JSON.stringify(defaultVal));
    }
    return defaultVal;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultVal;
  }
}

function saveToStorage(key, data) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// -------------------------------------------------------------
// MARKETPLACE STORE CLASS
// -------------------------------------------------------------
class MarketplaceStore {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn());
  }

  // --- CURRENT USER & PERSONA SWITCHING ---
  getCurrentUser() {
    const saved = loadFromStorage(STORAGE_KEYS.ACTIVE_USER, null);
    return saved || null;
  }

  setCurrentUser(user) {
    saveToStorage(STORAGE_KEYS.ACTIVE_USER, user);
    this.notify();
  }

  switchPersona(presetKey) {
    const user = PRESET_USERS[presetKey];
    if (user) {
      this.setCurrentUser(user);
    }
  }

  // --- LISTINGS ---
  getListings() {
    return loadFromStorage(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  }

  getListingById(id) {
    const listings = this.getListings();
    return listings.find((l) => l.id === id) || null;
  }

  createListing(listingData) {
    const listings = this.getListings();
    const currentUser = this.getCurrentUser();
    const newListing = {
      ...listingData,
      id: `sf-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'pending_verification', // PRD gate: must be verified before going live
      isVerified: false,
      verificationTier: 'pending',
      verificationBadge: 'Under Ops Document Review',
      viewsCount: 0,
      inquiriesCount: 0,
      lister: {
        id: currentUser.id,
        name: currentUser.name,
        type: currentUser.role === 'lister' ? 'Property Lister' : 'Property Lister',
        verifiedKYC: currentUser.verifiedKYC,
        licenseNumber: currentUser.licenseNumber || null,
        phone: currentUser.phone,
        email: currentUser.email,
        avatar: currentUser.avatar,
      },
    };

    const updated = [newListing, ...listings];
    saveToStorage(STORAGE_KEYS.LISTINGS, updated);
    this.notify();
    return newListing;
  }

  verifyListing(listingId, approved = true, notes = '') {
    const listings = this.getListings();
    const updated = listings.map((item) => {
      if (item.id === listingId) {
        return {
          ...item,
          status: approved ? 'live' : 'rejected',
          isVerified: approved,
          verificationTier: approved ? 'title_verified' : 'unverified',
          verificationBadge: approved ? 'Verified Inspection & Title (Ops Approved)' : 'Rejected',
          verifiedAt: approved ? new Date().toISOString() : null,
          adminNotes: notes,
        };
      }
      return item;
    });
    saveToStorage(STORAGE_KEYS.LISTINGS, updated);
    this.notify();
  }

  // --- VIEWINGS ---
  getViewings() {
    return loadFromStorage(STORAGE_KEYS.VIEWINGS, INITIAL_VIEWINGS);
  }

  createViewingRequest({ listing, date, time, viewingMode = 'in_person', notes = '' }) {
    const viewings = this.getViewings();
    const currentUser = this.getCurrentUser();

    const newViewing = {
      id: `view-${Date.now().toString().slice(-4)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingLocation: listing.location,
      exactAddress: listing.exactAddress || `${listing.location} (Address released upon confirmation)`,
      price: listing.listingType === 'buy' ? `$${listing.price.toLocaleString()}` : `$${listing.price}/mo`,
      image: listing.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
      seekerId: currentUser.id,
      seekerName: currentUser.name,
      seekerPhone: currentUser.phone,
      seekerEmail: currentUser.email,
      listerName: listing.lister?.name || 'Authorized Lister',
      listerRole: listing.lister?.type?.includes('Agent') ? 'agent' : 'landlord',
      viewingMode,
      date,
      time,
      status: 'requested',
      notes,
      isAddressUnlocked: false, // Security: exact address locked until confirmed
      createdAt: new Date().toISOString(),
    };

    const updated = [newViewing, ...viewings];
    saveToStorage(STORAGE_KEYS.VIEWINGS, updated);

    // Also add an automated message to the thread
    this.sendThreadMessage({
      listingId: listing.id,
      listingTitle: listing.title,
      recipientId: listing.lister?.id || 'lister',
      body: `📅 Viewing requested for ${date} at ${time} (${viewingMode === 'virtual_video' ? 'Virtual Walkthrough' : 'In-Person'}). Note: "${notes || 'None'}"`,
      isSystem: true,
    });

    this.notify();
    return newViewing;
  }

  updateViewingStatus(viewingId, status) {
    const viewings = this.getViewings();
    const updated = viewings.map((v) => {
      if (v.id === viewingId) {
        return {
          ...v,
          status,
          isAddressUnlocked: status === 'confirmed', // Exact address unlocks when lister confirms!
        };
      }
      return v;
    });
    saveToStorage(STORAGE_KEYS.VIEWINGS, updated);
    this.notify();
  }

  // --- RENTAL APPLICATIONS ---
  getApplications() {
    return loadFromStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  }

  submitRentalApplication(appData) {
    const apps = this.getApplications();
    const currentUser = this.getCurrentUser();
    const listing = this.getListingById(appData.listingId);

    const newApp = {
      ...appData,
      id: `app-${Date.now().toString().slice(-4)}`,
      seekerId: currentUser.id,
      applicantName: currentUser.name,
      applicantEmail: currentUser.email,
      applicantPhone: currentUser.phone,
      status: 'under_review',
      submittedAt: 'Just now',
      hasLease: false,
      monthlyRent: listing?.price || 0,
      cautionDeposit: listing?.cautionDeposit || Math.round((listing?.price || 0) * 0.15),
    };

    const updated = [newApp, ...apps];
    saveToStorage(STORAGE_KEYS.APPLICATIONS, updated);

    // Notify thread
    this.sendThreadMessage({
      listingId: appData.listingId,
      listingTitle: appData.listingTitle,
      body: `📋 Rental Application submitted by ${currentUser.name}. Employer: ${appData.employer}. Move-in: ${appData.moveInDate}.`,
      isSystem: true,
    });

    this.notify();
    return newApp;
  }

  updateApplicationStatus(appId, status) {
    const apps = this.getApplications();
    let approvedApp = null;

    const updated = apps.map((a) => {
      if (a.id === appId) {
        const item = { ...a, status };
        if (status === 'approved') approvedApp = item;
        return item;
      }
      return a;
    });
    saveToStorage(STORAGE_KEYS.APPLICATIONS, updated);

    // If approved, automatically create a draft Digital Lease Agreement!
    if (approvedApp) {
      this.generateLeaseForApplication(approvedApp);
    }

    this.notify();
  }

  // --- DIGITAL LEASES (PRD Section 5.5) ---
  getLeases() {
    return loadFromStorage(STORAGE_KEYS.LEASES, INITIAL_LEASES);
  }

  generateLeaseForApplication(app) {
    const leases = this.getLeases();
    const existing = leases.find((l) => l.applicationId === app.id);
    if (existing) return existing;

    const newLease = {
      id: `lease-${Date.now().toString().slice(-4)}`,
      applicationId: app.id,
      listingId: app.listingId,
      listingTitle: app.listingTitle,
      listingLocation: app.listingLocation,
      landlordName: 'Authorized Lister',
      tenantName: app.applicantName,
      tenantEmail: app.applicantEmail,
      rentAmount: app.monthlyRent,
      cautionDeposit: app.cautionDeposit,
      serviceCharge: 350,
      totalDueAtSigning: (app.monthlyRent || 0) + (app.cautionDeposit || 0) + 350,
      leaseTerm: '12 Months (Renewable)',
      startDate: app.moveInDate || '2026-11-01',
      endDate: '2027-10-31',
      terms: [
        'The tenant agrees to maintain the residential nature of the dwelling.',
        'Rent is payable annually/monthly as agreed; 24/7 serviced backup power included.',
        'No structural modifications or subletting without prior written approval.',
        'Caution deposit refundable within 14 calendar days upon vacant possession and inventory sign-off.',
      ],
      landlordSigned: true,
      landlordSignedAt: new Date().toISOString(),
      tenantSigned: false,
      tenantSignatureText: '',
      signedAt: null,
      depositPaid: false,
      firstRentPaid: false,
      paymentMethod: null,
      status: 'pending_tenant_signature',
    };

    const updated = [newLease, ...leases];
    saveToStorage(STORAGE_KEYS.LEASES, updated);
    this.notify();
    return newLease;
  }

  signLeaseAndPay(leaseId, signatureText, paymentDetails) {
    const leases = this.getLeases();
    const updated = leases.map((l) => {
      if (l.id === leaseId) {
        return {
          ...l,
          tenantSigned: true,
          tenantSignatureText: signatureText,
          signedAt: new Date().toISOString(),
          depositPaid: true,
          firstRentPaid: true,
          paymentMethod: paymentDetails.method, // 'paystack' | 'flutterwave' | 'off_platform'
          paymentReference: paymentDetails.reference || `REF-${Date.now()}`,
          status: 'active',
        };
      }
      return l;
    });
    saveToStorage(STORAGE_KEYS.LEASES, updated);

    // Notify thread
    this.sendThreadMessage({
      listingId: leases.find((l) => l.id === leaseId)?.listingId,
      body: `✍️ Lease digitally signed by tenant and initial payments (${paymentDetails.method === 'off_platform' ? 'Marked as Paid Off-Platform' : 'Paid via Paystack'}) processed. Tenancy is ACTIVE!`,
      isSystem: true,
    });

    this.notify();
  }

  // --- PURCHASE OFFERS & BUY PATH (PRD Section 5.6) ---
  getOffers() {
    return loadFromStorage(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
  }

  submitPurchaseOffer({ listing, offerAmount, earnestDepositPercent = 10, closingTimelineDays = 30, financingType, conditions = [] }) {
    const offers = this.getOffers();
    const currentUser = this.getCurrentUser();

    const newOffer = {
      id: `offer-${Date.now().toString().slice(-4)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingLocation: listing.location,
      askingPrice: listing.price,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      buyerPhone: currentUser.phone,
      offerAmount,
      earnestDepositPercent,
      earnestDepositAmount: Math.round(offerAmount * (earnestDepositPercent / 100)),
      financingType: financingType || 'Cash / Verified Wire Transfer',
      closingTimelineDays,
      conditions: conditions.length ? conditions : [
        'Subject to clean Title search and survey check at Alausa Land Registry.',
        'Physical and structural inspection by licensed COREN engineer.',
        'Vacant possession and executed Deed of Assignment upon completion.',
      ],
      status: 'pending',
      submittedAt: 'Just now',
      counterHistory: [
        { sender: 'buyer', amount: offerAmount, note: `Initial formal offer of $${offerAmount.toLocaleString()}`, time: 'Just now' },
      ],
    };

    const updated = [newOffer, ...offers];
    saveToStorage(STORAGE_KEYS.OFFERS, updated);

    // Notify thread
    this.sendThreadMessage({
      listingId: listing.id,
      listingTitle: listing.title,
      body: `💼 Purchase Offer of $${offerAmount.toLocaleString()} submitted by ${currentUser.name} (${earnestDepositPercent}% earnest deposit, ${closingTimelineDays}-day closing).`,
      isSystem: true,
    });

    this.notify();
    return newOffer;
  }

  counterOrAcceptOffer(offerId, action, counterAmount = null, note = '') {
    const offers = this.getOffers();
    let acceptedOffer = null;

    const updated = offers.map((o) => {
      if (o.id === offerId) {
        const history = [...(o.counterHistory || [])];
        if (action === 'accept') {
          history.push({ sender: 'seller', amount: o.offerAmount, note: note || 'Offer accepted! Deal Room initialized.', time: 'Just now' });
          const item = { ...o, status: 'accepted', counterHistory: history };
          acceptedOffer = item;
          return item;
        } else if (action === 'counter') {
          history.push({ sender: 'seller', amount: counterAmount, note: note || `Counter offer of $${counterAmount.toLocaleString()}`, time: 'Just now' });
          return { ...o, status: 'countered', offerAmount: counterAmount, counterHistory: history };
        } else if (action === 'reject') {
          history.push({ sender: 'seller', amount: o.offerAmount, note: note || 'Offer declined.', time: 'Just now' });
          return { ...o, status: 'rejected', counterHistory: history };
        }
      }
      return o;
    });

    saveToStorage(STORAGE_KEYS.OFFERS, updated);

    // If accepted, initialize the 5-Stage Due Diligence Deal Room!
    if (acceptedOffer) {
      this.initDueDiligenceForOffer(acceptedOffer);
    }

    this.notify();
  }

  // --- DUE DILIGENCE WORKFLOW (PRD Section 5.6) ---
  getDueDiligenceRooms() {
    return loadFromStorage(STORAGE_KEYS.DUE_DILIGENCE, INITIAL_DUE_DILIGENCE);
  }

  getDueDiligenceByOfferId(offerId) {
    const rooms = this.getDueDiligenceRooms();
    return rooms.find((r) => r.offerId === offerId) || null;
  }

  initDueDiligenceForOffer(offer) {
    const rooms = this.getDueDiligenceRooms();
    const existing = rooms.find((r) => r.offerId === offer.id);
    if (existing) return existing;

    const newRoom = {
      id: `dd-${Date.now().toString().slice(-4)}`,
      offerId: offer.id,
      listingId: offer.listingId,
      propertyTitle: offer.listingTitle,
      buyerName: offer.buyerName,
      sellerName: 'Property Owner',
      stages: [
        {
          stageKey: 'offer_accepted',
          title: 'Offer Accepted & Earnest Escrow',
          description: 'Formal contract signed and earnest deposit safely confirmed.',
          status: 'completed',
          completedAt: 'Today',
          assignedTo: 'Buyer & Seller',
        },
        {
          stageKey: 'physical_inspection',
          title: 'Physical & Structural Engineering Inspection',
          description: 'COREN certified engineer inspection of foundation, MEP, damp-proofing.',
          status: 'in_progress',
          completedAt: null,
          assignedTo: 'COREN Certified Inspector',
        },
        {
          stageKey: 'title_verification',
          title: 'Land Registry Search & Title Verification',
          description: 'Verification of Governor’s Consent / C of O at Alausa Land Registry.',
          status: 'pending',
          completedAt: null,
          assignedTo: 'Conveyancing Solicitor',
        },
        {
          stageKey: 'financing_confirmation',
          title: 'Financing & Proof of Settlement Funds',
          description: 'Escrow confirmation of final purchase consideration funds.',
          status: 'pending',
          completedAt: null,
          assignedTo: 'Financial Institution',
        },
        {
          stageKey: 'closing',
          title: 'Closing, Deed of Assignment & Keys Handover',
          description: 'Final execution of deeds, stamp duty payment, and physical key handover.',
          status: 'pending',
          completedAt: null,
          assignedTo: 'Solicitors & Parties',
        },
      ],
      documents: [
        { id: `doc-1-${Date.now()}`, name: 'Offer_Acceptance_Letter.pdf', type: 'contract', uploadedBy: 'Platform', date: 'Today', size: '1.4 MB' },
        { id: `doc-2-${Date.now()}`, name: 'Title_Deed_Inspection_Copy.pdf', type: 'legal', uploadedBy: 'Seller', date: 'Today', size: '3.6 MB' },
      ],
    };

    const updated = [newRoom, ...rooms];
    saveToStorage(STORAGE_KEYS.DUE_DILIGENCE, updated);
    this.notify();
    return newRoom;
  }

  updateDueDiligenceStage(ddId, stageKey, newStatus) {
    const rooms = this.getDueDiligenceRooms();
    const updated = rooms.map((r) => {
      if (r.id === ddId) {
        return {
          ...r,
          stages: r.stages.map((s) => (s.stageKey === stageKey ? { ...s, status: newStatus, completedAt: newStatus === 'completed' ? 'Just now' : null } : s)),
        };
      }
      return r;
    });
    saveToStorage(STORAGE_KEYS.DUE_DILIGENCE, updated);
    this.notify();
  }

  uploadDueDiligenceDocument(ddId, { name, type }) {
    const rooms = this.getDueDiligenceRooms();
    const currentUser = this.getCurrentUser();
    const updated = rooms.map((r) => {
      if (r.id === ddId) {
        const newDoc = {
          id: `doc-${Date.now().toString().slice(-4)}`,
          name,
          type: type || 'legal',
          uploadedBy: currentUser.name,
          date: 'Just now',
          size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        };
        return { ...r, documents: [newDoc, ...(r.documents || [])] };
      }
      return r;
    });
    saveToStorage(STORAGE_KEYS.DUE_DILIGENCE, updated);
    this.notify();
  }

  // --- MESSAGES & CHAT (PRD Section 5.7) ---
  getMessages() {
    return loadFromStorage(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }

  getThreadMessages(listingId) {
    const all = this.getMessages();
    return all.filter((m) => m.listingId === listingId);
  }

  sendThreadMessage({ listingId, listingTitle = '', body, isSystem = false, recipientId = null }) {
    const messages = this.getMessages();
    const currentUser = this.getCurrentUser();

    const newMsg = {
      id: `msg-${Date.now().toString().slice(-4)}`,
      threadId: `thread-${listingId}`,
      listingId,
      listingTitle,
      senderId: isSystem ? 'system' : currentUser.id,
      senderName: isSystem ? 'StayFinder Automated System' : currentUser.name,
      body,
      timestamp: 'Just now',
      isSystem,
    };

    const updated = [...messages, newMsg];
    saveToStorage(STORAGE_KEYS.MESSAGES, updated);
    this.notify();
    return newMsg;
  }

  // --- REVIEWS & TRUST (PRD Section 5.8) ---
  getReviews() {
    return loadFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  addReview({ targetId, targetName, targetType = 'agent', rating, tag, comment }) {
    const reviews = this.getReviews();
    const currentUser = this.getCurrentUser();

    const newReview = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      targetId,
      targetName,
      targetType,
      authorName: currentUser.name,
      rating,
      tag: tag || 'Verified Inspection',
      comment,
      date: 'Just now',
    };

    const updated = [newReview, ...reviews];
    saveToStorage(STORAGE_KEYS.REVIEWS, updated);
    this.notify();
    return newReview;
  }

  // --- FRAUD & REPORTING (PRD Section 5.8 & 5.11) ---
  getFraudReports() {
    return loadFromStorage(STORAGE_KEYS.FRAUD_REPORTS, INITIAL_FRAUD_REPORTS);
  }

  reportFraud({ listingId, listingTitle, reason, detail, priority = 'High' }) {
    const reports = this.getFraudReports();
    const currentUser = this.getCurrentUser();

    const newReport = {
      id: `fraud-${Date.now().toString().slice(-4)}`,
      listingId,
      listingTitle,
      reportedBy: currentUser.name,
      reason,
      detail,
      priority,
      status: 'open',
      date: 'Just now',
    };

    const updated = [newReport, ...reports];
    saveToStorage(STORAGE_KEYS.FRAUD_REPORTS, updated);
    this.notify();
    return newReport;
  }

  resolveFraudReport(reportId, action) {
    const reports = this.getFraudReports();
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        return {
          ...r,
          status: action === 'suspend' ? 'resolved_suspended' : 'dismissed',
          resolvedAction: action,
        };
      }
      return r;
    });
    saveToStorage(STORAGE_KEYS.FRAUD_REPORTS, updated);
    this.notify();
  }

  // Reset demo storage to defaults
  resetStore() {
    window.localStorage.removeItem(STORAGE_KEYS.LISTINGS);
    window.localStorage.removeItem(STORAGE_KEYS.VIEWINGS);
    window.localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    window.localStorage.removeItem(STORAGE_KEYS.LEASES);
    window.localStorage.removeItem(STORAGE_KEYS.OFFERS);
    window.localStorage.removeItem(STORAGE_KEYS.DUE_DILIGENCE);
    window.localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    window.localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    window.localStorage.removeItem(STORAGE_KEYS.FRAUD_REPORTS);
    window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    this.notify();
  }
}

export const marketplaceStore = new MarketplaceStore();
