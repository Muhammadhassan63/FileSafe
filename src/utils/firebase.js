import { initializeApp } from "firebase/app";
import {getStorage} from'firebase/storage'
import {getFirestore} from 'firebase/firestore';





// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app)
export const db = getFirestore(app);

