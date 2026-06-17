"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Minus, Plus, Trash2, Truck, ShieldCheck, CreditCard, Leaf, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, isLoading, removeItem, updateItem } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <Loader2 size={48} className="text-brand-primary animate-spin" />
        <p className="text-brand-deep/40 font-bold uppercase tracking-widest text-xs">Reviewing your selections...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.item_subtotal || 0;
  const shipping = cart?.shipping_total || 0;
  const tax = cart?.tax_total || 0;
  const total = cart?.total || 0;

  return (
    <div className="bg-brand-cream/20 min-h-screen py-12 lg:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold serif mb-16 tracking-tight flex items-center gap-4">
          <ShoppingBag size={42} className="text-brand-primary" />
          <span>Basket of <span className="italic">Wellness.</span></span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Main Cart Items */}
          <div className="lg:col-span-8 space-y-8">
            {items.length > 0 ? (
              <div className="space-y-6">
                {items.map((item: any) => (
                  <div key={item.id} className="group bg-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8 shadow-sm hover:shadow-xl transition-premium border border-brand-sand/30 relative">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-6 right-6 text-brand-deep/20 hover:text-red-500 transition-colors hidden sm:block"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-brand-cream/50 relative">
                       <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
                    </div>
                    
                    <div className="flex-grow flex flex-col sm:flex-row justify-between w-full h-full min-h-[140px]">
                       <div className="space-y-2 flex flex-col justify-between">
                         <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">{item.variant?.product?.type?.value || "Organic"}</span>
                            <h3 className="text-xl font-bold serif leading-tight tracking-tight text-brand-deep/80">{item.title}</h3>
                            <p className="text-brand-deep/40 text-[10px] uppercase font-bold tracking-wider pt-1">{item.variant?.title}</p>
                         </div>
                         <div className="flex items-center space-x-4 pt-4 text-brand-primary/60 uppercase font-black tracking-widest text-[9px]">
                            <span className="flex items-center gap-2"><Truck size={12} /> Standard Handling</span>
                            <span className="flex items-center gap-2"><Leaf size={12} /> Sustainable Packaging</span>
                         </div>
                       </div>

                       <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end mt-8 sm:mt-0 text-right">
                          <span className="text-2xl font-bold serif text-brand-deep tracking-tighter mb-2 italic">₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                          
                          <div className="inline-flex items-center border border-brand-sand/50 rounded-full bg-brand-cream/20 p-1 group">
                             <button 
                               onClick={() => updateItem(item.id, item.quantity - 1)}
                               className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white text-brand-deep/40 transition-premium"
                             >
                                <Minus size={14} />
                             </button>
                             <span className="w-10 text-center text-sm font-bold tracking-widest tabular-nums">{item.quantity}</span>
                             <button 
                               onClick={() => updateItem(item.id, item.quantity + 1)}
                               className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white text-brand-deep/40 transition-premium"
                             >
                                <Plus size={14} />
                             </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-xs font-bold text-red-500 underline sm:hidden mt-4"
                          >
                            Remove Item
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-24 text-center space-y-12 shadow-sm border border-brand-sand/20">
                 <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                   <div className="absolute inset-0 bg-brand-gold/10 rounded-full animate-pulse" />
                   <div className="relative bg-brand-gold text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl">
                     <ShoppingBag size={32} />
                   </div>
                 </div>
                 <div className="space-y-4 italic">
                    <h3 className="text-3xl font-bold serif text-brand-deep">Your bag feels <span className="text-brand-gold">quite light.</span></h3>
                    <p className="text-brand-deep/40 max-w-sm mx-auto leading-relaxed font-light">Bring the essence of organic wellness to your home. Explore our collections for pure, handcrafted goodness.</p>
                 </div>
                 <Link href="/shop" className="inline-flex items-center space-x-4 bg-brand-primary text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-deep transition-premium shadow-xl shadow-brand-primary/20">
                    <span>Explore Harvest</span>
                    <ArrowRight size={14} />
                 </Link>
              </div>
            )}
          </div>

          {/* Checkout Summary */}
          <aside className="lg:col-span-4 sticky top-32 space-y-8">
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-brand-sand/30 space-y-8">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-deep border-b border-brand-sand/50 pb-4 italic">Bag Totals</h3>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-light text-brand-deep/60 tracking-wider">
                    <span>Initial Selection</span>
                    <span className="font-bold text-brand-deep">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-light text-brand-deep/60 tracking-wider">
                    <span>Farm Surcharge & Delivery</span>
                    <span className={`font-bold ${shipping === 0 ? "text-brand-primary italic" : "text-brand-deep"}`}>{shipping === 0 ? "Complimentary" : "₹" + shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-light text-brand-deep/60 tracking-wider">
                    <span>Organic Tax (EST)</span>
                    <span className="font-bold text-brand-deep">₹{tax.toLocaleString()}</span>
                  </div>
               </div>

               <div className="pt-8 border-t border-brand-sand/50 flex justify-between items-baseline">
                  <span className="text-lg font-bold serif uppercase tracking-widest text-brand-deep">Total Price</span>
                  <span className="text-4xl font-bold serif text-brand-deep tracking-tighter italic">₹{total.toLocaleString()}</span>
               </div>

               <Link href="/checkout" className="w-full bg-brand-primary text-brand-cream py-6 rounded-full font-bold uppercase tracking-widest text-xs text-center flex items-center justify-center gap-4 hover:bg-brand-deep transition-premium shadow-2xl shadow-brand-primary/30 group">
                  <span>Commit To Checkout</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
               </Link>

               <div className="flex items-center justify-center space-x-6 pt-4 text-[10px] font-black uppercase tracking-widest text-brand-deep/20">
                  <div className="flex items-center gap-1"><CreditCard size={12} /> Secure Gateway</div>
                  <div className="flex items-center gap-1"><ShieldCheck size={12} /> Verified Organic</div>
               </div>
            </div>

            <div className="bg-brand-gold/10 rounded-3xl p-8 border border-brand-gold/20 flex items-start gap-5 group">
                <Truck className="text-brand-gold mt-1 group-hover:translate-x-12 transition-transform duration-1000 overflow-visible" size={28} />
                <div className="space-y-2 italic">
                   <h4 className="text-sm font-black uppercase tracking-widest text-brand-deep">Farmer's Fast Delivery</h4>
                   <p className="text-[10px] text-brand-deep/60 font-light leading-relaxed italic">Pure harvested items delivered within 48 hours to preserve bioactive nutrients.</p>
                </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
