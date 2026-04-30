import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function check() {
  const collections = ["products", "brands", "blog", "carousels", "cms", "analytics", "users"];
  for (const c of collections) {
    try {
      await getDocs(collection(db, c));
      console.log(`${c}: OK`);
    } catch (e) {
      if (e instanceof Error) console.log(`${c}: `, e.message);
    }
  }
}
check();
