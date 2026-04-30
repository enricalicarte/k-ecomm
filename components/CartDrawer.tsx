'use client';
import { useCart } from './CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-[1001]" 
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[1002] flex flex-col transform transition-transform duration-300">
        <div className="flex justify-between items-center p-6 border-b border-charcoal/10">
          <h2 className="font-sans text-2xl tracking-tighter uppercase font-bold">Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-sm uppercase tracking-widest hover:text-charcoal/60">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center">
              <p className="text-charcoal/50 uppercase tracking-widest text-sm mb-6">Your cart is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="border border-charcoal px-6 py-3 uppercase tracking-widest text-xs font-bold hover:bg-charcoal hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0">
                    <Image src={item.image} fill className="object-cover" alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-1">{item.brand}</p>
                      <h3 className="font-sans font-bold leading-tight uppercase line-clamp-1">{item.name}</h3>
                      {item.size && <p className="text-xs uppercase tracking-widest text-charcoal/60 mt-1">Size: {item.size}</p>}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-charcoal/20">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                        <span className="px-3 text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                      </div>
                      <p className="font-sans font-bold">€{item.price * item.quantity}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-xs uppercase tracking-widest text-charcoal/40 hover:text-red-500 underline ml-2">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-charcoal/10 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="uppercase tracking-widest text-sm font-bold">Subtotal</span>
              <span className="font-sans text-xl font-bold">€{cartTotal}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-charcoal text-white py-4 text-center uppercase tracking-widest text-xs font-bold hover:bg-charcoal/90 transition-colors block"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
