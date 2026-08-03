import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

const envConfig = dotenv.parse(readFileSync('.env.example'));

// Let's use a script to check the db via firebase tool if we had one.
// Wait, we can't run firebase directly from node if we don't have the keys.
// But we are in the app directory, and we don't have admin access.
