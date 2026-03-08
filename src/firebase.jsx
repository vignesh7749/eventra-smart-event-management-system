import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyByqLd-znO-u2-Ebj7qax75iIM5ZuCwh9Q",
  authDomain: "smart-event-system-ebdbb.firebaseapp.com",
  projectId: "smart-event-system-ebdbb",
  storageBucket: "smart-event-system-ebdbb.firebasestorage.app",
  messagingSenderId: "745467386991",
  appId: "1:745467386991:web:3e25e0576bc389c62f419a"
}

const app = initializeApp(firebaseConfig)

// Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app