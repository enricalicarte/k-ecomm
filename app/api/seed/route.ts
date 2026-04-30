import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import seedData from '@/data/seed-data.json';

export async function GET() {
  try {
    const productsRef = collection(db, 'products');
    
    // Seed products
    for (const product of seedData.products) {
      await setDoc(doc(productsRef, product.slug), product);
    }
    
    return NextResponse.json({ success: true, count: seedData.products.length });
  } catch (error) {
    console.error("Error seeding database", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
