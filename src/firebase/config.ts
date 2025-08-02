import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBOdwcuchh0ZBTSUz7HxGqTChh32MXW4dc",
  authDomain: "event-form-b5d6b.firebaseapp.com",
  projectId: "event-form-b5d6b",
  storageBucket: "event-form-b5d6b.firebasestorage.app",
  messagingSenderId: "1091829869147",
  appId: "1:1091829869147:web:3b2cc9527eead0d605ad7e",
  measurementId: "G-4KH97JT1R1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});
