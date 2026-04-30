import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import seedData from './data/seed-data.json' with { type: 'json' };
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seed() {
  console.log('Seeding Database...');
  const productsRef = collection(db, 'products');
  let count = 0;
  for (const product of seedData.products) {
    product.sizes = String(product.sizes); // Make sure sizes is a string for the JSON parse on the client side
    await setDoc(doc(productsRef, product.slug), product);
    count++;
  }
  console.log(`Seeded ${count} products successfully.`);

  console.log('Seeding Posts...');
  const postsRef = collection(db, 'blog');
  let postCount = 0;
  for (const post of seedData.posts) {
    if (!post.createdAt) post.createdAt = new Date().toISOString();
    await setDoc(doc(postsRef, post.slug), post);
    postCount++;
  }
  console.log(`Seeded ${postCount} posts successfully.`);

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
