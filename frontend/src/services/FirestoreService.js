import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage, auth } from "../config/firebase.js";

/**
 * Centralized FirestoreService for INAVIST
 * Encapsulates all Firestore database operations for:
 * - users
 * - destinations
 * - trips
 * - favorites
 * - reviews
 * - bookings
 */
export const FirestoreService = {
  // =========================================================================
  // 1. DESTINATIONS
  // =========================================================================

  /**
   * Fetch all destinations from Firestore with optional filtering.
   */
  async getDestinations(options = {}) {
    if (!firestore) return [];
    try {
      let q = collection(firestore, "destinations");
      const constraints = [];

      if (options.state && options.state !== "All States") {
        constraints.push(where("state", "==", options.state));
      }
      if (options.category && options.category !== "all") {
        constraints.push(where("category", "==", options.category));
      }
      if (options.limitCount) {
        constraints.push(limit(options.limitCount));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snap = await getDocs(q);
      const destinations = [];
      snap.forEach((docSnap) => {
        destinations.push({ id: docSnap.id, ...docSnap.data() });
      });
      return destinations;
    } catch (err) {
      console.warn("[FirestoreService] getDestinations error:", err.message);
      throw err;
    }
  },

  /**
   * Fetch a single destination by its ID.
   */
  async getDestinationById(id) {
    if (!firestore || !id) return null;
    try {
      const docRef = doc(firestore, "destinations", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
      return null;
    } catch (err) {
      console.warn(`[FirestoreService] getDestinationById(${id}) error:`, err.message);
      throw err;
    }
  },

  /**
   * Seed destinations if the remote collection is currently empty.
   */
  async seedDestinationsIfEmpty(initialData = []) {
    if (!firestore || !initialData || initialData.length === 0) return 0;
    try {
      const snap = await getDocs(query(collection(firestore, "destinations"), limit(1)));
      if (!snap.empty) {
        return 0; // Already seeded
      }

      console.log(`[FirestoreService] Seeding ${initialData.length} destinations to Firestore...`);
      // Firestore batch max 500 writes
      const chunkSize = 250;
      let totalSeeded = 0;

      for (let i = 0; i < initialData.length; i += chunkSize) {
        const chunk = initialData.slice(i, i + chunkSize);
        const batch = writeBatch(firestore);

        for (const item of chunk) {
          const docId = item.id || `dest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const docRef = doc(firestore, "destinations", docId);
          batch.set(docRef, { ...item, id: docId });
        }

        await batch.commit();
        totalSeeded += chunk.length;
      }

      console.log(`[FirestoreService] Successfully seeded ${totalSeeded} destinations.`);
      return totalSeeded;
    } catch (err) {
      console.warn("[FirestoreService] seedDestinationsIfEmpty notice:", err.message);
      return 0;
    }
  },

  // =========================================================================
  // 2. USER PROFILE (users/{uid})
  // =========================================================================

  /**
   * Fetch user profile document by UID.
   */
  async getUserProfile(userId) {
    if (!firestore || !userId) return null;
    try {
      const userRef = doc(firestore, "users", userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
      return null;
    } catch (err) {
      console.warn(`[FirestoreService] getUserProfile(${userId}) error:`, err.message);
      return null;
    }
  },

  /**
   * Update or create user profile.
   */
  async updateUserProfile(userId, data) {
    if (!firestore || !userId) return false;
    try {
      const userRef = doc(firestore, "users", userId);
      await setDoc(
        userRef,
        {
          ...data,
          id: userId,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
      return true;
    } catch (err) {
      console.warn(`[FirestoreService] updateUserProfile error:`, err.message);
      throw err;
    }
  },

  /**
   * Real-time listener for user profile.
   */
  subscribeUserProfile(userId, onUpdate, onError) {
    if (!firestore || !userId) return () => {};
    const userRef = doc(firestore, "users", userId);
    return onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate({ id: snap.id, ...snap.data() });
        }
      },
      (err) => {
        console.warn("[FirestoreService] subscribeUserProfile warning:", err.message);
        if (onError) onError(err);
      }
    );
  },

  // =========================================================================
  // 3. TRIP PLANNING (trips collection)
  // =========================================================================

  /**
   * Create a new trip for a user.
   */
  async createTrip(userId, tripData) {
    if (!firestore || !userId) throw new Error("User ID is required to create a trip.");
    try {
      const tripId = tripData.id || `trip-${Date.now()}`;
      const tripRef = doc(firestore, "trips", tripId);
      const payload = {
        ...tripData,
        id: tripId,
        userId,
        createdAt: tripData.createdAt || new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString()
      };
      await setDoc(tripRef, payload);
      return payload;
    } catch (err) {
      console.warn("[FirestoreService] createTrip error:", err.message);
      throw err;
    }
  },

  /**
   * Get all trips belonging to a user.
   */
  async getUserTrips(userId) {
    if (!firestore || !userId) return [];
    try {
      const q = query(
        collection(firestore, "trips"),
        where("userId", "==", userId)
      );
      const snap = await getDocs(q);
      const trips = [];
      snap.forEach((docSnap) => {
        trips.push({ id: docSnap.id, ...docSnap.data() });
      });
      return trips;
    } catch (err) {
      console.warn(`[FirestoreService] getUserTrips(${userId}) error:`, err.message);
      throw err;
    }
  },

  /**
   * Update an existing trip.
   */
  async updateTrip(userId, tripId, tripData) {
    if (!firestore || !userId || !tripId) return false;
    try {
      const tripRef = doc(firestore, "trips", tripId);
      await updateDoc(tripRef, {
        ...tripData,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn(`[FirestoreService] updateTrip(${tripId}) error:`, err.message);
      throw err;
    }
  },

  /**
   * Delete a trip.
   */
  async deleteTrip(userId, tripId) {
    if (!firestore || !userId || !tripId) return false;
    try {
      const tripRef = doc(firestore, "trips", tripId);
      await deleteDoc(tripRef);
      return true;
    } catch (err) {
      console.warn(`[FirestoreService] deleteTrip(${tripId}) error:`, err.message);
      throw err;
    }
  },

  /**
   * Real-time listener for user trips.
   */
  subscribeUserTrips(userId, onUpdate, onError) {
    if (!firestore || !userId) return () => {};
    const q = query(collection(firestore, "trips"), where("userId", "==", userId));
    return onSnapshot(
      q,
      (snap) => {
        const trips = [];
        snap.forEach((docSnap) => {
          trips.push({ id: docSnap.id, ...docSnap.data() });
        });
        onUpdate(trips);
      },
      (err) => {
        console.warn("[FirestoreService] subscribeUserTrips warning:", err.message);
        if (onError) onError(err);
      }
    );
  },

  // =========================================================================
  // 4. FAVORITES (favorites collection)
  // =========================================================================

  /**
   * Add destination to favorites.
   */
  async addFavorite(userId, destinationId, destinationData = {}) {
    if (!firestore || !userId || !destinationId) throw new Error("Missing parameters for addFavorite");
    try {
      const favId = `${userId}_${destinationId}`;
      const favRef = doc(firestore, "favorites", favId);
      const payload = {
        id: favId,
        userId,
        destinationId,
        destinationName: destinationData.name || "",
        destinationImage: destinationData.images?.[0] || destinationData.image || "",
        destinationState: destinationData.state || "",
        createdAt: new Date().toISOString()
      };
      await setDoc(favRef, payload);
      return payload;
    } catch (err) {
      console.warn("[FirestoreService] addFavorite error:", err.message);
      throw err;
    }
  },

  /**
   * Remove destination from favorites.
   */
  async removeFavorite(userId, destinationId) {
    if (!firestore || !userId || !destinationId) return false;
    try {
      const favId = `${userId}_${destinationId}`;
      const favRef = doc(firestore, "favorites", favId);
      await deleteDoc(favRef);
      return true;
    } catch (err) {
      console.warn("[FirestoreService] removeFavorite error:", err.message);
      throw err;
    }
  },

  /**
   * Check if a destination is favorited by the user.
   */
  async isFavorite(userId, destinationId) {
    if (!firestore || !userId || !destinationId) return false;
    try {
      const favId = `${userId}_${destinationId}`;
      const favRef = doc(firestore, "favorites", favId);
      const snap = await getDoc(favRef);
      return snap.exists();
    } catch (err) {
      return false;
    }
  },

  /**
   * Get all favorites for a user.
   */
  async getFavorites(userId) {
    if (!firestore || !userId) return [];
    try {
      const q = query(collection(firestore, "favorites"), where("userId", "==", userId));
      const snap = await getDocs(q);
      const favs = [];
      snap.forEach((docSnap) => {
        favs.push({ id: docSnap.id, ...docSnap.data() });
      });
      return favs;
    } catch (err) {
      console.warn("[FirestoreService] getFavorites error:", err.message);
      throw err;
    }
  },

  /**
   * Real-time listener for user favorites.
   */
  subscribeFavorites(userId, onUpdate, onError) {
    if (!firestore || !userId) return () => {};
    const q = query(collection(firestore, "favorites"), where("userId", "==", userId));
    return onSnapshot(
      q,
      (snap) => {
        const favs = [];
        snap.forEach((docSnap) => {
          favs.push({ id: docSnap.id, ...docSnap.data() });
        });
        onUpdate(favs);
      },
      (err) => {
        console.warn("[FirestoreService] subscribeFavorites warning:", err.message);
        if (onError) onError(err);
      }
    );
  },

  // =========================================================================
  // 5. REVIEWS (reviews collection)
  // =========================================================================

  /**
   * Create a new review for a destination.
   */
  async createReview(userId, userDetails, destinationId, reviewData) {
    if (!firestore || !userId || !destinationId) throw new Error("Missing parameters for createReview");
    try {
      const reviewId = `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const reviewRef = doc(firestore, "reviews", reviewId);
      const payload = {
        id: reviewId,
        destinationId,
        userId,
        userName: userDetails?.name || "Verified Traveler",
        userAvatar: userDetails?.avatar || "/default-avatar.png",
        rating: Number(reviewData.rating) || 5,
        comment: reviewData.comment || "",
        visitMonth: reviewData.visitMonth || "Recent visit",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(reviewRef, payload);
      return payload;
    } catch (err) {
      console.warn("[FirestoreService] createReview error:", err.message);
      throw err;
    }
  },

  /**
   * Fetch all reviews for a destination.
   */
  async getDestinationReviews(destinationId) {
    if (!firestore || !destinationId) return [];
    try {
      const q = query(
        collection(firestore, "reviews"),
        where("destinationId", "==", destinationId)
      );
      const snap = await getDocs(q);
      const reviews = [];
      snap.forEach((docSnap) => {
        reviews.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort newest first
      reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return reviews;
    } catch (err) {
      console.warn(`[FirestoreService] getDestinationReviews error:`, err.message);
      return [];
    }
  },

  /**
   * Update an existing review.
   */
  async updateReview(userId, reviewId, reviewData) {
    if (!firestore || !userId || !reviewId) return false;
    try {
      const reviewRef = doc(firestore, "reviews", reviewId);
      await updateDoc(reviewRef, {
        rating: Number(reviewData.rating) || 5,
        comment: reviewData.comment || "",
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn(`[FirestoreService] updateReview error:`, err.message);
      throw err;
    }
  },

  /**
   * Delete a review.
   */
  async deleteReview(userId, reviewId) {
    if (!firestore || !userId || !reviewId) return false;
    try {
      const reviewRef = doc(firestore, "reviews", reviewId);
      await deleteDoc(reviewRef);
      return true;
    } catch (err) {
      console.warn(`[FirestoreService] deleteReview error:`, err.message);
      throw err;
    }
  },

  /**
   * Real-time listener for destination reviews.
   */
  subscribeDestinationReviews(destinationId, onUpdate) {
    if (!firestore || !destinationId) return () => {};
    const q = query(collection(firestore, "reviews"), where("destinationId", "==", destinationId));
    return onSnapshot(
      q,
      (snap) => {
        const reviews = [];
        snap.forEach((docSnap) => {
          reviews.push({ id: docSnap.id, ...docSnap.data() });
        });
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        onUpdate(reviews);
      },
      (err) => {
        console.warn("[FirestoreService] subscribeDestinationReviews error:", err.message);
      }
    );
  },

  // =========================================================================
  // 6. BOOKINGS (bookings collection)
  // =========================================================================

  /**
   * Create a new booking for a user.
   */
  async createBooking(userId, bookingData) {
    if (!firestore || !userId) throw new Error("User ID is required to create a booking.");
    try {
      const bookingId = bookingData.bookingId || `bkg-${Date.now()}`;
      const docRef = doc(firestore, "bookings", bookingId);
      const payload = {
        ...bookingData,
        id: bookingId,
        bookingId,
        userId,
        status: bookingData.status || "Confirmed",
        paymentStatus: bookingData.paymentStatus || "VERIFIED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, payload);
      return payload;
    } catch (err) {
      console.warn("[FirestoreService] createBooking error:", err.message);
      throw err;
    }
  },

  /**
   * Get all bookings for a user.
   */
  async getUserBookings(userId) {
    if (!firestore || !userId) return [];
    try {
      const q = query(collection(firestore, "bookings"), where("userId", "==", userId));
      const snap = await getDocs(q);
      const bookings = [];
      snap.forEach((docSnap) => {
        bookings.push({ id: docSnap.id, ...docSnap.data() });
      });
      bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return bookings;
    } catch (err) {
      console.warn(`[FirestoreService] getUserBookings(${userId}) error:`, err.message);
      throw err;
    }
  },

  /**
   * Update booking status.
   */
  async updateBookingStatus(userId, bookingId, status) {
    if (!firestore || !userId || !bookingId) return false;
    try {
      const docRef = doc(firestore, "bookings", bookingId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn(`[FirestoreService] updateBookingStatus error:`, err.message);
      throw err;
    }
  },

  /**
   * Cancel a booking.
   */
  async cancelBooking(userId, bookingId) {
    if (!firestore || !userId || !bookingId) return false;
    try {
      const docRef = doc(firestore, "bookings", bookingId);
      await updateDoc(docRef, {
        status: "cancelled",
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn(`[FirestoreService] cancelBooking error:`, err.message);
      throw err;
    }
  },

  /**
   * Real-time listener for user bookings.
   */
  subscribeUserBookings(userId, onUpdate, onError) {
    if (!firestore || !userId) return () => {};
    const q = query(collection(firestore, "bookings"), where("userId", "==", userId));
    return onSnapshot(
      q,
      (snap) => {
        const bookings = [];
        snap.forEach((docSnap) => {
          bookings.push({ id: docSnap.id, ...docSnap.data() });
        });
        bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        onUpdate(bookings);
      },
      (err) => {
        console.warn("[FirestoreService] subscribeUserBookings error:", err.message);
        if (onError) onError(err);
      }
    );
  },

  // =========================================================================
  // 7. FIREBASE STORAGE (Profiles & Destination Images)
  // =========================================================================

  /**
   * Upload user profile avatar photo to Firebase Storage.
   * Gracefully returns data URL fallback if Storage bucket is not yet activated.
   */
  async uploadProfilePhoto(userId, file) {
    if (!userId || !file) throw new Error("Missing userId or file for upload");
    try {
      if (!storage) throw new Error("Firebase Storage is not initialized");
      const fileExt = file.name ? file.name.split(".").pop() : "jpg";
      const storageRef = ref(storage, `users/${userId}/avatar_${Date.now()}.${fileExt}`);
      const uploadResult = await uploadBytes(storageRef, file, {
        contentType: file.type || "image/jpeg"
      });
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Also persist to users/{uid} document
      await setDoc(
        doc(firestore, "users", userId),
        { photoURL: downloadURL, avatar: downloadURL, updatedAt: new Date().toISOString() },
        { merge: true }
      );

      return downloadURL;
    } catch (err) {
      console.warn("[FirestoreService] uploadProfilePhoto warning:", err.message);
      // If storage bucket is not provisioned, create local data URL preview so user experience is not blocked
      if (err.code === "storage/bucket-not-found" || err.message?.includes("bucket")) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const dataUrl = e.target.result;
            if (firestore) {
              await setDoc(
                doc(firestore, "users", userId),
                { photoURL: dataUrl, avatar: dataUrl, updatedAt: new Date().toISOString() },
                { merge: true }
              ).catch(() => {});
            }
            resolve(dataUrl);
          };
          reader.readAsDataURL(file);
        });
      }
      throw err;
    }
  },

  /**
   * Upload destination photo to Firebase Storage.
   */
  async uploadDestinationImage(destinationId, file) {
    if (!destinationId || !file) throw new Error("Missing destinationId or file");
    if (!storage) throw new Error("Firebase Storage is not initialized");
    const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, "_") : "img.jpg";
    const storageRef = ref(storage, `destinations/${destinationId}/${Date.now()}_${safeName}`);
    const uploadResult = await uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg"
    });
    return await getDownloadURL(uploadResult.ref);
  },

  // =========================================================================
  // 8. ADMIN OPERATIONS (Platform Oversight & Moderation)
  // =========================================================================

  /**
   * Add a new destination (Admin only).
   */
  async addDestination(destinationData) {
    if (!firestore) throw new Error("Firestore not initialized");
    const docId = destinationData.id || `dest_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const docRef = doc(firestore, "destinations", docId);
    const payload = {
      ...destinationData,
      id: docId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload);
    return payload;
  },

  /**
   * Update destination (Admin only).
   */
  async updateDestination(destinationId, updatedData) {
    if (!firestore || !destinationId) throw new Error("Missing parameters for updateDestination");
    const docRef = doc(firestore, "destinations", destinationId);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    return true;
  },

  /**
   * Delete destination (Admin only).
   */
  async deleteDestination(destinationId) {
    if (!firestore || !destinationId) throw new Error("Missing parameters for deleteDestination");
    const docRef = doc(firestore, "destinations", destinationId);
    await deleteDoc(docRef);
    return true;
  },

  /**
   * Fetch all registered users (Admin only).
   */
  async getAllUsers(maxCount = 100) {
    if (!firestore) return [];
    try {
      const q = query(collection(firestore, "users"), limit(maxCount));
      const snap = await getDocs(q);
      const users = [];
      snap.forEach((d) => users.push({ id: d.id, ...d.data() }));
      return users;
    } catch (err) {
      console.warn("[FirestoreService] getAllUsers error:", err.message);
      return [];
    }
  },

  /**
   * Fetch all system bookings (Admin only).
   */
  async getAllBookings(maxCount = 100) {
    if (!firestore) return [];
    try {
      const q = query(collection(firestore, "bookings"), limit(maxCount));
      const snap = await getDocs(q);
      const bookings = [];
      snap.forEach((d) => bookings.push({ id: d.id, ...d.data() }));
      return bookings;
    } catch (err) {
      console.warn("[FirestoreService] getAllBookings error:", err.message);
      return [];
    }
  },

  /**
   * Moderate review status (Admin only).
   */
  async moderateReview(reviewId, status) {
    if (!firestore || !reviewId) return false;
    const docRef = doc(firestore, "reviews", reviewId);
    await updateDoc(docRef, {
      status, // "approved" | "rejected"
      moderatedAt: new Date().toISOString()
    });
    return true;
  },

  /**
   * Fetch all reviews across destinations for moderation (Admin only).
   */
  async getAllReviews(maxCount = 50) {
    if (!firestore) return [];
    try {
      const q = query(collection(firestore, "reviews"), limit(maxCount));
      const snap = await getDocs(q);
      const revs = [];
      snap.forEach((d) => revs.push({ id: d.id, ...d.data() }));
      revs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return revs;
    } catch (err) {
      console.warn("[FirestoreService] getAllReviews error:", err.message);
      return [];
    }
  }
};

// ===========================================================================
// Modular Service Layer Exports
// ===========================================================================

export const destinationService = {
  getDestinations: FirestoreService.getDestinations.bind(FirestoreService),
  getDestinationById: FirestoreService.getDestinationById.bind(FirestoreService),
  seedDestinationsIfEmpty: FirestoreService.seedDestinationsIfEmpty.bind(FirestoreService),
  addDestination: FirestoreService.addDestination.bind(FirestoreService),
  updateDestination: FirestoreService.updateDestination.bind(FirestoreService),
  deleteDestination: FirestoreService.deleteDestination.bind(FirestoreService)
};

export const userService = {
  getUserProfile: FirestoreService.getUserProfile.bind(FirestoreService),
  updateUserProfile: FirestoreService.updateUserProfile.bind(FirestoreService),
  subscribeUserProfile: FirestoreService.subscribeUserProfile.bind(FirestoreService),
  getAllUsers: FirestoreService.getAllUsers.bind(FirestoreService)
};

export const tripService = {
  createTrip: FirestoreService.createTrip.bind(FirestoreService),
  getUserTrips: FirestoreService.getUserTrips.bind(FirestoreService),
  updateTrip: FirestoreService.updateTrip.bind(FirestoreService),
  deleteTrip: FirestoreService.deleteTrip.bind(FirestoreService),
  subscribeUserTrips: FirestoreService.subscribeUserTrips.bind(FirestoreService)
};

export const favoriteService = {
  addFavorite: FirestoreService.addFavorite.bind(FirestoreService),
  removeFavorite: FirestoreService.removeFavorite.bind(FirestoreService),
  isFavorite: FirestoreService.isFavorite.bind(FirestoreService),
  getUserFavorites: FirestoreService.getFavorites.bind(FirestoreService),
  getFavorites: FirestoreService.getFavorites.bind(FirestoreService),
  subscribeFavorites: FirestoreService.subscribeFavorites.bind(FirestoreService)
};

export const reviewService = {
  createReview: FirestoreService.createReview.bind(FirestoreService),
  getDestinationReviews: FirestoreService.getDestinationReviews.bind(FirestoreService),
  updateReview: FirestoreService.updateReview.bind(FirestoreService),
  deleteReview: FirestoreService.deleteReview.bind(FirestoreService),
  subscribeDestinationReviews: FirestoreService.subscribeDestinationReviews.bind(FirestoreService),
  moderateReview: FirestoreService.moderateReview.bind(FirestoreService)
};

export const bookingService = {
  createBooking: FirestoreService.createBooking.bind(FirestoreService),
  getUserBookings: FirestoreService.getUserBookings.bind(FirestoreService),
  updateBookingStatus: FirestoreService.updateBookingStatus.bind(FirestoreService),
  cancelBooking: FirestoreService.cancelBooking.bind(FirestoreService),
  subscribeUserBookings: FirestoreService.subscribeUserBookings.bind(FirestoreService),
  getAllBookings: FirestoreService.getAllBookings.bind(FirestoreService)
};

export const storageService = {
  uploadProfilePhoto: FirestoreService.uploadProfilePhoto.bind(FirestoreService),
  uploadDestinationImage: FirestoreService.uploadDestinationImage.bind(FirestoreService)
};

export const adminService = {
  addDestination: FirestoreService.addDestination.bind(FirestoreService),
  updateDestination: FirestoreService.updateDestination.bind(FirestoreService),
  deleteDestination: FirestoreService.deleteDestination.bind(FirestoreService),
  getAllUsers: FirestoreService.getAllUsers.bind(FirestoreService),
  getAllBookings: FirestoreService.getAllBookings.bind(FirestoreService),
  moderateReview: FirestoreService.moderateReview.bind(FirestoreService),
  getAllReviews: FirestoreService.getAllReviews.bind(FirestoreService)
};

export default FirestoreService;
