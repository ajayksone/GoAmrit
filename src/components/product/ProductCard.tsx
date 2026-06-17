"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Heart, Star, ChevronDown, Check } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: any;
  variant?: "circular" | "popular" | "collection";
}

export const ProductCard = ({ product, variant = "collection" }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.title || "500g");
  
  // Category-aware image fallback
  const titleLinks = product.title?.toLowerCase() || "";
  const defaultImage = titleLinks.includes("ghee") ? "/ghee_popular.png" :
                       titleLinks.includes("oil") ? "/oil_popular.png" :
                       titleLinks.includes("pickle") ? "/pickle_popular.png" :
                       titleLinks.includes("atta") ? "/atta_top_1.png" :
                       titleLinks.includes("pulse") || titleLinks.includes("dal") ? "/pulses_popular.png" :
                       titleLinks.includes("honey") ? "/honey-immunity.jpg" :
                       titleLinks.includes("spice") || titleLinks.includes("turmeric") ? "/top_pick_spice_1.png" : "/logo.png";

  const productThumbnail = (product.thumbnail && product.thumbnail !== "null") ? product.thumbnail : (product.images?.[0]?.url) || defaultImage;

  // Robust price fetching
  const getPrice = () => {
    const variant = product.variants?.[0];
    if (!variant) return product.price > 0 ? product.price : (titleLinks.includes("mustard oil") ? 390 : 0);
    
    // Prioritize INR price
    const inrPrice = variant.prices?.find((p: any) => p.currency_code === "inr")?.amount || 
                     variant.calculated_price?.amount || 
                     variant.prices?.[0]?.amount;
                     
    if (inrPrice) return inrPrice;

    return product.price > 0 ? product.price : (titleLinks.includes("mustard oil") ? 390 : 0);
  };

  const price = getPrice();
  const inrOriginalPrice = product.variants?.[0]?.prices?.find((p: any) => p.currency_code === "inr")?.amount;
  const originalPrice = inrOriginalPrice ? inrOriginalPrice * 1.2 : (price > 0 ? price * 1.2 : 0);
  const category = product.collection?.title || product.type?.value || "Organic";
  const rating = product.metadata?.rating || 4.9;
  const reviews = product.metadata?.reviews || (product.id ? (product.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 1500) + 100 : 120);

  if (variant === "collection") {
    return (
      <div className="group relative flex flex-col h-full bg-white transition-all duration-300">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-[#f7f7f7]">
          {/* Badge */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.metadata?.badge && (
              <span className="bg-[#1b6a4b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.metadata.badge}
              </span>
            )}
            <span className="bg-[#f28c28] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Trending
            </span>
          </div>

          {/* Wishlist */}
          <button className="absolute top-3 right-3 z-10 text-gray-400 hover:text-red-500 transition-colors">
            <Heart size={20} />
          </button>

          <Link href={`/${product.handle}`} className="block h-full w-full">
            <Image
              src={productThumbnail}
              alt={product.title}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          
          {/* Brand/Social Icon badge bottom left */}
          <div className="absolute bottom-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
            <div className="w-5 h-5 bg-[#1b6a4b] rounded-full" />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col flex-grow p-4 space-y-3">
          {/* Title & Price Row */}
          <div className="flex justify-between items-start gap-2">
            <Link href={`/${product.handle}`} className="flex-grow">
              <h3 className="text-[14px] font-bold text-gray-900 leading-tight hover:text-[#1b6a4b] transition-colors line-clamp-2 uppercase tracking-tight font-sans">
                {product.title}
              </h3>
            </Link>
            <div className="flex flex-col items-end">
              <span className="text-[14px] font-bold text-gray-900 leading-none">₹{price.toLocaleString()}</span>
              {originalPrice > price && (
                <span className="text-[11px] text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* EMI Info */}
          <p className="text-[11px] text-gray-500 font-medium">
            or ₹{Math.round(price/3).toLocaleString()}/Month Buy on EMI
          </p>

          {/* Specs / Tags */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-gray-600 font-medium lowercase">
             <span>Bilona-made</span>
             <span className="text-gray-300">|</span>
             <span>Native Breed</span>
             <span className="text-gray-300">|</span>
             <span>Stone-pressed</span>
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < Math.floor(rating) ? "fill-[#ffc107] text-[#ffc107]" : "fill-gray-200 text-gray-200"} />
              ))}
            </div>
            <span className="text-[11px] font-bold text-gray-800">{rating} | {reviews} Reviews</span>
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Variation Selector */}
          <div className="relative mt-2">
            <select 
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-[12px] font-bold text-gray-800 focus:outline-none appearance-none cursor-pointer pr-10"
            >
              {product.variants?.map((v: any, i: number) => (
                <option key={v.id || i} value={v.title || v.id}>{v.title || "Default Variant"}</option>
              )) || <option>{selectedSize}</option>}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-[#392010] text-white py-3 rounded text-[12px] font-bold uppercase tracking-widest hover:bg-[#2a170c] transition-colors mt-2">
            ADD TO CART
          </button>
        </div>
      </div>
    );
  }

  if (variant === "popular") {
    return (
      <div className="group relative bg-white border border-brand-sand/30 overflow-hidden transition-all duration-500 hover:shadow-2xl">
        {/* Badge */}
        <div className="absolute top-0 left-0 z-20 px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black italic tracking-widest shadow-lg">
          {product.metadata?.badge || "BEST SELLER"}
        </div>

        {/* Wishlist */}
        <button className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-brand-deep/30 hover:text-red-500 transition-colors">
          <Heart size={16} />
        </button>

        {/* Product Image */}
        <Link href={`/${product.handle}`} className="relative aspect-[4/5] block bg-[#f3f4f6]">
          <Image
            src={productThumbnail}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>

        {/* Info */}
        <div className="p-4 space-y-4">
          <div className="min-h-[3rem]">
             <h3 className="text-[15px] font-bold leading-tight text-brand-deep group-hover:text-brand-primary transition-colors line-clamp-2 uppercase tracking-tight">
               {product.title}
             </h3>
          </div>

          <div className="flex justify-between items-baseline">
             <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="fill-brand-gold text-brand-gold" />
                ))}
                <span className="text-[10px] text-brand-deep/40 pl-1">{rating} | {reviews} Reviews</span>
             </div>
             <span className="font-bold text-lg text-brand-deep">₹{price.toLocaleString()}</span>
          </div>

          {/* Size Selector */}
          <div className="relative">
            <select 
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-[#f9fafb] border border-brand-sand/50 rounded-lg px-4 py-2 text-[12px] font-bold text-brand-deep focus:outline-none appearance-none cursor-pointer"
            >
              {product.variants?.map((v: any, i: number) => (
                <option key={v.id || i} value={v.title}>{v.title}</option>
              )) || <option>{selectedSize}</option>}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-deep/40 pointer-events-none" />
          </div>

          {/* Add to Cart / Notify Me */}
          <button className={`w-full py-4 text-[13px] font-black uppercase tracking-widest transition-all active:scale-[0.98] rounded-md shadow-lg ${
            product.status === "out_of_stock" 
              ? 'bg-[#392010] text-white hover:bg-black shadow-black/20' 
              : 'bg-[#392010] text-white hover:bg-black shadow-black/10'
          }`}>
            {product.status === "out_of_stock" ? "NOTIFY ME" : "ADD TO CART"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-premium flex flex-col h-full border border-brand-cream/10">
      {/* Image Section */}
      <Link href={`/${product.handle}`} className="relative h-64 sm:h-72 flex items-center justify-center p-6 bg-brand-cream/30 block shrink-0">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-700">
          <Image
            src={productThumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-brand-deep/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none" />
      </Link>

      {/* Content Section */}
      <div className="p-6 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] uppercase tracking-widest font-bold text-brand-gold">{category}</span>
          <button className="text-brand-deep/40 hover:text-red-400 transition-colors hidden sm:block">
            <Heart size={18} />
          </button>
        </div>
        
        <Link href={`/${product.handle}`} className="group-hover:text-brand-primary transition-colors">
          <h3 className="text-lg font-bold leading-tight serif mb-2 line-clamp-2 min-h-[3rem] text-brand-deep">{product.title}</h3>
        </Link>
        
        <p className="text-sm text-brand-deep/60 line-clamp-2 mb-6 grow leading-relaxed">{product.subtitle || product.description || "Premium organic product sourced directly from sustainable farms."}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-brand-cream/50 mt-auto">
          <span className="text-xl font-bold serif text-brand-deep">₹{price.toLocaleString()}</span>
          <button className="bg-brand-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-deep hover:scale-110 transition-premium shadow-lg shadow-brand-primary/20 group/btn active:scale-95">
             <Plus size={20} className="transition-transform group-hover/btn:rotate-90 duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
