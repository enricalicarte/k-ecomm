import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fix() {
  const customDb = firebaseConfig.firestoreDatabaseId ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : getFirestore(app);
  const productsSnap = await getDocs(collection(customDb, 'products'));
  for (const productDoc of productsSnap.docs) {
    const data = productDoc.data();
    if (data.image && data.image.includes('1601625902161')) {
      console.log('fixing product', productDoc.id);
      await updateDoc(doc(customDb, 'products', productDoc.id), {
        image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=1400'
      });
    }
  }

  const blogSnap = await getDocs(collection(customDb, 'blog'));
  for (const postDoc of blogSnap.docs) {
    const data = postDoc.data();
    if (data.image && data.image.includes('1601625902161')) {
      console.log('fixing post', postDoc.id);
      await updateDoc(doc(customDb, 'blog', postDoc.id), {
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1400'
      });
    }
  }

  try {
    const cmsSnap = await getDocs(collection(customDb, 'cms'));
    for (const pageDoc of cmsSnap.docs) {
      const data = pageDoc.data();
      const stringifiedData = JSON.stringify(data);
      if (stringifiedData.includes('1601625902161')) {
        console.log('fixing cms', pageDoc.id);
        const fixedData = JSON.parse(stringifiedData.replace(/1601625902161-591b644158f9/g, '1503454537195-1dcabb73ffb9'));
        await updateDoc(doc(customDb, 'cms', pageDoc.id), fixedData);
      }
    }
  } catch(e) { console.error(e) }

  try {
    const layoutsSnap = await getDocs(collection(customDb, 'page_layouts'));
    for (const pageDoc of layoutsSnap.docs) {
      const data = pageDoc.data();
      const stringifiedData = JSON.stringify(data);
      if (stringifiedData.includes('1601625902161')) {
        console.log('fixing page_layouts', pageDoc.id);
        const fixedData = JSON.parse(stringifiedData.replace(/1601625902161-591b644158f9/g, '1503454537195-1dcabb73ffb9'));
        await updateDoc(doc(customDb, 'page_layouts', pageDoc.id), fixedData);
      }
    }
  } catch(e) { console.error(e) }
}
fix().then(() => {
    console.log('done');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
