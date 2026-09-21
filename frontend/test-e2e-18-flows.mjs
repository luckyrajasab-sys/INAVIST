import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, ".env");
const envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        envVars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  });
}

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN || "inavist.firebaseapp.com",
  projectId: envVars.VITE_FIREBASE_PROJECT_ID || "inavist",
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET || "inavist.firebasestorage.app",
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID || "73992042213",
  appId: envVars.VITE_FIREBASE_APP_ID || "1:73992042213:web:a50ef66a596f746d44c60c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run18FlowsTest() {
  console.log("==================================================================");
  console.log("       INAVIST FULL 18-FLOW VERIFICATION TEST RUNNER             ");
  console.log("==================================================================");
  const testEmail = `traveler_${Date.now()}@inavist-test.com`;
  const testPassword = "Password@123!";
  let testUid = null;

  const results = [];
  const logStep = (stepNum, name, status, details = "") => {
    results.push({ stepNum, name, status, details });
    console.log(`[Flow ${String(stepNum).padStart(2, "0")}] ${name.padEnd(35)} : ${status.toUpperCase()} ${details}`);
  };

  try {
    // Flow 1: Register user (Email/Password)
    try {
      const regCred = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      testUid = regCred.user.uid;
      logStep(1, "Register User (Email/Password)", "PASS", `UID: ${testUid}`);
    } catch (e) {
      logStep(1, "Register User (Email/Password)", "FAIL", e.message);
      throw e;
    }

    // Flow 2: Logout user
    try {
      await signOut(auth);
      logStep(2, "Logout User", "PASS", "Session cleared");
    } catch (e) {
      logStep(2, "Logout User", "FAIL", e.message);
    }

    // Flow 3: Login user
    try {
      const loginCred = await signInWithEmailAndPassword(auth, testEmail, testPassword);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      logStep(3, "Login User", "PASS", `Logged back in as ${loginCred.user.email}`);
    } catch (e) {
      logStep(3, "Login User", "FAIL", e.message);
    }

    // Flow 4: Create / Save user profile to Firestore
    try {
      const profileData = {
        name: "Verified Traveler",
        email: testEmail,
        homeCity: "Jaipur, Rajasthan",
        phone: "+91 9876543210",
        role: "user",
        travelStyle: "Spiritual & Heritage Exploration",
        verificationType: "Aadhaar Verified",
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, "users", testUid), profileData);
      logStep(4, "Create User Profile (Firestore)", "PASS", `users/${testUid} created`);
    } catch (e) {
      logStep(4, "Create User Profile (Firestore)", "FAIL", e.message);
    }

    // Flow 5: Fetch user profile
    try {
      const snap = await getDoc(doc(db, "users", testUid));
      if (snap.exists() && snap.data().homeCity === "Jaipur, Rajasthan") {
        logStep(5, "Fetch User Profile", "PASS", `Found profile: ${snap.data().name}`);
      } else {
        logStep(5, "Fetch User Profile", "FAIL", "Profile not found or mismatched data");
      }
    } catch (e) {
      logStep(5, "Fetch User Profile", "FAIL", e.message);
    }

    // Flow 6: Update user profile
    try {
      await updateDoc(doc(db, "users", testUid), {
        travelStyle: "Eco-Friendly Trekking",
        updatedAt: new Date().toISOString()
      });
      const snap = await getDoc(doc(db, "users", testUid));
      if (snap.data().travelStyle === "Eco-Friendly Trekking") {
        logStep(6, "Update User Profile", "PASS", "Updated travelStyle to Eco-Friendly Trekking");
      } else {
        logStep(6, "Update User Profile", "FAIL", "Update verification failed");
      }
    } catch (e) {
      logStep(6, "Update User Profile", "FAIL", e.message);
    }

    // Flow 7: Search destinations (querying Firestore destinations catalog)
    let sampleDestId = "varanasi";
    try {
      const destSnap = await getDocs(collection(db, "destinations"));
      logStep(7, "Search / Fetch Destinations", "PASS", `Catalog size: ${destSnap.size} destinations in Firestore`);
      if (!destSnap.empty) {
        sampleDestId = destSnap.docs[0].id;
      }
    } catch (e) {
      logStep(7, "Search / Fetch Destinations", "FAIL", e.message);
    }

    // Flow 8: Filter destinations by state/category
    try {
      const q = query(collection(db, "destinations"), where("state", "==", "Uttar Pradesh"));
      const filteredSnap = await getDocs(q);
      logStep(8, "Filter Destinations by State", "PASS", `Found ${filteredSnap.size} destinations in Uttar Pradesh`);
    } catch (e) {
      logStep(8, "Filter Destinations by State", "FAIL", e.message);
    }

    // Flow 9: Add favorite destination
    const favDocId = `${testUid}_${sampleDestId}`;
    try {
      await setDoc(doc(db, "favorites", favDocId), {
        userId: testUid,
        destinationId: sampleDestId,
        createdAt: new Date().toISOString()
      });
      logStep(9, "Add Favorite Destination", "PASS", `Added ${sampleDestId} to favorites`);
    } catch (e) {
      logStep(9, "Add Favorite Destination", "FAIL", e.message);
    }

    // Flow 10: Check favorite status / Fetch user favorites
    try {
      const favSnap = await getDoc(doc(db, "favorites", favDocId));
      if (favSnap.exists()) {
        logStep(10, "Fetch / Check Favorite Status", "PASS", `isFavorite = true`);
      } else {
        logStep(10, "Fetch / Check Favorite Status", "FAIL", `Favorite not found`);
      }
    } catch (e) {
      logStep(10, "Fetch / Check Favorite Status", "FAIL", e.message);
    }

    // Flow 11: Remove favorite destination
    try {
      await deleteDoc(doc(db, "favorites", favDocId));
      const favSnapAfter = await getDoc(doc(db, "favorites", favDocId));
      if (!favSnapAfter.exists()) {
        logStep(11, "Remove Favorite Destination", "PASS", `Removed ${sampleDestId} from favorites`);
      } else {
        logStep(11, "Remove Favorite Destination", "FAIL", `Document still exists`);
      }
    } catch (e) {
      logStep(11, "Remove Favorite Destination", "FAIL", e.message);
    }

    // Flow 12: Create Trip (Itinerary Planning)
    const tripDocId = `trip_e2e_${Date.now()}`;
    try {
      await setDoc(doc(db, "trips", tripDocId), {
        id: tripDocId,
        userId: testUid,
        title: "Kashi Darshan & Ganga Ghats Tour",
        destination: "Varanasi",
        days: 3,
        budget: 15000,
        createdAt: new Date().toISOString()
      });
      logStep(12, "Create Trip (Firestore trips)", "PASS", `Trip ID: ${tripDocId}`);
    } catch (e) {
      logStep(12, "Create Trip (Firestore trips)", "FAIL", e.message);
    }

    // Flow 13: Fetch User Trips (user-scoped query)
    try {
      const tripsQuery = query(collection(db, "trips"), where("userId", "==", testUid));
      const tripsSnap = await getDocs(tripsQuery);
      if (!tripsSnap.empty) {
        logStep(13, "Fetch User Trips", "PASS", `Retrieved ${tripsSnap.size} trips for user`);
      } else {
        logStep(13, "Fetch User Trips", "FAIL", "No trips found");
      }
    } catch (e) {
      logStep(13, "Fetch User Trips", "FAIL", e.message);
    }

    // Flow 14: Update Trip
    try {
      await updateDoc(doc(db, "trips", tripDocId), {
        budget: 18500,
        notes: "Added evening Ganga Aarti boat booking",
        updatedAt: new Date().toISOString()
      });
      const updatedTrip = await getDoc(doc(db, "trips", tripDocId));
      if (updatedTrip.data().budget === 18500) {
        logStep(14, "Update Trip", "PASS", "Updated trip budget to 18500");
      } else {
        logStep(14, "Update Trip", "FAIL", "Budget mismatch");
      }
    } catch (e) {
      logStep(14, "Update Trip", "FAIL", e.message);
    }

    // Flow 15: Create Review for a destination
    const reviewDocId = `rev_e2e_${Date.now()}`;
    try {
      await setDoc(doc(db, "reviews", reviewDocId), {
        id: reviewDocId,
        destinationId: sampleDestId,
        userId: testUid,
        userName: "Verified Traveler",
        rating: 5,
        comment: "Mesmerizing evening Aarti and divine spiritual energy on the ghats!",
        createdAt: new Date().toISOString()
      });
      logStep(15, "Create Review (1-5 stars)", "PASS", `Created review ${reviewDocId} (5 stars)`);
    } catch (e) {
      logStep(15, "Create Review (1-5 stars)", "FAIL", e.message);
    }

    // Flow 16: Fetch Destination Reviews
    try {
      const revQuery = query(collection(db, "reviews"), where("destinationId", "==", sampleDestId));
      const revSnap = await getDocs(revQuery);
      logStep(16, "Fetch Destination Reviews", "PASS", `Found ${revSnap.size} reviews for ${sampleDestId}`);
    } catch (e) {
      logStep(16, "Fetch Destination Reviews", "FAIL", e.message);
    }

    // Flow 17: Book Transport Ticket and Cancel Booking
    const bookingDocId = `bkg_e2e_${Date.now()}`;
    try {
      await setDoc(doc(db, "bookings", bookingDocId), {
        id: bookingDocId,
        userId: testUid,
        pnrNumber: "PNR-998877",
        mode: "train",
        serviceName: "Vande Bharat Express (New Delhi ➔ Varanasi)",
        origin: "New Delhi",
        destination: "Varanasi",
        travelDate: "2026-10-15",
        status: "confirmed",
        totalPrice: 1750,
        createdAt: new Date().toISOString()
      });

      // Query bookings
      const bkgQuery = query(collection(db, "bookings"), where("userId", "==", testUid));
      const bkgSnap = await getDocs(bkgQuery);
      
      // Cancel booking
      await updateDoc(doc(db, "bookings", bookingDocId), {
        status: "cancelled",
        updatedAt: new Date().toISOString()
      });
      const checkBkg = await getDoc(doc(db, "bookings", bookingDocId));

      if (bkgSnap.size >= 1 && checkBkg.data().status === "cancelled") {
        logStep(17, "Book & Cancel Transport Ticket", "PASS", `Booking created & cancelled successfully`);
      } else {
        logStep(17, "Book & Cancel Transport Ticket", "FAIL", "Booking status not updated");
      }
    } catch (e) {
      logStep(17, "Book & Cancel Transport Ticket", "FAIL", e.message);
    }

    // Flow 18: Security Rules Enforcement (Unauthorized Access Prevention)
    // Create User B and verify User B CANNOT read, update, or delete User A's private trip/profile
    try {
      const userBEmail = `adversary_${Date.now()}@inavist-test.com`;
      const regUserB = await createUserWithEmailAndPassword(auth, userBEmail, "AdversaryPass123!");
      const userBUid = regUserB.user.uid;

      // User B attempts to write to User A's profile
      let hackSucceeded = false;
      try {
        await updateDoc(doc(db, "users", testUid), {
          name: "HACKED_BY_USER_B"
        });
        hackSucceeded = true;
      } catch (secErr) {
        // Expected permission-denied
      }

      // User B attempts to delete User A's trip
      try {
        await deleteDoc(doc(db, "trips", tripDocId));
        hackSucceeded = true;
      } catch (secErr) {
        // Expected permission-denied
      }

      if (!hackSucceeded) {
        logStep(18, "Unauthorized Access Prevention", "PASS", "Security rules blocked User B from modifying User A data (permission-denied)");
      } else {
        logStep(18, "Unauthorized Access Prevention", "FAIL", "Security rules failed: User B was able to modify User A data!");
      }

      // Sign back into User A to clean up test trip, review, and booking
      await signOut(auth);
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      await deleteDoc(doc(db, "trips", tripDocId)).catch(() => {});
      await deleteDoc(doc(db, "reviews", reviewDocId)).catch(() => {});
      await deleteDoc(doc(db, "bookings", bookingDocId)).catch(() => {});
    } catch (e) {
      logStep(18, "Unauthorized Access Prevention", "FAIL", e.message);
    }

  } catch (err) {
    console.error("Critical test execution error:", err);
  }

  console.log("==================================================================");
  const passedCount = results.filter(r => r.status === "PASS").length;
  console.log(`Summary: ${passedCount}/${results.length} Flows Passed Successfully!`);
  console.log("==================================================================");
  process.exit(passedCount === 18 ? 0 : 1);
}

run18FlowsTest();
