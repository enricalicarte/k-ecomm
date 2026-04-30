import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function check() {
  const qs = await getDocs(collection(db, 'products'));
  console.log('Docs found:', qs.size);
  let count = 0;
  for (let d of qs.docs) {
    console.log(d.id);
    if (!d.id.startsWith('kwa') && d.id !== 'test-product') {
       await deleteDoc(d.ref);
       count++;
    }
  }
  if (count > 0) console.log(`Deleted ${count} old documents.`);
  process.exit(0);
}
check();
