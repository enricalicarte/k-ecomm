import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = firebaseConfig.firestoreDatabaseId ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : getFirestore(app);

async function run() {
  await setDoc(doc(db, 'cms', 'homepage'), {
    menuShopTitle: 'K shop',
    menuLookbookTitle: 'studio',
    menuGazetteTitle: 'editorial'
  }, { merge: true });
  console.log('Done');
}
run().catch(console.error);
