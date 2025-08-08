// src/firebase.js
import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBTAD_RobH7Pmo6PvfHEnYK5ZaDk1vmS_U",
  authDomain: "maxol-restock.firebaseapp.com",
  projectId: "maxol-restock",
  storageBucket: "maxol-restock.appspot.com", // ← fix
  messagingSenderId: "843251877812",
  appId: "1:843251877812:web:02ee058376528f210614e1",
  measurementId: "G-NMDQXSV9DY"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const dataRef = doc(db, 'appData', 'data');

export async function subscribeToData(onChange) {
  try {
    await signInAnonymously(auth);
    console.log('Auth OK. uid =', auth.currentUser?.uid, 'project =', getApp().options.projectId);
  } catch (e) {
    console.error('Anonymous sign-in FAILED:', e);
    throw e;
  }

  return onSnapshot(
    dataRef,
    (snap) => {
      console.log('onSnapshot fired. exists =', snap.exists());
      onChange(snap.exists() ? snap.data() : null);
    },
    (err) => {
      console.error('onSnapshot error:', err);
    }
  );
}

export async function saveData(data) {
  try {
    await setDoc(dataRef, data, { merge: false }); // overwrite doc
    console.log('saveData -> success', data);
  } catch (e) {
    console.error('saveData -> FAILED', e);
    throw e;
  }
}
