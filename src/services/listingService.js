/**
 * Listing Service
 * Wraps listing management operations around the marketplace store
 */
import { marketplaceStore } from './marketplaceStore';

export const listingService = {
  getAllListings: () => marketplaceStore.getListings(),
  getListingById: (id) => marketplaceStore.getListingById(id),
  createListing: (data) => marketplaceStore.createListing(data),
  verifyListing: (id, approved, notes) => marketplaceStore.verifyListing(id, approved, notes),
  reportListing: (report) => marketplaceStore.reportFraud(report),
};

export default listingService;
