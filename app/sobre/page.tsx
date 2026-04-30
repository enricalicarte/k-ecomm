import { Metadata } from 'next';
import SobreClient from './SobreClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About | kauai archive',
  description: 'kauai archive is an editorial e-commerce and a high-end merchandising project by kauai consulting.',
};

export default async function SobrePage() {
  return (
    <main className="flex-grow bg-bone relative">
      <SobreClient />
    </main>
  );
}

