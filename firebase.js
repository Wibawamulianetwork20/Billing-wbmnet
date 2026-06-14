import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbUE5grCTF86R4Dj7NE_i1Vcmzic67u2U",
  authDomain: "billing-wbm-net.firebaseapp.com",
  projectId: "billing-wbm-net",
  storageBucket: "billing-wbm-net.firebasestorage.app",
  messagingSenderId: "155140597764",
  appId: "1:155140597764:web:01318d797f15c85d62ad51"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);