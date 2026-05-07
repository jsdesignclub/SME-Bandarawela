import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5ulR8LY8S0Xj9z6wfwTzp-kkhDfQ8Nvs",
  authDomain: "my-first-project-955f6.firebaseapp.com",
  projectId: "my-first-project-955f6",
  storageBucket: "my-first-project-955f6.appspot.com",
  messagingSenderId: "331826500595",
  appId: "1:331826500595:web:863e414f8d536340242484"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Secondary App for Admin tasks (creating users without logging out)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");

export const db = getFirestore(app);
export const auth = getAuth(app);
export const secondaryAuth = getAuth(secondaryApp);
