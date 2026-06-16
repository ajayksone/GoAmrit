"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ShoppingBag, Star, Loader2, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface RelatedProductsSidebarProps {
  products: any[];
}

export const RelatedProductsSidebar = ({ products }: RelatedProductsSidebarProps) => {
  const { addItem } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleAddToCart = async (product: any) => {
    const variantId = product.variants?.[0]?.id;
    if (!variantId) return;

    setAddingId(product.id);
    try {
      await addItem(variantId, 1);
      setSuccessId(product.id);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingId(null);
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-brand-sand/30 shadow-sm overflow-hidden relative group">
      <div className="relative z-10">
        <h5 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-4 text-center">The Collection</h5>
        <h3 className="text-2xl font-black serif italic tracking-tighter mb-10 text-brand-deep text-center">Related Products</h3>
        
        <div className="space-y-12">
          {products.map((product) => {
            const price = product.variants?.[0]?.prices?.find((p: any) => p.currency_code === "inr")?.amount || 0;
            const isAdding = addingId === product.id;
            const isSuccess = successId === product.id;
            const rating = 4.8; // Static for now as in the image

            return (
              <div key={product.id} className="flex flex-col items-center group/item text-center">
                <Link 
                  href={`/shop/${product.handle}`} 
                  className="relative w-full aspect-square rounded-3xl overflow-hidden bg-brand-cream/10 border border-brand-sand/10 mb-6"
                >
                  <Image 
                    src={product.thumbnail || product.images?.[0]?.url || ""} 
                    alt={product.title} 
                    fill 
                    className="object-contain p-4 group-hover/item:scale-105 transition-transform duration-700"
                  />
                </Link>
                
                <div className="space-y-3 px-2">
                  <Link href={`/shop/${product.handle}`}>
                    <h4 className="text-[15px] font-extrabold text-[#392010] leading-tight hover:text-brand-primary transition-colors uppercase tracking-tight">
                      {product.title}
                    </h4>
                  </Link>
                  
                  {/* Star Rating */}
                  <div className="flex items-center justify-center gap-x-1.5">
                    <div className="flex text-brand-gold">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={12} fill="currentColor" />
                       ))}
                    </div>
                    <span className="text-[12px] font-bold text-gray-400">{rating}</span>
                  </div>

                  <div className="text-[20px] font-black text-brand-deep">
                    ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={isAdding}
                    className={`w-full mt-4 flex items-center justify-center gap-x-3 py-4 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all active:scale-[0.98] ${
                      isSuccess 
                        ? 'bg-green-500 text-white' 
                        : 'bg-[#392010] text-white hover:bg-black shadow-lg shadow-black/10'
                    }`}
                  >
                    {isAdding ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isSuccess ? (
                      <Check size={16} />
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span>Buy Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <Link 
          href="/shop" 
          className="mt-16 block text-center py-5 bg-brand-cream/30 text-brand-deep font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-brand-primary hover:text-white transition-all border border-brand-sand/20"
        >
          View Full Store
        </Link>
      </div>
    </div>
  );
};
