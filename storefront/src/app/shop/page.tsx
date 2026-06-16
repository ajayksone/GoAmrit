"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Filter, ChevronDown, List, Grid, Search, SlidersHorizontal, RefreshCcw, Leaf, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { sdk } from "@/lib/medusa";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { products } = await sdk.store.product.list();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["All", "Dairy", "Oils", "Sweeteners", "Spices", "Grains", "Gourmet"];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.categories?.some((c: any) => c.name === activeCategory));

  return (
    <div className="bg-brand-cream/30 min-h-[calc(100vh-80px)]">
      {/* Search & Header Banner */}
      <section className="bg-white border-b border-brand-sand py-16 text-center shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold serif mb-4 tracking-tight">Our Full Harvest</h1>
          <p className="text-brand-deep/60 max-w-lg mx-auto mb-10 text-sm md:text-base italic leading-relaxed">Discover organic products crafted with ancient wisdom and modern transparency, delivered straight from GoAmrit farms.</p>
          
          <div className="relative max-w-md mx-auto group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-deep/40 group-focus-within:text-brand-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search honey, ghee, spices..." 
              className="w-full bg-brand-cream/40 border border-brand-sand/50 rounded-full py-5 pl-16 pr-8 text-sm focus:bg-white focus:border-brand-primary/30 focus:shadow-xl transition-premium outline-none"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Navigation & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 px-2">
          {/* Breadcrumbs (Visual Only) */}
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-[0.2em] text-brand-deep/40">
            <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-deep font-black italic">Shop All</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center space-x-3 bg-white px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-brand-deep border border-brand-sand/50 hover:bg-brand-deep hover:text-white transition-premium group"
             >
                <SlidersHorizontal size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                <span>Filters</span>
             </button>

             <div className="relative group/sort min-w-[180px]">
                <button className="w-full flex items-center justify-between space-x-3 bg-white px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-brand-deep border border-brand-sand/50">
                   <span>Sort: {sortBy}</span>
                   <ChevronDown size={14} />
                </button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className={`lg:block ${isSidebarOpen ? 'block fixed inset-0 z-[60] bg-brand-cream/95 p-8 overflow-y-auto animate-fadeIn' : 'hidden'} lg:static`}>
            {isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden mb-8 flex items-center space-x-2 text-brand-deep/60">
                 <RefreshCcw size={16} />
                 <span className="text-xs uppercase font-black">Close Filters</span>
              </button>
            )}

            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-deep mb-8 pb-3 border-b border-brand-sand/50 italic">Shop by Category</h3>
                <ul className="space-y-4">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button 
                        onClick={() => {
                          setActiveCategory(cat);
                          if(isSidebarOpen) setIsSidebarOpen(false);
                        }}
                        className={`text-sm tracking-wide font-medium transition-premium ${activeCategory === cat ? 'text-brand-primary font-bold flex items-center before:content-[""] before:w-1.5 before:h-1.5 before:bg-brand-primary before:rounded-full before:mr-3' : 'text-brand-deep/60 hover:text-brand-deep'}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-deep mb-8 pb-3 border-b border-brand-sand/50 italic">Price Filter</h3>
                <div className="space-y-3">
                    {["Under ₹500", "₹500 - ₹1000", "₹1000 - ₹2000", "Above ₹2000"].map(price => (
                      <label key={price} className="flex items-center group cursor-pointer">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-brand-primary border-brand-sand rounded focus:ring-0" />
                        <span className="ml-3 text-sm text-brand-deep/60 group-hover:text-brand-deep transition-colors tracking-wide">{price}</span>
                      </label>
                    ))}
                </div>
              </div>

              <div className="bg-brand-deep rounded-3xl p-8 text-white space-y-4 shadow-xl">
                 <Leaf className="text-brand-gold" size={24} />
                 <h4 className="text-xl serif font-bold leading-tight">Farmer's Guarantee</h4>
                 <p className="text-xs text-brand-cream/70 leading-relaxed font-light">Every product in your cart supports a direct farm-to-door network, ensuring zero middlemen and maximum nourishment.</p>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
             {isLoading ? (
               <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-6">
                 <Loader2 size={48} className="text-brand-primary animate-spin" />
                 <p className="text-brand-deep/40 font-bold uppercase tracking-widest text-xs">Harvesting your selection...</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-24 text-center space-y-4">
                      <RefreshCcw size={48} className="mx-auto text-brand-sand animate-spin-slow" />
                      <h3 className="text-2xl font-bold serif">No products found</h3>
                      <p className="text-brand-deep/40">Try adjusting your filters or search terms.</p>
                    </div>
                  )}
               </div>
             )}

             {/* Pagination */}
             <div className="mt-24 pt-12 border-t border-brand-sand/50 flex items-center justify-center space-x-4">
                <button className="w-12 h-12 rounded-full flex items-center justify-center border border-brand-sand/50 text-brand-deep/40 hover:bg-brand-deep hover:text-white transition-premium group">1</button>
                <button className="w-12 h-12 rounded-full flex items-center justify-center border border-brand-sand/50 text-brand-deep/40 hover:bg-brand-deep hover:text-white transition-premium group">2</button>
                <button className="w-12 h-12 rounded-full flex items-center justify-center border border-brand-sand/50 text-brand-deep/40 hover:bg-brand-deep hover:text-white transition-premium group">3</button>
                <span className="text-brand-deep/20 text-[10px] font-black uppercase tracking-widest px-4">Next Page...</span>
             </div>
          </main>
        </div>
      </div>
    </div>
  );
}
