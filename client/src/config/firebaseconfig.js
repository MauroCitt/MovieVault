// firebaseconfig.js
import { initializeApp } from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyBoJvSqSwCM7GDVPu0th5a87pYQZrpijqY",
  authDomain: "imagesmovievault.firebaseapp.com",
  projectId: "imagesmovievault",
  storageBucket: "imagesmovievault.appspot.com",
  messagingSenderId: "909597169691",
  appId: "1:909597169691:web:0fb102f1fef03926a740be",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;