import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatter-7b497.firebaseapp.com",
  projectId: "chatter-7b497",
  storageBucket: "chatter-7b497.firebasestorage.app",
  messagingSenderId: "247940830685",
  appId: "1:247940830685:web:6f0fa33778a27faf0d1234"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore();
