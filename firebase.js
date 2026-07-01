import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMFSfXn8InrFFJvtECPUmYzdp0gbuZwP8",
  authDomain: "one-roof-retail-store-aeb3d.firebaseapp.com",
  projectId: "one-roof-retail-store-aeb3d",
  storageBucket: "one-roof-retail-store-aeb3d.firebasestorage.app",
  messagingSenderId: "407344440612",
  appId: "1:407344440612:web:efc2d688b4f3c85e4fffb1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
