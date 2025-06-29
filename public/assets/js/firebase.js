import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyC8KE1utnuMfD7amK_zxnv5bpJAg_Vd1v8",
    authDomain: "ev-recharge-bunk-c4a27.firebaseapp.com",
    projectId: "ev-recharge-bunk-c4a27",
    storageBucket: "ev-recharge-bunk-c4a27.firebasestorage.app",
    messagingSenderId: "551434617288",
    appId: "1:551434617288:web:599ee71d9e5e139cea80fd",
    measurementId: "G-H2TTMN2XYZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };