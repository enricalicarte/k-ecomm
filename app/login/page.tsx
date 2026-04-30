'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      
      const user = auth.currentUser;
      if (user) {
        const { doc, getDoc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'admin' // Create as admin by default for demo
          }, { merge: true });
        }
      }
      
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center bg-bone px-6 py-20 min-h-[calc(100vh-70px)]">
      <div className="bg-white p-10 md:p-16 border border-charcoal/10 max-w-md w-full text-center brutalist-border paper-shadow">
        <h1 className="font-serif text-3xl text-charcoal mb-4 font-light italic">kauai archive</h1>
        <p className="text-charcoal/50 text-[9px] uppercase tracking-[0.2em] mb-10 pb-4 border-b border-charcoal/10">Authorized Personnel Only</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 text-xs mb-8 border border-red-200 uppercase tracking-widest font-mono">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-charcoal text-bone py-5 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-sage-green transition-colors disabled:opacity-50 flex items-center justify-center gap-3 brutalist-border"
        >
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>
      </div>
    </main>
  );
}
