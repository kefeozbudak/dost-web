import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

const envConfig = dotenv.parse(readFileSync('.env.example'));
// Use actual .env if it exists, otherwise we can't connect, but we only have client SDK, not admin SDK.
