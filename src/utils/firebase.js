import { initializeApp } from "firebase/app";
import {getStorage} from'firebase/storage'
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyASQJF-yGB8SO9usC_TN5jnvC5JkoSvyPw",
  authDomain: "blog-4c3b3.firebaseapp.com",
  projectId: "blog-4c3b3",
  storageBucket: "blog-4c3b3.appspot.com",
  messagingSenderId: "346255023146",
  appId: "1:346255023146:web:b9cd93fa2ba1bf49dc7753"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)
export const db = getFirestore(app);

