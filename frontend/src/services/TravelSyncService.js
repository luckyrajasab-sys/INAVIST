import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  addDoc 
} from "firebase/firestore";
import { firestore } from "../config/firebase";

/**
 * TravelSyncService provides real-time Firestore database synchronization
 * for user profiles, travel itineraries, emergency contacts, and live SOS alerts.
 * If Firestore is temporarily unavailable or still being provisioned,
 * operations gracefully fail open without breaking the UI.
 */
export const TravelSyncService = {
  /**
   * Listen to real-time changes to the user's profile document.
   */
  subscribeUserProfile(userId, onUpdate, onError) {
    if (!firestore || !userId) return () => {};
    try {
      const userRef = doc(firestore, "users", userId);
      return onSnapshot(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            onUpdate(snapshot.data());
          }
        },
        (err) => {
          console.warn("[TravelSync] Profile sync warning (using cached data):", err.message);
          if (onError) onError(err);
        }
      );
    } catch (e) {
      console.warn("[TravelSync] Could not attach profile listener:", e.message);
      return () => {};
    }
  },

  /**
   * Persist user profile to Firestore.
   */
  async saveUserProfile(userId, data) {
    if (!firestore || !userId) return false;
    try {
      const userRef = doc(firestore, "users", userId);
      await setDoc(userRef, {
        ...data,
        id: userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (e) {
      console.warn("[TravelSync] Could not save profile to Firestore:", e.message);
      return false;
    }
  },

  /**
   * Listen to real-time trips collection.
   */
  subscribeTrips(userId, onUpdate, onError) {
    if (!firestore || !userId) return () => {};
    try {
      const tripsCol = collection(firestore, "users", userId, "trips");
      return onSnapshot(
        tripsCol,
        (snapshot) => {
          const trips = [];
          snapshot.forEach((docSnap) => {
            trips.push({ id: docSnap.id, ...docSnap.data() });
          });
          onUpdate(trips);
        },
        (err) => {
          console.warn("[TravelSync] Trips sync warning (using local trips):", err.message);
          if (onError) onError(err);
        }
      );
    } catch (e) {
      console.warn("[TravelSync] Could not attach trips listener:", e.message);
      return () => {};
    }
  },

  /**
   * Save or update a trip itinerary in Firestore.
   */
  async saveTrip(userId, trip) {
    if (!firestore || !userId || !trip?.id) return false;
    try {
      const tripRef = doc(firestore, "users", userId, "trips", trip.id);
      await setDoc(tripRef, {
        ...trip,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (e) {
      console.warn("[TravelSync] Could not save trip to Firestore:", e.message);
      return false;
    }
  },

  /**
   * Remove a trip from Firestore.
   */
  async deleteTrip(userId, tripId) {
    if (!firestore || !userId || !tripId) return false;
    try {
      const tripRef = doc(firestore, "users", userId, "trips", tripId);
      await deleteDoc(tripRef);
      return true;
    } catch (e) {
      console.warn("[TravelSync] Could not delete trip from Firestore:", e.message);
      return false;
    }
  },

  /**
   * Listen to real-time emergency contacts.
   */
  subscribeEmergencyContacts(userId, onUpdate, onError) {
    if (!firestore || !userId) return () => {};
    try {
      const contactsCol = collection(firestore, "users", userId, "emergency_contacts");
      return onSnapshot(
        contactsCol,
        (snapshot) => {
          const contacts = [];
          snapshot.forEach((docSnap) => {
            contacts.push({ id: docSnap.id, ...docSnap.data() });
          });
          if (contacts.length > 0) {
            onUpdate(contacts);
          }
        },
        (err) => {
          console.warn("[TravelSync] Contacts sync warning:", err.message);
          if (onError) onError(err);
        }
      );
    } catch (e) {
      console.warn("[TravelSync] Could not attach emergency contacts listener:", e.message);
      return () => {};
    }
  },

  /**
   * Save an emergency contact.
   */
  async saveEmergencyContact(userId, contact) {
    if (!firestore || !userId || !contact?.id) return false;
    try {
      const contactRef = doc(firestore, "users", userId, "emergency_contacts", contact.id);
      await setDoc(contactRef, contact, { merge: true });
      return true;
    } catch (e) {
      console.warn("[TravelSync] Could not save emergency contact:", e.message);
      return false;
    }
  },

  /**
   * Delete an emergency contact.
   */
  async deleteEmergencyContact(userId, contactId) {
    if (!firestore || !userId || !contactId) return false;
    try {
      const contactRef = doc(firestore, "users", userId, "emergency_contacts", contactId);
      await deleteDoc(contactRef);
      return true;
    } catch (e) {
      console.warn("[TravelSync] Could not delete emergency contact:", e.message);
      return false;
    }
  },

  /**
   * Broadcast emergency SOS alert to Firestore.
   */
  async broadcastSOS(userId, location, message) {
    if (!firestore) return false;
    try {
      const alertsCol = collection(firestore, "emergency_broadcasts");
      await addDoc(alertsCol, {
        userId: userId || "anonymous",
        alertType: "CRITICAL_SOS",
        location: location || {},
        message: message || "Traveler SOS emergency broadcast",
        timestamp: new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.warn("[TravelSync] Could not broadcast SOS to Firestore:", e.message);
      return false;
    }
  }
};
