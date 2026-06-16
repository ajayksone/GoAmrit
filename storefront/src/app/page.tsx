"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  Loader2, 
  Star, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Award,
  Calendar,
  HeartHandshake
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { sdk } from "@/lib/medusa";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTopPickTab, setActiveTopPickTab] = useState('Ghee');
  const [cmsData, setCmsData] = useState<any>(null);
  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);

  const topPicks: Record<string, any[]> = {
    'Ghee': [
      {
        id: "top-1",
        title: "A2 Gir Cow - Cultured Ghee",
        thumbnail: "/ghee_top_1.png",
        variants: [{ id: "v1-top", title: "1000 ml (Glass Bottle)", prices: [{ amount: 3370 }] }],
        metadata: { badge: "Best Seller", rating: 4.9, reviews: 2262 }
      },
      {
        id: "top-2",
        title: "Buffalo Ghee - Hand Churned",
        thumbnail: "/ghee_top_2.png",
        variants: [{ id: "v2-top", title: "500 ml (Glass Bottle)", prices: [{ amount: 1170 }] }],
        metadata: { badge: "Bilona Method", rating: 4.89, reviews: 96 }
      },
      {
        id: "top-3",
        title: "Turmeric Infused A2 Ghee",
        thumbnail: "/ghee_top_3.png",
        variants: [{ id: "v3-top", title: "250ml", prices: [{ amount: 2335 }] }],
        metadata: { badge: "Haldi Infused", rating: 4.97, reviews: 64 },
        status: "out_of_stock"
      },
      {
        id: "top-4",
        title: "Tulsi Infused A2 Ghee",
        thumbnail: "/ghee_top_4.png",
        variants: [{ id: "v4-top", title: "250ml", prices: [{ amount: 2335 }] }],
        metadata: { badge: "Tulsi Infused", rating: 4.97, reviews: 52 }
      }
    ],
    'Oil': [
      {
        id: "oil-1",
        title: "Groundnut Oil, Cold-Pressed",
        thumbnail: "/oil_top_1.png",
        variants: [{ id: "o1", title: "Tin Can - 5 Ltr", prices: [{ amount: 2015 }] }],
        metadata: { badge: "Hot Deals", rating: 4.87, reviews: 557 }
      },
      {
        id: "oil-2",
        title: "Black Mustard Oil | Cold-Pressed",
        thumbnail: "/oil_top_2.png",
        variants: [{ id: "o2", title: "1L Tin Can", prices: [{ amount: 1885 }] }],
        metadata: { badge: "Wood Pressed", rating: 4.88, reviews: 110 }
      },
      {
        id: "oil-3",
        title: "Sunflower Oil | Cold-Pressed",
        thumbnail: "/oil_top_3.png",
        variants: [{ id: "o3", title: "Plastic Bottle 1L", prices: [{ amount: 445 }] }],
        metadata: { badge: "Hot Deals", rating: 4.85, reviews: 63 }
      },
      {
        id: "oil-4",
        title: "Virgin Coconut Oil | Cold-Pressed",
        thumbnail: "/oil_top_4.png",
        variants: [{ id: "o4", title: "400ml", prices: [{ amount: 1145 }] }],
        metadata: { badge: "Single Filtered", rating: 4.96, reviews: 24 }
      }
    ],
    'Atta': [
      {
        id: "atta-1",
        title: "Khapli Wheat Atta (Emmer Wheat)",
        thumbnail: "/atta_top_1.png",
        variants: [{ id: "at1", title: "10kg Eco-Pack", prices: [{ amount: 2278 }] }],
        metadata: { badge: "Best Seller", rating: 4.9, reviews: 1491 }
      },
      {
        id: "atta-2",
        title: "Khapli Multigrain Atta - Stoneground",
        thumbnail: "/atta_top_2.png",
        variants: [{ id: "at2", title: "10kg", prices: [{ amount: 1745 }] }],
        metadata: { badge: "Trending", rating: 4.87, reviews: 296 }
      },
      {
        id: "atta-3",
        title: "Sattu Atta - Traditional Power",
        thumbnail: "/atta_top_3.png",
        variants: [{ id: "at3", title: "1kg", prices: [{ amount: 395 }] }],
        metadata: { badge: "Summer Special", rating: 4.9, reviews: 212 }
      },
      {
        id: "atta-4",
        title: "Sprouted Ragi Flour - Nachni Satva",
        thumbnail: "/atta_top_4.png",
        variants: [{ id: "at4", title: "500g", prices: [{ amount: 459 }] }],
        metadata: { badge: "Calcium Rich", rating: 4.95, reviews: 111 }
      }
    ],
    'Pickles': [
      {
        id: "pickle-1",
        title: "Traditional Mango Pickle",
        thumbnail: "/top_pick_pickle_1.png",
        variants: [{ id: "pk1", title: "500g Glass Jar", prices: [{ amount: 450 }] }],
        metadata: { badge: "Aromatic", rating: 4.8, reviews: 320 }
      },
      {
        id: "pickle-2",
        title: "Lemon Pickle (Zesty Achar)",
        thumbnail: "/top_pick_pickle_2.png",
        variants: [{ id: "pk2", title: "400g Glass Jar", prices: [{ amount: 390 }] }],
        metadata: { badge: "Tangy", rating: 4.7, reviews: 150 }
      },
      {
        id: "pickle-3",
        title: "Stuffed Red Chili Pickle",
        thumbnail: "https://images.unsplash.com/photo-1589135398309-002720c3cbd2?auto=format&fit=crop&q=80&w=600",
        variants: [{ id: "pk3", title: "250g Glass Jar", prices: [{ amount: 525 }] }],
        metadata: { badge: "Spicy", rating: 4.9, reviews: 88 }
      },
      {
        id: "pickle-4",
        title: "Mixed Vegetable Pickle",
        thumbnail: "/mango-pickle.jpg",
        variants: [{ id: "pk4", title: "500g Glass Jar", prices: [{ amount: 425 }] }],
        metadata: { badge: "Crunchy", rating: 4.85, reviews: 210 }
      }
    ],
    'Pulses': [
      {
        id: "pulse-1",
        title: "Unpolished Moong Dal",
        thumbnail: "/top_pick_pulse_1.png",
        variants: [{ id: "ps1", title: "1kg Eco-Pack", prices: [{ amount: 185 }] }],
        metadata: { badge: "High Protein", rating: 4.9, reviews: 670 }
      },
      {
        id: "pulse-2",
        title: "Organic Tur Dal (Split Pease)",
        thumbnail: "/top_pick_pulse_2.png",
        variants: [{ id: "ps2", title: "1kg Eco-Pack", prices: [{ amount: 195 }] }],
        metadata: { badge: "Premium", rating: 4.88, reviews: 430 }
      },
      {
        id: "pulse-3",
        title: "Chana Dal - Desi Variety",
        thumbnail: "https://images.unsplash.com/photo-1585994192701-443e0693685e?auto=format&fit=crop&q=80&w=600",
        variants: [{ id: "ps3", title: "1kg", prices: [{ amount: 165 }] }],
        metadata: { badge: "Stone Ground", rating: 4.92, reviews: 120 }
      },
      {
        id: "pulse-4",
        title: "Kabuli Chana - Extra Large",
        thumbnail: "/pulses.jpg",
        variants: [{ id: "ps4", title: "1kg", prices: [{ amount: 245 }] }],
        metadata: { badge: "Protein Rich", rating: 4.95, reviews: 85 }
      }
    ],
    'Spices': [
      {
        id: "spice-1",
        title: "Pure Lakadong Turmeric",
        thumbnail: "/top_pick_spice_1.png",
        variants: [{ id: "sp1", title: "200g Pouch", prices: [{ amount: 295 }] }],
        metadata: { badge: "High Curcumin", rating: 4.98, reviews: 540 }
      },
      {
        id: "spice-2",
        title: "Kashmiri Red Chili Powder",
        thumbnail: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
        variants: [{ id: "sp2", title: "200g Pouch", prices: [{ amount: 325 }] }],
        metadata: { badge: "Hand Pounded", rating: 4.9, reviews: 310 }
      },
      {
        id: "spice-3",
        title: "Stone-Ground Coriander Powder",
        thumbnail: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600",
        variants: [{ id: "sp3", title: "250g", prices: [{ amount: 185 }] }],
        metadata: { badge: "Aromatic", rating: 4.85, reviews: 95 }
      },
      {
        id: "spice-4",
        title: "Whole Cumin Seeds (Jeera)",
        thumbnail: "/spices.jpg",
        variants: [{ id: "sp4", title: "200g", prices: [{ amount: 145 }] }],
        metadata: { badge: "Organically Grown", rating: 4.92, reviews: 65 }
      }
    ],
    'Honey': [
      {
        id: "honey-1",
        title: "Wild Forest Raw Honey",
        thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
        variants: [{ id: "hy1", title: "500g Glass Bottle", prices: [{ amount: 650 }] }],
        metadata: { badge: "Unfiltered", rating: 4.95, reviews: 420 }
      },
      {
        id: "honey-2",
        title: "Neem Blossom Honey",
        thumbnail: "https://images.unsplash.com/photo-1471943311424-646960669fba?auto=format&fit=crop&q=80&w=600",
        variants: [{ id: "hy2", title: "500g", prices: [{ amount: 725 }] }],
        metadata: { badge: "Medicinal", rating: 4.9, reviews: 180 }
      },
      {
        id: "honey-3",
        title: "Sidr (Berry) Organic Honey",
        thumbnail: "https://images.unsplash.com/photo-1471943038886-df67e6fe078f?auto=format&fit=crop&q=80&w=600",
        variants: [{ id: "hy3", title: "250g", prices: [{ amount: 1250 }] }],
        metadata: { badge: "Rare Purity", rating: 4.99, reviews: 55 }
      },
      {
        id: "honey-4",
        title: "Mustard Flower Raw Honey",
        thumbnail: "/honey-immunity.jpg",
        variants: [{ id: "hy4", title: "500g", prices: [{ amount: 495 }] }],
        metadata: { badge: "Immunity Booster", rating: 4.92, reviews: 72 }
      }
    ],
    'Newly Launched': []
  };

  const heroSlides = [
    {
      img: "/hero_website_banner_4.jpg",
      headline: "Vedic Bilona Purity",
      subheading: "Traditional Churned • 100% Raw • Farm Fresh",
      showCTA: true
    },
    {
      img: "/hero_website_banner_1.jpg",
      headline: "Bilona Ghee Offer",
      subheading: "Buy 1kg Bilona Ghee • Get 1 Pickle FREE",
      showCTA: true
    },
    {
      img: "/hero_website_banner_2.jpg",
      headline: "Grand Summer Sale",
      subheading: "Buy 1 Get 1 FREE on Handcrafted Pickles",
      showCTA: true
    },
    {
      img: "/hero_website_banner_3.jpg",
      headline: "A Tale of Traditions",
      subheading: "Families who pass down flavour, not just stories",
      showCTA: true
    }
  ];

  const displaySlides = cmsData?.heroSlides?.length > 1 
    ? cmsData.heroSlides 
    : (cmsData?.heroSlides?.length === 1 
        ? [cmsData.heroSlides[0], ...heroSlides.slice(1)] 
        : heroSlides);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const { products } = await sdk.store.product.list();
        if (products) setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCMS = async () => {
      try {
        const response = await sdk.client.fetch<any>("/store/pages/home").catch(() => null);
        if (response && response.page && response.page.content) {
          setCmsData(response.page.content);
        } else {
          console.warn("Homepage CMS data not found, using static fallbacks.");
        }
      } catch (error) {
        console.error("Error fetching homepage CMS:", error);
      }
    };
    const fetchTestimonials = async () => {
      try {
        const response = await sdk.client.fetch<any>("/store/testimonials");
        const baseTestimonials = response.testimonials || [];
        
        // Define the new requested testimonials
        const newStaticOnes = [
          { id: "vt-static-1", type: "video", thumbnail_url: "/testimonial_1.png", productThumb: "/ghee_popular.png", user_name: "Anita Verma", productTitle: "Vedic A2 Gir Cow Ghee", price: 3370 },
          { id: "vt-static-2", type: "video", thumbnail_url: "/testimonial_2.png", productThumb: "/oil_popular.png", user_name: "Vikram Singh", productTitle: "Wood-Pressed Mustard Oil", price: 390 },
          { id: "vt-static-3", type: "video", thumbnail_url: "/hero_website_banner_3.jpg", productThumb: "/top_pick_pickle_1.png", user_name: "Meera Deshpande", productTitle: "Traditional Mango Pickle", price: 450 },
          { id: "vt-static-4", type: "video", thumbnail_url: "/hero_website_banner_2.jpg", productThumb: "/ghee_top_2.png", user_name: "Sanjay K.", productTitle: "Hand Churned Buffalo Ghee", price: 1170 },
          { id: "txt-static-1", type: "text", content: "The A2 Ghee aroma takes me back to my grandmother's kitchen. Pure gold in a jar!", user_name: "Priya Sharma", rating: 5 },
          { id: "txt-static-2", type: "text", content: "Finally found unpolished pulses that cook so well and taste authentic. Highly recommend GoAmrit.", user_name: "Rohan Gupta", rating: 5 },
          { id: "txt-static-3", type: "text", content: "The wood-pressed mustard oil has a wonderful pungency. It's now a staple in my kitchen for all traditional recipes.", user_name: "Sunita Reddy", rating: 5 },
          { id: "txt-static-4", type: "text", content: "Exceptional quality and fast delivery. The pickles are sun-dried and taste exactly like home.", user_name: "Amit Patel", rating: 5 }
        ];

        // Combine them to ensure the user sees the new ones even if DB has data
        setDbTestimonials([...baseTestimonials, ...newStaticOnes]);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchCMS();
    fetchFeatured();
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [displaySlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);

  return (
    <div className="flex flex-col bg-brand-cream/10">
      
      {/* 1. Hero Section - Banner Slider */}
      <section 
        className="relative w-full overflow-hidden bg-brand-deep shadow-2xl z-10 h-[400px] md:h-[600px]"
      >
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {displaySlides.map((slide: any, index: number) => (
            <div 
               key={index}
               className="relative w-full h-full flex-shrink-0"
            >
              <div className="w-full h-full relative">
                <Image
                  src={slide.img}
                  alt={slide.headline || "GoAmrit Hero"}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10 bg-gradient-to-r from-black/40 to-transparent z-10" />
              </div>
              
              <div className="container mx-auto px-4 md:px-24 h-full flex flex-col justify-center relative z-20">
                <div className={`max-w-xl space-y-6 transition-all duration-700 transform ${index === currentSlide ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`}>
                  
                  {slide.headline && (
                    <div className="space-y-4">
                      <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full text-brand-cream">
                        <Leaf size={18} className="text-brand-gold animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-[0.3em]">{cmsData?.badgeText || "Pure Vedic Purity"}</span>
                      </div>
                      
                      <h1 className="text-4xl md:text-6xl text-white font-bold leading-[1.1] serif tracking-tighter italic">
                        {slide.headline}
                      </h1>
                      
                      {slide.subheading && (
                        <p className="text-lg text-brand-cream/90 font-light max-w-lg italic leading-relaxed">
                           {slide.subheading}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {slide.showCTA && (
                    <div className="flex flex-wrap gap-4 pt-4">
                       <Link href="/shop" className="bg-brand-primary text-white border-2 border-brand-primary px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-transparent transition-all shadow-2xl hover:scale-105 active:scale-95">Shop Now</Link>
                       <Link href="/about" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white hover:text-brand-deep transition-all shadow-xl">Our Journey</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Slider Controls - Hearts with Fingers Style */}
        <div className="hidden md:flex absolute inset-y-0 left-8 items-center z-30">
           <button onClick={prevSlide} className="w-14 h-14 rounded-full bg-white text-brand-deep border shadow-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all transform hover:scale-110 active:scale-95"><ChevronLeft size={28} /></button>
        </div>
        <div className="hidden md:flex absolute inset-y-0 right-8 items-center z-30">
           <button onClick={nextSlide} className="w-14 h-14 rounded-full bg-white text-brand-deep border shadow-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all transform hover:scale-110 active:scale-95"><ChevronRight size={28} /></button>
        </div>

        {/* Pagination Dots - Mobile & Bottom Center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
           {displaySlides.map((_, i) => (
             <button 
               key={i} 
               onClick={() => setCurrentSlide(i)}
               className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-white w-8" : "bg-white/40"}`}
             />
           ))}
        </div>
      </section>


      {/* 2. Featured Circle Ritual Categories */}
      <section className="bg-white py-12 border-b border-brand-sand/10 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div className="space-y-4">
             <span className="text-[10px] uppercase font-black tracking-[0.5em] text-brand-primary italic">Handcrafted Rituals</span>
             <h2 className="text-3xl md:text-4xl font-black serif uppercase tracking-tight text-brand-deep">Shop By Category</h2>
          </div>
          
          {/* Auto-moving Categories Marquee */}
          <div className="relative max-w-[100vw] overflow-hidden py-4 no-scrollbar">
            <div 
               className="flex space-x-12 animate-marquee hover:[animation-play-state:paused] w-max px-6"
            >
              {[
                { name: "A2 Ghee", slug: "desi-ghee", img: "/ghee-circle.jpg" },
                { name: "Pickles", slug: "pickle", img: "/mango-pickle.jpg" },
                { name: "Pulses", slug: "pulses", img: "/pulses.jpg" },
                { name: "Edible Oils", slug: "edible-oil", img: "/wood-pressed-oil.jpg" },
                { name: "Honey", slug: "honey", img: "/honey-immunity.jpg" },
                { name: "Spices", slug: "spices", img: "/spices.jpg" },
                { name: "Atta", slug: "atta", img: "/atta_top_2.png" },
              ].concat([
                { name: "A2 Ghee", slug: "desi-ghee", img: "/ghee-circle.jpg" },
                { name: "Pickles", slug: "pickle", img: "/mango-pickle.jpg" },
                { name: "Pulses", slug: "pulses", img: "/pulses.jpg" },
                { name: "Edible Oils", slug: "edible-oil", img: "/wood-pressed-oil.jpg" },
                { name: "Honey", slug: "honey", img: "/honey-immunity.jpg" },
                { name: "Spices", slug: "spices", img: "/spices.jpg" },
                { name: "Atta", slug: "atta", img: "/atta_top_2.png" },
              ]).map((cat, i) => (
                <Link key={i} href={`/${cat.slug}`} className="flex-shrink-0 flex flex-col items-center space-y-6 group w-[140px] md:w-[160px]">
                  <div className="relative w-36 h-36 lg:w-44 lg:h-44">
                    <div className="absolute inset-0 bg-[#392010] rounded-full border-4 border-brand-sand/20 shadow-[0_20px_40px_rgba(57,32,16,0.2)] group-hover:shadow-[0_25px_50px_rgba(244,127,52,0.3)] group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute -bottom-2 inset-x-0 h-4 bg-brand-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all"></div>
                    <div className="absolute inset-0 p-6 transform group-hover:-translate-y-4 transition-transform duration-500 will-change-transform">
                      <div className="relative w-full h-full">
                        <Image 
                          src={cat.img.startsWith("http") ? `${cat.img}?auto=format&fit=crop&q=80&w=300` : cat.img} 
                          alt={cat.name} 
                          fill 
                          className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] rounded-full transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[12px] font-black uppercase tracking-widest text-brand-deep/80 group-hover:text-brand-primary transition-colors text-center block">
                        {cat.name}
                     </span>
                     <div className="w-0 group-hover:w-full h-1 bg-brand-primary/40 transition-all duration-500 rounded-full mx-auto" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Most Popular Section - Two Brothers Style */}
      <section className="py-12 bg-brand-cream/20">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="text-center md:text-left space-y-2">
              <span className="text-[10px] uppercase font-black tracking-[0.5em] text-brand-primary italic">Community Choice</span>
              <h2 className="text-4xl md:text-5xl font-black serif uppercase tracking-tight text-brand-deep">Most Popular</h2>
            </div>
            <Link href="/shop" className="text-brand-deep font-black uppercase tracking-widest text-[11px] border-b-2 border-brand-primary pb-2 hover:text-brand-primary transition-colors flex items-center group italic">
               View All Rituals <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: "popular-1",
                title: "Vedic A2 Gir Cow Ghee - Hand Churned Bilona",
                thumbnail: "/ghee_popular.png",
                variants: [{ id: "v1", title: "1000 ml (Glass Bottle)", prices: [{ amount: 3370 }] }],
                metadata: { badge: "BEST SELLER", rating: 4.9, reviews: 2259 }
              },
              {
                id: "popular-2",
                title: "Traditional Mango Pickle - Ancient Recipe",
                thumbnail: "/pickle_popular.png",
                variants: [{ id: "v2", title: "500g (Stone Jar)", prices: [{ amount: 450 }] }],
                metadata: { badge: "TRENDING", rating: 4.8, reviews: 850 }
              },
              {
                id: "popular-3",
                title: "Organic Unpolished Moong Dal - Farm Fresh",
                thumbnail: "/pulses_popular.png",
                variants: [{ id: "v3", title: "1kg (Eco-Pack)", prices: [{ amount: 280 }] }],
                metadata: { badge: "BEST SELLER", rating: 4.7, reviews: 420 }
              },
              {
                id: "popular-4",
                title: "Cold Pressed Wood-Pressed Mustard Oil",
                thumbnail: "/oil_popular.png",
                variants: [{ id: "v4", title: "1 Litre (Glass Bottle)", prices: [{ amount: 390 }] }],
                metadata: { badge: "MUST TRY", rating: 4.9, reviews: 1120 }
              },
              {
                id: "popular-5",
                title: "Pure Lakadong Turmeric - High Curcumin",
                thumbnail: "/top_pick_spice_1.png",
                variants: [{ id: "v5", title: "200g Pouch", prices: [{ amount: 295 }] }],
                metadata: { badge: "PUREST", rating: 4.98, reviews: 540 }
              },
              {
                id: "popular-6",
                title: "Wild Forest Raw Honey - Unprocessed",
                thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600",
                variants: [{ id: "v6", title: "500g Glass Bottle", prices: [{ amount: 650 }] }],
                metadata: { badge: "RARE", rating: 4.95, reviews: 420 }
              },
              {
                id: "popular-7",
                title: "Khapli Wheat Atta - Ancient Grain",
                thumbnail: "/atta_top_1.png",
                variants: [{ id: "v7", title: "5kg Eco-Pack", prices: [{ amount: 845 }] }],
                metadata: { badge: "DIGESTIVE", rating: 4.9, reviews: 1491 }
              },
              {
                id: "popular-8",
                title: "Traditional Buffalo Ghee - White Gold",
                thumbnail: "/ghee_top_2.png",
                variants: [{ id: "v8", title: "500 ml (Glass Bottle)", prices: [{ amount: 1170 }] }],
                metadata: { badge: "RICH FLAVOR", rating: 4.89, reviews: 96 }
              }
            ]
.map((product) => (
              <ProductCard key={product.id} product={product} variant="popular" />
            ))}
          </div>
        </div>
      </section>

      {/* 2.6 Video Testimonials Section - KiwiKisan Style */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-12">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-brand-deep tracking-tight">Video Testimonials</h2>
          </div>
          
          <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory">
            {dbTestimonials.filter(t => t.type === 'video').map((v: any) => (
              <div key={v.id} className="flex-shrink-0 w-[240px] md:w-[300px] aspect-[9/16] relative rounded-3xl overflow-hidden shadow-2xl group snap-center border border-brand-sand/10">
                <Image src={v.thumbnail_url || "/testimonial_1.png"} alt="Testimonial" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white cursor-pointer hover:bg-brand-primary hover:border-brand-primary transition-all scale-90 group-hover:scale-100">
                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>

                {/* Info Overlay */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                   <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                      <span className="text-[10px] text-white font-bold tracking-widest uppercase">{v.user_name || "GoAmrit Customer"}</span>
                   </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white cursor-pointer hover:bg-brand-primary hover:border-brand-primary transition-all scale-90 group-hover:scale-100">
                     <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>

                {/* Shoppable Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl flex flex-col gap-4 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-cream/30 overflow-hidden relative flex-shrink-0 border border-brand-sand/20">
                         <Image src={v.productThumb} alt={v.productTitle} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                         <span className="text-[10px] font-black text-brand-deep truncate uppercase tracking-tighter">{(v.productTitle || "Our Best Seller")}</span>
                         <span className="text-[12px] font-bold text-brand-primary">
                            ₹{(Number(v.price) || 0).toLocaleString()}
                         </span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="flex-grow bg-[#392010] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/20 active:scale-95">
                        Add To Cart
                      </button>
                      <button className="w-12 h-12 rounded-xl border border-brand-sand/50 flex items-center justify-center text-brand-deep hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all active:scale-95">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Section for Text Testimonials */}
          {dbTestimonials.filter(t => t.type === 'text').length > 0 && (
            <div className="mt-20 pt-10 border-t border-brand-sand/20">
               <div className="mb-12">
                  <h3 className="text-2xl font-black text-brand-deep tracking-tight serif italic">What Customers Are Saying</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dbTestimonials.filter(t => t.type === 'text').slice(0, 3).map((t: any) => (
                    <div key={t.id} className="bg-brand-cream/10 border border-brand-sand/20 rounded-3xl p-8 space-y-6 relative group overflow-hidden">
                       <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < (t.rating || 5) ? 'text-brand-gold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                       </div>
                       <p className="text-brand-deep/80 italic font-medium leading-relaxed italic text-lg leading-relaxed quotes line-clamp-4">
                          "{t.content}"
                       </p>
                       <div className="pt-6 flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-[#1b6a4b]">{t.user_name}</span>
                          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                             <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-primary"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </section>
      {/* 2.7 The GoAmrit Organic Farm - Premium Brand Story Section */}
      <section className="relative overflow-hidden pt-32 pb-32 bg-white">
        {/* Background Decorative Elements - More Organic */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full -mr-96 -mt-96 animate-pulse" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand-gold/5 blur-[100px] rounded-full -ml-48" />
        
        <div className="container mx-auto px-4 md:px-12 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              
              {/* Left Side: Visual Storytelling with Artistic Framing */}
              <div className="relative group perspective-1000">
                 <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(57,32,16,0.15)] ring-1 ring-brand-sand/50 transform group-hover:rotate-1 transition-all duration-1000">
                    <Image 
                      src="/brand_story_illustration.png" 
                      alt="The GoAmrit Vedic Farm Ritual" 
                      fill 
                      className="object-cover scale-110 group-hover:scale-100 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#392010]/40 via-transparent to-transparent opacity-60" />
                 </div>
                 
                 {/* Premium Floating Badge */}
                 <div className="absolute -bottom-12 -right-12 bg-white p-10 rounded-[3rem] shadow-3xl border border-brand-sand/30 transform transition-transform duration-700 hover:scale-105 group-hover:-translate-x-4 hidden md:block">
                    <div className="text-center space-y-2">
                       <span className="text-[10px] text-brand-primary font-black uppercase tracking-[0.4em] block">Our Promise</span>
                       <div className="text-5xl font-black text-brand-deep serif italic">100%</div>
                       <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] whitespace-nowrap">Source Traceable</div>
                    </div>
                 </div>

                 {/* Decorative Accent */}
                 <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-2xl animate-spin-slow">
                    <Leaf size={40} />
                 </div>
              </div>

              {/* Right Side: Pillars of Purity */}
              <div className="space-y-16">
                 <div className="space-y-8">
                    <div className="inline-flex items-center space-x-4 bg-brand-cream/50 px-6 py-3 rounded-full border border-brand-sand/50">
                       <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
                       <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-deep/70 italic">Transparent Roots</span>
                    </div>
                    
                    <div className="space-y-4">
                       <h2 className="text-5xl md:text-7xl font-bold serif italic tracking-tighter text-brand-deep leading-[1.05]">
                          True <span className="text-brand-primary not-italic font-black">Purity</span> From <br />
                          Our Village To <span className="text-brand-primary">Yours.</span>
                       </h2>
                       <div className="w-24 h-1.5 bg-brand-primary/20 rounded-full" />
                    </div>

                    <p className="text-lg md:text-xl text-gray-500 font-medium italic leading-relaxed max-w-xl">
                       At GoAmrit, we don't just sell products; we preserve traditions that have nourished generations. Every ritualistic jar carries the soul of the soil.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {[
                      { 
                        title: "Vedic Traditions", 
                        desc: "Authentic Bilona method & A2 cow-centric farming practices.",
                        icon: <ShieldCheck className="w-7 h-7" />
                      },
                      { 
                        title: "Direct Sourcing", 
                        desc: "Direct from our village farmer groups with zero middlemen.",
                        icon: <HeartHandshake className="w-7 h-7" />
                      },
                      { 
                        title: "Packed at Source", 
                        desc: "Minimal processing, preserving vital nutrients of every harvest.",
                        icon: <Truck className="w-7 h-7" />
                      },
                      { 
                        title: "Zero Chemicals", 
                        desc: "Earth-friendly practices, purely natural & 100% sustainable.",
                        icon: <CheckCircle2 className="w-7 h-7" />
                      }
                    ].map((pillar, i) => (
                      <div key={i} className="flex gap-6 group">
                         <div className="flex-shrink-0 w-14 h-14 bg-brand-cream/30 rounded-3xl flex items-center justify-center text-[#392010] group-hover:bg-brand-primary group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-sm border border-brand-sand/50">
                            {pillar.icon}
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-base font-black text-brand-deep uppercase tracking-tighter leading-none">{pillar.title}</h4>
                            <p className="text-xs text-gray-400 font-bold leading-relaxed">{pillar.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-8">
                    <Link href="/about" className="group relative overflow-hidden bg-brand-primary text-white px-12 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl transition-all hover:shadow-brand-primary/20 active:scale-95 flex items-center space-x-4 w-fit">
                       <span className="relative z-10">Explore Our Secret Journey</span>
                       <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                       <div className="absolute inset-0 bg-[#392010] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </Link>
                 </div>
              </div>
           </div>
        </div>

        {/* Marquee Strip - Repositioned Below the Grid */}
        <div className="mt-32 w-full bg-[#392010] py-6 -rotate-1 origin-center shadow-2xl relative z-20">
           <div className="flex animate-marquee whitespace-nowrap space-x-24">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-6 text-white font-black uppercase tracking-[0.3em] text-[10px] italic">
                   <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                   <span>Direct From Farmer Groups</span>
                   <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                   <span>Seal of Vedic Purity</span>
                   <div className="w-2 h-2 rounded-full bg-white opacity-20" />
                   <span>Artisanal Small Batches</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 2.8 Top Picks For You - Tabs/Carousel Style */}
      <section className="py-12 bg-brand-cream/10">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-4 flex-grow">
                 <h2 className="text-4xl md:text-5xl font-black text-[#0c3e21] tracking-tight">Top Picks For You</h2>
                 <div className="flex flex-wrap gap-3">
                   {Object.keys(topPicks).map((tab) => (
                     <button 
                       key={tab} 
                       onClick={() => setActiveTopPickTab(tab)}
                       className={`px-8 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                         tab === activeTopPickTab ? 'bg-[#392010] text-white shadow-xl translate-y-[-2px]' : 'bg-[#392010]/80 text-white/90 hover:bg-[#392010]'
                       }`}
                     >
                       {tab}
                     </button>
                   ))}
                 </div>
              </div>
            </div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
              {(topPicks[activeTopPickTab] || []).length > 0 ? (
                topPicks[activeTopPickTab].map((product) => (
                  <ProductCard key={product.id} product={product} variant="popular" />
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-sand/20 rounded-full flex items-center justify-center mx-auto text-brand-deep/30">
                    <Leaf size={32} />
                  </div>
                  <p className="text-brand-deep/40 font-bold uppercase tracking-widest text-xs">Stay tuned! Vedic {activeTopPickTab} arriving soon.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pr-4">
               <Link 
                 href={`/${activeTopPickTab.toLowerCase() === 'ghee' ? 'desi-ghee' : 
                         activeTopPickTab.toLowerCase() === 'oil' ? 'edible-oil' : 
                         activeTopPickTab.toLowerCase() === 'pickles' ? 'pickle' : 
                         activeTopPickTab.toLowerCase().replace(' & ', '-').replace(' ', '-')}`} 
                 className="text-[11px] font-black uppercase tracking-widest text-[#0c3e21] hover:text-brand-primary transition-colors flex items-center group italic underline underline-offset-8 decoration-[#0c3e21]/20"
               >
                  View all {activeTopPickTab} Products <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Section - Visual Discovery */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 text-center space-y-12">
           <div className="space-y-4">
              <span className="text-xs uppercase font-black tracking-[0.5em] text-brand-primary italic">Source of Life</span>
              <h2 className="text-5xl md:text-7xl font-bold serif italic tracking-tighter">Diverse Vedic <span className="text-brand-primary underline decoration-brand-primary/30 underline-offset-8">Treasures.</span></h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Desi Cow Ghee", img: "/ghee-circle.jpg", items: "12 Items" },
                { name: "Edible Oils", img: "/wood-pressed-oil.jpg", items: "08 Items" },
                { name: "Raw Honey", img: "/honey-immunity.jpg", items: "06 Items" },
                { name: "Homemade Pickles", img: "/mango-pickle.jpg", items: "15 Items" }
              ].map((cat, i) => (
                <Link href="/shop" key={i} className="group relative aspect-[3/4] overflow-hidden rounded-[3rem] bg-brand-sand/20 shadow-lg">
                   <MirrorImage src={cat.img.startsWith("http") ? `${cat.img}?auto=format&fit=crop&q=80&w=600` : cat.img} alt={cat.name} />
                   <div className="absolute inset-0 p-10 flex flex-col justify-end text-left items-start space-y-2">
                       <span className="text-[10px] uppercase font-black tracking-widest text-brand-primary">{cat.items}</span>
                       <h3 className="text-3xl font-bold text-white serif italic leading-none">{cat.name}</h3>
                       <div className="w-0 group-hover:w-full h-1 bg-brand-primary transition-all duration-500 rounded-full mt-4" />
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-10">
              <div className="space-y-6">
                 <h2 className="text-5xl md:text-7xl font-black serif tracking-tight italic">Harvest <span className="text-brand-primary">Favorites.</span></h2>
                 <p className="text-brand-deep/40 italic font-light text-xl max-w-xl">Purest organic delights, handpicked from our current Vedic collection.</p>
              </div>
              <Link href="/shop" className="text-brand-deep font-black uppercase tracking-widest text-[11px] border-b-2 border-brand-primary pb-2 hover:text-brand-primary transition-colors flex items-center group italic">
                 Explore Full Harvest <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
           </div>

           {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
               <Loader2 size={64} className="text-brand-primary animate-spin" />
               <p className="text-brand-deep/40 uppercase font-bold tracking-widest text-xs italic text-center">Gathering Freshness...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {featuredProducts.length > 0 ? featuredProducts.map((p) => (
                <div key={p.id} className="group relative">
                  <ProductCard product={p} />
                  <div className="absolute top-6 left-6 z-10 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-black italic shadow-lg text-[10px] scale-0 group-hover:scale-100 transition-transform duration-500">HOT</div>
                </div>
              )) : (
                 <div className="col-span-full py-20 text-center text-brand-deep/40 uppercase font-black tracking-widest text-xs">No Products in Harvest Yet</div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 5. Farm Story Section */}
      <section className="py-20 relative overflow-hidden bg-brand-deep">
         <Image 
            src="https://images.unsplash.com/photo-1500595046743-cd271d69625e?auto=format&fit=crop&q=80&w=2000"
            alt="Farm Lifestyle"
            fill
            className="object-cover opacity-20 filter grayscale-50"
         />
         <div className="container mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
               <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border-8 border-white/10 shadow-3xl relative">
                  <video 
                    src={cmsData?.brandVideo || "/my-video.mp4"}
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
               </div>
               <div className="absolute -bottom-10 -right-10 bg-brand-primary p-12 rounded-[3rem] shadow-2xl hidden md:block border-4 border-brand-deep">
                  <div className="text-white space-y-1 text-center">
                     <span className="text-5xl font-black serif italic">25+</span>
                     <p className="text-[10px] font-black uppercase tracking-widest">Village Partners</p>
                  </div>
               </div>
            </div>
            
            <div className="space-y-10 text-brand-cream">
               <div className="space-y-4">
                  <span className="text-[10px] uppercase font-black tracking-[0.4em] text-brand-primary italic">Since Generations</span>
                  <h2 className="text-5xl md:text-8xl font-black serif italic leading-tight decoration-brand-primary underline underline-offset-8">A Vedic Legacy <br/> In Every <span className="text-brand-primary underline border-none">Vessel.</span></h2>
               </div>
               <p className="text-lg md:text-2xl font-light italic text-brand-cream/70 leading-relaxed max-w-xl">
                 "Our mission is simple: to bring the same purity of food that our ancestors enjoyed back to your modern table, ensuring your body is nourished by nature's true intent."
               </p>
               <div className="pt-8">
                  <Link href="/about" className="inline-flex items-center space-x-4 bg-brand-primary text-white border-2 border-brand-primary px-14 py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-transparent transition-all shadow-2xl group">
                     <span>Deep Dive Into Our Story</span>
                     <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* 6. Blog Section */}
      <section className="py-16 bg-brand-cream/30">
        <div className="container mx-auto px-4 md:px-8">
           <div className="text-center space-y-6 mb-12">
              <span className="text-xs uppercase font-black tracking-[0.5em] text-brand-primary italic">Vedic Journal</span>
              <h2 className="text-5xl md:text-7xl font-black serif italic tracking-tight text-brand-deep underline decoration-brand-primary/30 underline-offset-16">Ritualistic <span className="text-brand-primary">Wisdom.</span></h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "Benefits of hand-churned Bilona Ghee", date: "MAR 12, 2026", img: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9" },
                { title: "Why Cold-Pressed Oils are Essential for Life", date: "MAR 08, 2026", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5" },
                { title: "The Purity of Raw Wildforest Raw Honey", date: "FEB 28, 2026", img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62" }
              ].map((blog, i) => (
                <div key={i} className="group space-y-10 bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-brand-sand/20">
                   <div className="aspect-[16/10] relative rounded-[2rem] overflow-hidden">
                      <Image src={`${blog.img}?auto=format&fit=crop&q=80&w=600`} alt={blog.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-brand-primary italic">
                         <Calendar size={12} />
                         <span>{blog.date}</span>
                      </div>
                      <h3 className="text-2xl font-black serif leading-tight text-brand-deep group-hover:text-brand-primary transition-colors italic">{blog.title}</h3>
                      <button className="text-[10px] font-black uppercase tracking-widest text-brand-deep border-b-2 border-brand-deep group-hover:text-brand-primary group-hover:border-brand-primary transition-all pb-1 italic">Read The Ritual</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 9. Instagram Feed Section */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
               <div className="space-y-4">
                  <h2 className="text-5xl font-black serif italic tracking-tight text-brand-deep">Moments From <br/>Our <span className="text-brand-primary italic">Vedic Earth.</span></h2>
                  <p className="text-brand-deep/40 text-[10px] uppercase font-black tracking-[0.5em] italic">Follow our Ritual @GoAmrit</p>
               </div>
               <Link href="#" className="inline-flex items-center space-x-4 bg-brand-deep text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-brand-primary transition-all">
                  <span>View Our Instagram</span>
                  <ArrowRight size={18} />
               </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {[
                 "https://images.unsplash.com/photo-1596733430284-f7437764b1a9",
                 "https://images.unsplash.com/photo-1582213726839-4467000e3902",
                 "https://images.unsplash.com/photo-1488459739032-059723827553",
                 "https://images.unsplash.com/photo-1542838132-92c53300491e",
                 "https://images.unsplash.com/photo-1500595046743-cd271d69625e"
               ].map((url, i) => (
                 <div key={i} className="aspect-square relative rounded-[2.5rem] overflow-hidden group shadow-lg">
                    <Image src={`${url}?auto=format&fit=crop&q=80&w=600`} alt="Farm Moment" fill className="object-cover group-hover:scale-110 transition-all" />
                    <div className="absolute inset-0 bg-brand-deep/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <InstagramIcon size={32} className="text-white scale-0 group-hover:scale-100 transition-transform duration-500" />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 10. Newsletter Section */}
      <section className="py-32 bg-brand-cream/30">
        <div className="container mx-auto px-4 md:px-8">
           <div className="max-w-5xl mx-auto bg-brand-primary p-12 lg:p-24 rounded-[5rem] overflow-hidden relative shadow-3xl text-center text-white">
              <div className="absolute top-0 left-0 p-12 opacity-10 rotate-12"><Leaf size={200} /></div>
              <div className="space-y-12 relative z-10">
                 <div className="space-y-6">
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Sacred Newsletter Ritual</span>
                    <h2 className="text-5xl md:text-7xl font-black serif italic tracking-tighter leading-tight decoration-brand-deep/20 underline underline-offset-16">Join Our Growing <br/> Vedic <span className="font-bold">Community.</span></h2>
                    <p className="opacity-80 max-w-2xl mx-auto text-lg md:text-xl font-light italic leading-relaxed">
                       Subscribe to receive our seasonal harvest wisdom, ancient health tips, and exclusive early access to our limited batches.
                    </p>
                 </div>
                 
                 <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-6">
                    <input 
                      type="email" 
                      placeholder="Enter Your Sacred Email" 
                      className="flex-grow bg-white/10 border-2 border-white/20 rounded-full px-10 py-6 text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors font-bold tracking-widest text-[11px] italic"
                    />
                    <button className="bg-white text-brand-primary px-12 py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-brand-deep hover:text-white transition-all shadow-2xl">
                       Sign Me Up Ritual
                    </button>
                 </form>
                 <p className="text-[10px] uppercase font-black tracking-widest opacity-40">We strictly honor your inbox. Zero Chemicals, Zero Spam.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

// Helper components to keep clean
function MirrorImage({ src, alt }: { src: string, alt: string }) {
  return (
    <Image 
      src={src} 
      alt={alt} 
      fill 
      className="object-cover transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-50" 
    />
  );
}

function InstagramIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}
