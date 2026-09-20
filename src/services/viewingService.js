/**
 * Viewing & Application Service
 * Provides helpers for scheduled viewings, tenant applications,
 * purchase offers, and digital leases, backed by marketplaceStore.
 */
import { marketplaceStore } from './marketplaceStore';

export const INITIAL_VIEWING_REQUESTS = marketplaceStore.getViewings();
export const INITIAL_OFFERS_APPLICATIONS = marketplaceStore.getApplications();

export const viewingService = {
  getViewings: () => marketplaceStore.getViewings(),
  createViewingRequest: (data) => marketplaceStore.createViewingRequest(data),
  updateViewingStatus: (id, status) => marketplaceStore.updateViewingStatus(id, status),

  getApplications: () => marketplaceStore.getApplications(),
  submitRentalApplication: (data) => marketplaceStore.submitRentalApplication(data),
  updateApplicationStatus: (id, status) => marketplaceStore.updateApplicationStatus(id, status),

  getOffers: () => marketplaceStore.getOffers(),
  submitPurchaseOffer: (data) => marketplaceStore.submitPurchaseOffer(data),
  counterOrAcceptOffer: (id, action, amount, note) => marketplaceStore.counterOrAcceptOffer(id, action, amount, note),

  getLeases: () => marketplaceStore.getLeases(),
  signLeaseAndPay: (leaseId, signature, paymentDetails) => marketplaceStore.signLeaseAndPay(leaseId, signature, paymentDetails),

  getDueDiligenceRooms: () => marketplaceStore.getDueDiligenceRooms(),
  getDueDiligenceByOfferId: (offerId) => marketplaceStore.getDueDiligenceByOfferId(offerId),
  updateDueDiligenceStage: (ddId, stageKey, status) => marketplaceStore.updateDueDiligenceStage(ddId, stageKey, status),
  uploadDueDiligenceDocument: (ddId, doc) => marketplaceStore.uploadDueDiligenceDocument(ddId, doc),
};

export default viewingService;
