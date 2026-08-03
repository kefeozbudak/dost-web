import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

// Read firebase-applet-config.json
const configRaw = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configRaw);

// Initialize Firebase
const app = initializeApp(config.firebaseConfig || config);
const db = getFirestore(app, config.firestoreDatabaseId);

console.log("We can't run this without admin rights, but the frontend will do it!");
