import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { Metadata } from 'next';
import MarcasClient from './MarcasClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Technology | kauai archive',
  description: 'Explore the curated selection of technology and ecosystems featured in kauai archive.',
};

export default async function MarcasIndex() {
  const q = query(collection(db, 'brands'));
  const querySnapshot = await getDocs(q);
  const brands: any[] = [];
  querySnapshot.forEach((doc) => {
    brands.push({ id: doc.id, ...doc.data() });
  });

  return (
    <main className="flex-grow pb-32 pt-16 bg-bone text-charcoal">
      <MarcasClient brands={brands} />
    </main>
  );
}
