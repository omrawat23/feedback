
import { initializeApp, getApps, getApp  } from 'firebase/app';
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAfGkkYjPKyHWQlTPfrCG3ZrJLSZUn7nIg",
    authDomain: "feedbackify-1040f.firebaseapp.com",
    projectId: "feedbackify-1040f",
    storageBucket: "feedbackify-1040f.appspot.com",
    messagingSenderId: "142263422309",
    appId: "1:142263422309:web:79851f077f9952e0d0258c",
    measurementId: "G-MYS5E88KFX"
  };



const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, db, storage };
