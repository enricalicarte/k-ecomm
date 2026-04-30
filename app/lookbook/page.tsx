import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { Metadata } from 'next';
import LookbookClient from './LookbookClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'studio | Studio K',
  description: 'Explore the curated selection.',
};

export default async function LookbookIndex() {
  const q = query(collection(db, 'products'));
  const querySnapshot = await getDocs(q);
  const products: any[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });

  return (
    <main className="flex-grow bg-bone text-charcoal">
      <LookbookClient products={products} />
    </main>
  );
}
