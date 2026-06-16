"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, ShoppingBag, Heart, Star, CheckCircle2, Leaf, ShieldIcon, HelpCircle, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ 
  product, 
  relatedProducts 
}: { 
  product: any, 
  relatedProducts: any[] 
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.title || "");
  const [activeTab, setActiveTab] = useState("description");
  const titleLinks = product.title?.toLowerCase() || "";
  const defaultImage = titleLinks.includes("ghee") ? "/ghee_popular.png" :
                       titleLinks.includes("oil") ? "/oil_popular.png" :
                       titleLinks.includes("pickle") ? "/pickle_popular.png" :
                       titleLinks.includes("atta") ? "/atta_top_1.png" :
                       titleLinks.includes("pulse") || titleLinks.includes("dal") ? "/pulses_popular.png" :
                       titleLinks.includes("honey") ? "/honey-immunity.jpg" :
                       titleLinks.includes("spice") || titleLinks.includes("turmeric") ? "/top_pick_spice_1.png" : "/logo.png";

  const [mainImage, setMainImage] = useState((product.thumbnail && product.thumbnail !== "null") ? product.thumbnail : (product.images?.[0]?.url) || defaultImage);

  const selectedVariant = product.variants?.find((v: any) => v.title === selectedSize) || product.variants?.[0];
  
  // Enhanced price detection for INR
  const inrPrice = selectedVariant?.prices?.find((p: any) => p.currency_code === "inr")?.amount || 
                   selectedVariant?.calculated_price?.calculated_amount || 
                   selectedVariant?.prices?.[0]?.amount || 0;
                   
  // Fallback for demo: if price is 0 and it's Mustard Oil, assume the standard price
  const price = inrPrice > 0 ? inrPrice : (titleLinks.includes("mustard oil") ? 390 : inrPrice);
  
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    await addItem(selectedVariant.id, quantity);
    setIsAdding(false);
  };

  const productImages = product.images || [];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 pt-8 pb-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-[0.2em] text-brand-deep/40 mb-3 transition-all">
          <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-brand-deep font-black italic">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Column 1: Vertical Gallery & Main Image (Lg: 7 cols) - STICKY (Amazon Style) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6 lg:sticky lg:top-[175px] h-fit self-start">
             {/* Thumbnails */}
             <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:h-[600px] shrink-0">
                {[product.thumbnail, ...productImages.map((img: any) => img.url)].filter(Boolean).map((url, i) => (
                   <div 
                     key={i} 
                     onClick={() => setMainImage(url)}
                     className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImage === url ? 'border-brand-primary shadow-md' : 'border-transparent bg-brand-cream/20 hover:border-brand-sand'}`}
                   >
                     <Image src={url} alt={`Thumbnail ${i}`} fill className="object-cover" />
                   </div>
                ))}
             </div>
 
             {/* Main Image */}
             <div className="relative flex-grow bg-brand-cream/10 md:h-[600px] rounded-2xl overflow-hidden group">
                <Image 
                  src={mainImage} 
                  alt={product.title} 
                  fill
                  priority
                  className="object-contain p-0 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                   <span className="bg-[#2d5a27] text-white text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg italic">BEST SELLER</span>
                   <span className="bg-[#fecaca] text-brand-deep text-[9px] font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg italic">HOT DEAL</span>
                </div>
                <button className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md p-3 rounded-full hover:bg-white transition-all text-brand-deep/50 hover:text-brand-primary shadow-xl border border-brand-sand/20">
                   <Heart size={20} />
                </button>
             </div>
          </div>

          {/* Column 2: Info & Actions (Lg: 5 cols) - Two Brothers Style */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="space-y-2">
               <h1 className="text-3xl font-bold tracking-tight text-brand-deep">{product.title}</h1>
               <p className="text-brand-deep/50 text-[13px] font-medium italic">
                 {product.subtitle || "Bilona-made | Certified Glyphosate-Free | Authentic Traditional Harvest"}
               </p>
               {/* Rating */}
               <div className="flex items-center space-x-2 pt-1 pb-2">
                  <div className="flex items-center text-brand-gold">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= 4 ? "currentColor" : "none"} />)}
                  </div>
                  <span className="text-[12px] font-bold text-brand-deep/80">4.9 | 2262 Reviews</span>
               </div>
               
               <div className="flex flex-col pt-2">
                  <span className="text-4xl font-bold text-brand-deep">₹{price.toLocaleString()}</span>
                  <p className="text-[11px] font-medium text-brand-deep/50 mt-1 uppercase tracking-tight">MRP (Incl. of all taxes)</p>
               </div>
            </div>

            {/* EMI & Payment Info */}
            <div className="bg-brand-cream/40 p-3 rounded-lg border border-brand-sand/30 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="bg-[#e7f5e5] text-[#2d5a27] text-[11px] font-bold px-2 py-1 rounded-md flex items-center">
                     or <span className="mx-1">₹{(price/3).toFixed(0)}</span> / month (3 months)
                  </div>
                  <button className="bg-brand-gold text-white text-[9px] font-bold px-2 py-1 rounded tracking-tighter uppercase italic">Buy on EMI</button>
               </div>
               <div className="flex items-center opacity-70">
                  <span className="text-[9px] font-bold mr-2">Cards Accepted | 0 Extra Cost</span>
                <span className="text-brand-deep font-black italic text-[11px]">snapmint</span>
               </div>
            </div>

            {/* Members Price Bar */}
            <div className="bg-[#fcf8f1] border border-[#f5ead1] p-3 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-[#f9f2e3] transition-all">
               <div className="flex items-center gap-3">
                  <span className="bg-[#2d5a27] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase italic">Collective</span>
                  <span className="text-[12px] font-medium text-brand-deep/80">Members Price <span className="font-bold text-[#2d5a27]">₹{(price * 0.88).toFixed(0)}</span></span>
               </div>
               <span className="text-[11px] font-bold text-brand-deep/60 flex items-center group-hover:text-brand-deep">Join Now <span className="ml-1">›</span></span>
            </div>

            <p className="text-brand-deep/70 text-[14px] leading-relaxed font-light italic border-l-4 border-brand-primary/10 pl-6">
                India’s First certified Glyphosate-free {product.title} from desi Gir cow milk using bilona method. Free from harmful weedicide. Aids digestion & reduces inflammation.
            </p>

            {/* Circle Badges Section */}
            <div className="grid grid-cols-4 gap-2 py-4">
               {[
                  { icon: Leaf, label: "BILONA CHURNED" },
                  { icon: ShieldIcon, label: "GIR COW GHEE" },
                  { icon: Star, label: "ANCIENT WOODFIRE" },
                  { icon: ShoppingBag, label: "MADE OF 'MAKKHAN'" }
               ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#2d5a27]/10 flex items-center justify-center text-[#2d5a27]/60 group-hover:bg-[#2d5a27]/5 group-hover:border-[#2d5a27]/30 transition-all shadow-sm">
                      <badge.icon size={24} className="opacity-80" />
                    </div>
                    <span className="text-[8px] md:text-[9px] font-black tracking-tight text-center text-[#2d5a27] uppercase leading-tight w-full px-1">{badge.label}</span>
                  </div>
               ))}
            </div>

            {/* Variations Selection Grid */}
            <div className="space-y-4 pt-4 border-t border-brand-sand/20">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.variants?.map((v: any, i: number) => {
                     const vPrice = v.prices?.find((p: any) => p.currency_code === "inr")?.amount || 0;
                     const perMl = (vPrice / (parseInt(v.title) || 500)).toFixed(2);
                     const isActive = selectedSize === v.title;
                     
                     return (
                        <div 
                          key={v.id}
                          onClick={() => setSelectedSize(v.title)}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${isActive ? 'border-[#2d5a27] bg-[#f9faf8] shadow-md' : 'border-brand-sand hover:border-brand-sand/80 bg-white'}`}
                        >
                          {i === 0 && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#2d5a27] text-white text-[8px] font-black px-4 py-0.5 rounded-full tracking-widest uppercase italic italic">BESTSELLER</span>}
                          <div className="flex flex-col items-center text-center space-y-1">
                             <span className={`text-[13px] font-bold ${isActive ? 'text-[#2d5a27]' : 'text-brand-deep'}`}>
                                {v.title} {v.title.toLowerCase().includes('bottle') ? '' : '(Glass Bottle)'}
                             </span>
                             <span className="text-lg font-black text-brand-deep">₹{vPrice.toLocaleString()}</span>
                             <span className="text-[10px] font-medium text-brand-deep/40">(Rs.{perMl}/ml)</span>
                          </div>
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* App Promo Card */}
            <div className="bg-[#fff9e6] border border-[#f5deb3] rounded-xl p-4 flex items-center justify-between mt-4">
               <div className="space-y-1">
                  <span className="text-[12px] font-black text-[#392010] block uppercase tracking-[0.2em]">APP9</span>
                  <p className="text-[11px] font-medium text-brand-deep/70">Get 9% off for App users only</p>
                  <p className="text-[10px] font-bold text-brand-deep/40 pt-1">CODE: <span className="text-brand-deep uppercase">APP9</span></p>
               </div>
               <button className="text-[#392010] text-[12px] font-black underline uppercase underline-offset-4 tracking-widest">Download</button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <div className="flex items-center justify-between border-2 border-brand-sand px-6 py-3 rounded-full bg-white sm:w-32 shadow-sm shrink-0">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-brand-deep/40 hover:text-brand-primary"><Minus size={18} /></button>
                  <span className="text-lg font-black serif italic">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="text-brand-deep/40 hover:text-brand-primary"><Plus size={18} /></button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-grow bg-[#392010] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[13px] hover:bg-black transition-all shadow-xl flex items-center justify-center space-x-3 active:scale-[0.98] group disabled:opacity-50"
                >
                  {isAdding ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
                  <span>{isAdding ? "GATHERING..." : "ADD TO BASKET"}</span>
                </button>
            </div>
            
            {/* Quick Trust Footer */}
            <div className="grid grid-cols-4 gap-4 py-8 border-t border-brand-sand/10 mt-6">
               {[
                  { icon: ShoppingBag, label: "Free shipping above 1499" },
                  { icon: ShieldIcon, label: "Secure Payments" },
                  { icon: Leaf, label: "Farmers Empowerment" },
                  { icon: ShieldIcon, label: "COD available" }
               ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <item.icon size={22} className="text-brand-deep/30" />
                    <span className="text-[8px] font-bold text-center text-brand-deep/60 px-1">{item.label}</span>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* Detailed Info Sections (Tabs) */}
        <section className="mt-40 border-t border-brand-sand/10">
            <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar space-x-12 mb-20">
               {["description", "benefits", "nutrition", "rituals"].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`whitespace-nowrap pt-12 pb-6 text-[11px] uppercase font-black tracking-[0.3em] transition-all relative transition-premium ${activeTab === t ? "text-[#392010]" : "text-brand-deep/30 hover:text-brand-deep"}`}
                  >
                    {t === "description" ? "The Sacred Story" : t === "benefits" ? "Vedic Benefits" : t === "nutrition" ? "Pure Alchemy" : "Vedic Rituals"}
                    {activeTab === t && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#392010] rounded-full" />}
                  </button>
               ))}
            </div>

            <div className="max-w-4xl mx-auto px-4">
               <div className="animate-fadeIn transition-opacity duration-1000">
                  {activeTab === "description" && (
                    <div className="space-y-12">
                       <h3 className="text-4xl md:text-5xl font-black serif italic text-[#392010] leading-tight">Handcrafted with <span className="underline decoration-brand-gold/20 decoration-8 underline-offset-12">Ancient Patience.</span></h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                          <div className="space-y-6 text-brand-deep/70 text-xl font-light italic leading-loose">
                             <p>Our {product.title} is not just a product, but a testament to Vedic traditions. We follow the 'Bilona' method where milk is turned into curd, churned into butter, and slow-boiled into pure gold.</p>
                             <p>No chemicals, no shortcuts—just pure, grass-fed nutrition that honors your body and the environment.</p>
                          </div>
                          <div className="bg-brand-cream/30 p-12 rounded-[3.5rem] border border-brand-sand/20 shadow-inner">
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary block mb-6">The Ritual Tip</span>
                             <p className="text-brand-deep/60 italic leading-relaxed text-sm">"Use a clean wooden spoon for every serving. Store in a glass jar away from direct light to keep the ancient vibrations intact."</p>
                          </div>
                       </div>
                    </div>
                  )}
                  {activeTab === "benefits" && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       {[
                         { title: "Digestive Wellness", text: "Rich in butyric acid, which supports the intestinal wall and healthy digestion." },
                         { title: "Cognitive Clarity", text: "Healthy fats required for brain tissue development and mental sharpness." },
                         { title: "Immune Shield", text: "Packed with fat-soluble vitamins A, D, E, and K to boost your natural defense." },
                         { title: "Heart Ritual", text: "Contains Omega-3 fatty acids which effectively manage lipid profiles." }
                       ].map((item, i) => (
                         <li key={i} className="flex space-x-8 items-start group">
                            <span className="text-4xl font-black serif text-brand-sand/30 group-hover:text-brand-primary transition-colors">0{i+1}</span>
                            <div className="space-y-2">
                               <h4 className="text-xl font-black serif italic text-brand-deep">{item.title}</h4>
                               <p className="text-brand-deep/60 text-[13px] font-light italic leading-relaxed">{item.text}</p>
                            </div>
                         </li>
                       ))}
                    </ul>
                  )}
                  {/* Placeholder for other tabs */}
                  {(activeTab === "nutrition" || activeTab === "rituals") && (
                     <div className="py-20 text-center space-y-4">
                        <Leaf size={40} className="mx-auto text-brand-sand" />
                        <h4 className="text-2xl font-bold serif italic text-brand-deep">Coming Soon...</h4>
                        <p className="text-brand-deep/40 text-sm">We are documenting our ancient laboratory results.</p>
                     </div>
                  )}
               </div>
            </div>
        </section>

        {/* Community Proof */}
        <div className="mt-40 bg-[#392010]/5 rounded-[4rem] p-12 md:p-24 border border-brand-sand/10">
           <div className="text-center space-y-6 mb-24">
              <span className="text-[10px] uppercase font-black tracking-[0.5em] text-brand-gold italic">Ancient Feedback</span>
              <h2 className="text-5xl md:text-7xl font-black serif italic tracking-tight uppercase text-[#392010]">Voice Of The <span className="text-brand-primary">Well.</span></h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { name: "Rahul S.", text: "This Ghee is a portal back to my childhood. The aroma alone is therapeutic. Best decision for my kitchen.", rating: 5 },
                { name: "Ananya M.", text: "Finally found a brand that respects the tradition. The digestion benefits were visible in weeks.", rating: 5 },
                { name: "Karan P.", text: "The wood-pressed oil and this ghee are a match made in heaven. Premium quality worth every rupee.", rating: 5 }
              ].map((r, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-brand-sand/10 group">
                   <div className="flex text-brand-gold mb-6">
                      {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                   </div>
                   <p className="text-brand-deep/70 italic text-lg mb-8 font-light leading-relaxed">"{r.text}"</p>
                   <div className="flex items-center space-x-4 pt-6 border-t border-brand-sand/5">
                      <div className="w-10 h-10 bg-brand-cream rounded-full flex items-center justify-center font-black text-brand-primary">{r.name[0]}</div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-brand-deep">{r.name}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* You Might Also Like (Cross-sell) */}
        <div className="mt-40">
           <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl md:text-6xl font-black serif italic tracking-tight text-brand-deep">You Might Also <span className="text-brand-primary italic">Love.</span></h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full" />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
           </div>
        </div>
      </div>
    </div>
  );
}
