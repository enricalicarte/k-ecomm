'use client';
import { useCart } from '@/components/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      // Simulate order processing
      clearCart();
      setStep(3);
    }
  };

  if (step === 3) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto py-32">
        <div className="w-20 h-20 bg-charcoal text-white rounded-full flex items-center justify-center text-4xl mb-8">
          ✓
        </div>
        <h1 className="font-sans text-5xl tracking-tighter uppercase font-bold mb-4">Order Confirmed</h1>
        <p className="text-charcoal/70 mb-8 uppercase tracking-widest text-sm">Thank you for your purchase. You will receive an email shortly.</p>
        <Link href="/catalogo" className="bg-charcoal text-white px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-charcoal/90 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto py-32">
        <h1 className="font-sans text-4xl tracking-tighter uppercase font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/catalogo" className="border border-charcoal px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-charcoal hover:text-white transition-colors">
          Browse Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full">
      {/* Checkout Form */}
      <div className="w-full lg:w-3/5 p-6 md:p-12 lg:pr-24 lg:py-24 border-r border-charcoal/10">
        <h1 className="font-sans text-5xl tracking-tighter uppercase font-bold mb-12">Checkout</h1>
        
        <div className="flex gap-4 mb-12 border-b border-charcoal/10 pb-4">
           <button onClick={() => setStep(1)} className={`uppercase tracking-widest text-xs font-bold pb-4 border-b-2 ${step === 1 ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal/40'}`}>
             1. Information
           </button>
           <button onClick={() => setStep(2)} className={`uppercase tracking-widest text-xs font-bold pb-4 border-b-2 ${step === 2 ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal/40'}`} disabled={step === 1}>
             2. Payment
           </button>
        </div>

        <form onSubmit={handleCheckout} className="space-y-8 flex flex-col items-center pt-8">
           {step === 1 && (
             <div className="space-y-8 w-full max-w-xl text-left">
                <div>
                  <h2 className="text-lg font-sans font-bold uppercase tracking-tight mb-4">Contact</h2>
                  <input type="email" placeholder="Email Address" required className="w-full border border-charcoal/20 p-4 bg-transparent outline-none focus:border-charcoal font-sans text-sm" />
                </div>
                <div>
                  <h2 className="text-lg font-sans font-bold uppercase tracking-tight mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" required className="w-full border border-charcoal/20 p-4 bg-transparent outline-none focus:border-charcoal font-sans text-sm col-span-2 md:col-span-1" />
                    <input type="text" placeholder="Last Name" required className="w-full border border-charcoal/20 p-4 bg-transparent outline-none focus:border-charcoal font-sans text-sm col-span-2 md:col-span-1" />
                    <input type="text" placeholder="Address" required className="w-full border border-charcoal/20 p-4 bg-transparent outline-none focus:border-charcoal font-sans text-sm col-span-2" />
                    <input type="text" placeholder="City" required className="w-full border border-charcoal/20 p-4 bg-transparent outline-none focus:border-charcoal font-sans text-sm col-span-2 md:col-span-1" />
                    <input type="text" placeholder="Postcode" required className="w-full border border-charcoal/20 p-4 bg-transparent outline-none focus:border-charcoal font-sans text-sm col-span-2 md:col-span-1" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-charcoal text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-black transition-colors mt-8">
                   Continue to Payment
                </button>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-8 w-full max-w-xl text-left">
                <div>
                  <h2 className="text-lg font-sans font-bold uppercase tracking-tight mb-4">Payment Method</h2>
                  <div className="border border-charcoal/20 p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <input type="radio" id="card" name="payment" defaultChecked className="accent-charcoal w-4 h-4" />
                      <label htmlFor="card" className="font-bold uppercase tracking-widest text-sm">Credit Card</label>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-charcoal/10">
                       <input type="text" placeholder="Card Number" required className="w-full border border-charcoal/20 p-4 bg-transparent outline-none focus:border-charcoal font-sans text-sm" />
                       <div className="grid grid-cols-2 gap-4">
                         <input type="text" placeholder="MM / YY" required className="w-full border border-charcoal/20 p-4 bg-transparent outline-none focus:border-charcoal font-sans text-sm" />
                         <input type="text" placeholder="CVC" required className="w-full border border-charcoal/20 p-4 bg-transparent outline-none focus:border-charcoal font-sans text-sm" />
                       </div>
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-charcoal text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-black transition-colors mt-8">
                   Pay €{cartTotal}
                </button>
             </div>
           )}
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-2/5 p-6 md:p-12 lg:pl-16 lg:py-24 bg-gray-50 flex flex-col h-full self-stretch min-h-[500px]">
        <h2 className="font-sans font-bold uppercase tracking-tighter text-2xl mb-8">Order Summary</h2>
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-4 mb-8">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative w-20 h-24 bg-gray-200 flex-shrink-0">
                <Image src={item.image} fill className="object-cover" alt={item.name} referrerPolicy="no-referrer" />
                <span className="absolute -top-2 -right-2 bg-charcoal text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] z-10">{item.quantity}</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-charcoal/50 uppercase tracking-widest mb-1">{item.brand}</p>
                <h3 className="font-sans font-bold uppercase leading-tight line-clamp-1">{item.name}</h3>
                {item.size && <p className="text-[10px] uppercase tracking-widest text-charcoal/60 mt-1">Size: {item.size}</p>}
              </div>
              <p className="font-sans font-bold text-lg">€{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4 pt-6 border-t border-charcoal/20">
          <div className="flex justify-between items-center text-sm uppercase tracking-widest text-charcoal/60">
            <span>Subtotal</span>
            <span>€{cartTotal}</span>
          </div>
          <div className="flex justify-between items-center text-sm uppercase tracking-widest text-charcoal/60">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-charcoal/10 font-bold text-xl uppercase tracking-tighter">
            <span>Total</span>
            <span>€{cartTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
