"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, RefreshCcw, SlidersHorizontal, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { sdk } from "@/lib/medusa";

interface CategoryClientProps {
  slug: string;
  categoryInfo: { name: string; description: string };
}

export default function CategoryClient({ slug, categoryInfo }: CategoryClientProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Recommended");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { products } = await sdk.store.product.list({
           region_id: "reg_01KMMD54SSHGRN8HK9F6HECMJT", // India Region ID
           fields: "*variants,*variants.prices,*variants.calculated_price"
        });
        
        // Simple filtering mechanism: match title, description, or category name
        const searchTerms = categoryInfo.name.toLowerCase().split(' ');
        const filtered = products.filter((p: any) => {
           const pStr = `${p.title} ${p.description || ''}`.toLowerCase();
           return searchTerms.some(term => pStr.includes(term)) || 
                  p.categories?.some((c: any) => c.name.toLowerCase().includes(slug.replace('-', ' ')));
        });
        
        // If strict filtering returns empty, we return all products for demo purposes 
        setProducts(filtered.length > 0 ? filtered : products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) {
      fetchProducts();
    }
  }, [slug, categoryInfo.name]);

  return (
    <div className="bg-[#fcf8f3] min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-wider text-gray-500 font-medium">
          <Link href="/" className="hover:text-[#392010] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800">{categoryInfo.name}</span>
        </nav>
      </div>

      {/* Category Header */}
      <header className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-serif">{categoryInfo.name}</h1>
        {!isLoading && (
          <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">{products.length} products</p>
        )}
      </header>

      {/* Filter & Sort Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm mt-4">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button className="flex items-center space-x-2 text-[13px] font-bold uppercase tracking-widest text-[#392010] hover:opacity-80 transition-opacity">
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center space-x-1 text-[13px] font-bold uppercase tracking-widest text-[#392010] cursor-pointer hover:opacity-80 transition-opacity">
            <span>Sort: {sortBy}</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Product Grid */}
        <main>
            {isLoading ? (
              <div className="py-40 flex flex-col items-center justify-center space-y-6">
                  <Loader2 size={48} className="text-[#392010] animate-spin" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Harvesting {categoryInfo.name}...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} variant="collection" />
                  ))}
                  
                  {products.length === 0 && (
                    <div className="col-span-full py-24 text-center space-y-4">
                        <RefreshCcw size={48} className="mx-auto text-gray-200 animate-spin-slow" />
                        <h3 className="text-2xl font-bold font-serif text-gray-800">No products found</h3>
                        <p className="text-gray-500">We are restocking our fresh {categoryInfo.name} soon.</p>
                    </div>
                  )}
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
