"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
   ShoppingCart,
   User,
   Search,
   Menu,
   X,
   Leaf,
   LogOut,
   Heart,
   ChevronDown,
   Gift,
   Droplets,
   Wheat,
   Box,
   Sparkles,
   ShieldPlus,
   Coffee,
   Sprout,
   Activity,
   HeartPulse,
   Scale,
   Stethoscope,
   ArrowRight
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
   const pathname = usePathname();
   const { cart } = useCart();
   const { customer, logout } = useAuth();
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const isHome = pathname === "/";
   const cartCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
         {/* 1. Announcement Bar - High-Impact Marquee */}
         <div className="bg-[#392010] text-white h-10 overflow-hidden relative flex items-center border-b border-white/5">
            <div className="flex animate-marquee whitespace-nowrap min-w-full items-center">
               {[...Array(3)].map((_, i) => (
                  <React.Fragment key={i}>
                     <span className="text-[12px] md:text-[13px] font-bold px-12 inline-flex items-center">
                        Summer Savings 🍯 15% Off | Code: SUM15
                     </span>
                     <span className="text-[12px] md:text-[13px] font-bold px-12 inline-flex items-center border-l border-white/20">
                        New In 🌈 ! Buy 3 & Get 15% Off on New Launches | code: NEW15
                     </span>
                     <span className="text-[12px] md:text-[13px] font-bold px-12 inline-flex items-center border-l border-white/20">
                        Big Savings Alert! Get 10% OFF on orders above ₹3000 | Use code - GOAMRIT10
                     </span>
                     <span className="text-[12px] md:text-[13px] font-bold px-12 inline-flex items-center border-l border-white/20">
                        So many perks await! Members get extra freebies 🎁
                     </span>
                  </React.Fragment>
               ))}
            </div>
         </div>

         {/* 2. Main Header Row */}
         <header className={`bg-white transition-all duration-300 ${isScrolled ? "h-[75px]" : "h-[85px]"} flex items-center shadow-sm`}>
            <div className="container mx-auto px-4 md:px-8 max-w-[1345px]">
               <div className="grid grid-cols-3 items-center w-full">

                  {/* Left: Search Bar (Desktop) */}
                  <div className="hidden lg:flex max-w-sm relative">
                     <input
                        type="text"
                        placeholder="Search For Ghee"
                        className="w-full pl-4 pr-10 py-2.5 border border-brand-sand rounded-md text-sm focus:outline-none focus:border-brand-primary italic transition-colors"
                     />
                     <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-deep/40" size={18} />
                  </div>

                  {/* Mobile: Toggle */}
                  <button
                     className="lg:hidden text-brand-deep flex justify-start"
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                     <Menu size={24} />
                  </button>

                  {/* Center: Brand Logo (Hard Centering) */}
                  <div className="flex justify-center">
                     <Link href="/" className="flex flex-col items-center group flex-shrink-0 transition-transform hover:scale-105 active:scale-95 duration-500">
                        <div className="relative h-14 md:h-16 w-36 md:w-52">
                           <Image
                              src="/logo.png"
                              alt="GoAmrit Organic Farm"
                              fill
                              className="object-contain"
                              priority
                           />
                        </div>
                     </Link>
                  </div>

                  {/* Right: Personal Actions */}
                  <div className="flex items-center space-x-4 md:space-x-8 text-brand-deep justify-end">
                     <Link href={customer ? "/account" : "/login"} className="hidden sm:flex items-center space-x-1 hover:text-brand-primary transition-colors">
                        <User size={20} className="md:w-6 md:h-6" />
                     </Link>

                     <Link href="/wishlist" className="hidden sm:flex items-center relative hover:text-brand-primary transition-colors">
                        <Heart size={20} className="md:w-6 md:h-6" />
                        <span className="absolute -top-1.5 -right-2 bg-brand-deep text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                     </Link>

                     <Link href="/cart" className="flex items-center relative hover:text-brand-primary transition-colors">
                        <ShoppingCart size={20} className="md:w-6 md:h-6" />
                        {cartCount >= 0 && (
                           <span className="absolute -top-1.5 -right-2 bg-brand-primary text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                              {cartCount}
                           </span>
                        )}
                     </Link>
                  </div>
               </div>
            </div>
         </header>

         {/* 3. Navigation Row (Desktop Only) */}
         <nav className="hidden lg:block bg-white border-t border-brand-sand/30 py-3">
            <div className="container mx-auto px-4 md:px-8">
               <ul className="flex items-center justify-center space-x-8 text-[11px] font-black uppercase tracking-wider text-brand-deep/80">
                  <li className="flex items-center">
                     <Link href="/desi-ghee" className="flex items-center space-x-2 group cursor-pointer hover:text-brand-primary">
                        <div className="w-6 h-6 bg-brand-cream rounded-full flex items-center justify-center"><Leaf size={14} className="group-hover:rotate-12 transition-transform" /></div>
                        <span>Ghee</span>
                     </Link>
                  </li>
                  <li className="flex items-center">
                     <Link href="/atta" className="flex items-center space-x-2 group cursor-pointer hover:text-brand-primary">
                        <div className="w-6 h-6 bg-brand-cream rounded-full flex items-center justify-center"><Gift size={12} /></div>
                        <span>Atta</span>
                     </Link>
                  </li>
                  <li className="relative group/category flex items-center space-x-1 cursor-pointer hover:text-brand-primary h-full py-2">
                     <span>Shop By Category</span>
                     <ChevronDown size={14} className="group-hover/category:rotate-180 transition-transform" />

                     {/* Mega Menu Dropdown */}
                     <div className="absolute top-[calc(100%+0px)] left-1/2 -translate-x-1/2 w-[720px] bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] overflow-hidden z-[100] opacity-0 invisible group-hover/category:opacity-100 group-hover/category:visible transition-all duration-500 pointer-events-none group-hover/category:pointer-events-auto border border-brand-sand/10">
                        {/* Arrow Pointer */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-brand-sand/10 rotate-45" />

                        <div className="relative p-10 min-h-[380px] flex flex-col">
                           {/* 1. Category Icons Row */}
                           <div className="grid grid-cols-5 gap-4 text-center relative z-10 mb-20">
                              {[
                                 { name: "Oil", slug: "edible-oil", icon: <Droplets size={32} /> },
                                 { name: "Pickles", slug: "pickle", icon: <Sparkles size={32} /> },
                                 { name: "Spices", slug: "spices", icon: <Sparkles size={32} /> },
                                 { name: "Honey", slug: "honey", icon: <ShieldPlus size={32} /> },
                                 { name: "Grains & Pulses", slug: "pulses", icon: <Sprout size={32} /> },
                              ].map((cat, idx) => (
                                 <Link key={idx} href={`/${cat.slug}`} className="flex flex-col items-center space-y-4 group/cat transition-all">
                                    <div className="text-brand-primary/80 group-hover/cat:text-brand-primary transform group-hover/cat:scale-110 transition-all duration-300">
                                       {cat.icon}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2d5a27]">{cat.name}</span>
                                 </Link>
                              ))}
                           </div>

                           {/* 2. Bottom Decoration & Action */}
                           <div className="relative h-44 flex items-end mt-auto -mx-10 -mb-10">
                              {/* Decoration: Mountain Wave (Behind) */}
                              <div className="absolute bottom-0 left-0 right-0 h-[220px] z-0 overflow-hidden pointer-events-none">
                                 <svg viewBox="0 0 1440 320" className="w-full h-full fill-[#E06D2B]" preserveAspectRatio="none">
                                    <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                                 </svg>
                              </div>

                              {/* Shop All Button (Left) */}
                              <div className="relative z-20 pb-12 pl-14">
                                 <Link href="/shop" className="bg-[#392010] text-white px-10 py-3.5 rounded-sm font-black uppercase text-[12px] tracking-widest hover:bg-black transition-all shadow-xl">
                                    Shop All
                                 </Link>
                              </div>

                              {/* Decoration: Illustration (Right) */}
                              <div className="absolute right-0 bottom-0 w-[420px] h-[280px] z-10 pointer-events-none mix-blend-multiply">
                                 <Image 
                                    src="/ghee-journey-clean.png" 
                                    alt="Traditional Ghee Journey" 
                                    fill 
                                    className="object-contain object-bottom pointer-events-none"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </li>
                  <li>
                     <Link href="/collective" className="text-brand-gold border-brand-gold border px-3 py-1.5 rounded-sm hover:bg-brand-gold hover:text-white transition-premium">Join Collective</Link>
                  </li>
                  <li className="relative group/concern flex items-center space-x-1 cursor-pointer hover:text-brand-primary h-full py-2">
                     <span>Shop By Concern</span>
                     <ChevronDown size={14} className="group-hover/concern:rotate-180 transition-transform" />

                     {/* Concern Dropdown */}
                     <div className="absolute top-[calc(100%+0px)] left-1/2 -translate-x-1/2 w-[280px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-[100] opacity-0 invisible group-hover/concern:opacity-100 group-hover/concern:visible transition-all duration-300 pointer-events-none group-hover/concern:pointer-events-auto border border-brand-sand/20">
                        {/* Arrow Pointer */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-brand-sand/20 rotate-45" />

                        {/* Concern Items List */}
                        <div className="py-8 px-6 space-y-6">
                           {[
                              { name: "Diabetes", icon: <Stethoscope size={28} /> },
                              { name: "Gut Health", icon: <HeartPulse size={28} /> },
                              { name: "Immunity", icon: <ShieldPlus size={28} /> },
                              { name: "Weight Loss", icon: <Scale size={28} /> },
                           ].map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-6 group/item cursor-pointer hover:opacity-80 transition-opacity">
                                 <div className="w-12 h-12 rounded-full bg-brand-sand/30 flex items-center justify-center text-brand-primary/80 group-hover/item:text-brand-primary transition-all group-hover/item:scale-110 duration-300">
                                    {item.icon}
                                 </div>
                                 <span className="text-[14px] font-bold text-[#2d5a27]/90 group-hover/item:text-[#2d5a27] transition-colors">{item.name}</span>
                              </div>
                           ))}
                        </div>

                        {/* Minimal Bottom Wavy Wave (matching the screenshot's soft accent) */}
                        <div className="relative h-12 bg-white overflow-hidden">
                           <div className="absolute bottom-0 left-0 w-full h-[50px] z-0 opacity-10">
                              <svg viewBox="0 0 1440 320" className="w-full h-full fill-[#2d5a27]" preserveAspectRatio="none">
                                 <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                              </svg>
                           </div>
                           <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#E9F5E6]/40 to-transparent z-0"></div>
                        </div>
                     </div>
                  </li>
                  <li className="relative group/farmlife flex items-center space-x-1 cursor-pointer hover:text-brand-primary h-full py-2">
                     <span>Farm Life</span>
                     <ChevronDown size={14} className="group-hover/farmlife:rotate-180 transition-transform" />

                     {/* Farm Life Mega Menu */}
                     <div className="absolute top-[calc(100%+0px)] left-1/2 -translate-x-[65%] w-[1000px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-[100] opacity-0 invisible group-hover/farmlife:opacity-100 group-hover/farmlife:visible transition-all duration-300 pointer-events-none group-hover/farmlife:pointer-events-auto border border-brand-sand/20">
                        {/* Arrow Pointer */}
                        <div className="absolute -top-2 left-[65%] -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-brand-sand/20 rotate-45" />

                        <div className="flex p-10 pt-12 gap-8 relative z-10">
                           {/* Column 1: Main Large Sections */}
                           <div className="flex-[1.5] space-y-5">
                              {["Founders & Team", "Media Recognition", "Traceability", "Health of People & Planet", "Team on ground"].map((text, idx) => (
                                 <div key={idx} className="text-[#2d5a27]/90 text-[18px] lg:text-[22px] font-black leading-tight hover:text-brand-primary cursor-pointer transition-colors transition-premium group/main">
                                    <span className={idx === 0 ? "text-brand-primary" : ""}>{text}</span>
                                 </div>
                              ))}
                           </div>

                           {/* Column 2: Specific Links */}
                           <div className="flex-1 space-y-4">
                              {["Farm Visit", "Events", "Quality Assurance", "Testimonials", "Our Philosophy"].map((text, idx) => (
                                 <div key={idx} className="text-[#2d5a27]/70 text-[13px] font-bold uppercase tracking-wider hover:text-brand-primary cursor-pointer transition-colors">
                                    {text}
                                 </div>
                              ))}
                           </div>

                           {/* Column 3: Specific Links */}
                           <div className="flex-1 space-y-4">
                              {["Lab Reports", "Our Team", "CSR Initiatives", "Blogs", "Farmers Market"].map((text, idx) => (
                                 <div key={idx} className="text-[#2d5a27]/70 text-[13px] font-bold uppercase tracking-wider hover:text-brand-primary cursor-pointer transition-colors">
                                    {text}
                                 </div>
                              ))}
                           </div>

                           {/* Column 4: Image Section */}
                           <div className="flex-[2] relative rounded-xl overflow-hidden group/img aspect-[4/3]">
                              <Image
                                 src="/hero.jpg"
                                 alt="GoAmrit Farm Life"
                                 fill
                                 className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                           </div>
                        </div>

                        {/* Bottom Wavy Wave Decoration */}
                        <div className="relative h-20 bg-white overflow-hidden">
                           <div className="absolute bottom-0 left-0 w-full h-[80px] z-0 opacity-15">
                              <svg viewBox="0 0 1440 320" className="w-full h-full fill-[#2d5a27]" preserveAspectRatio="none">
                                 <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                              </svg>
                           </div>
                        </div>
                     </div>
                  </li>
                  <li className="flex items-center">
                     <Link href="/about" className="hover:text-brand-primary transition-colors">About</Link>
                  </li>
                  <li className="relative group/customers flex items-center space-x-1 cursor-pointer hover:text-brand-primary h-full py-2">
                     <span>Customers</span>
                     <ChevronDown size={14} className="group-hover/customers:rotate-180 transition-transform" />

                     {/* Customers Dropdown */}
                     <div className="absolute top-[calc(100%+0px)] left-1/2 -translate-x-[75%] w-[320px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-[100] opacity-0 invisible group-hover/customers:opacity-100 group-hover/customers:visible transition-all duration-300 pointer-events-none group-hover/customers:pointer-events-auto border border-brand-sand/20">
                        {/* Arrow Pointer */}
                        <div className="absolute -top-2 left-[75%] -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-brand-sand/20 rotate-45" />

                        {/* Customer Links List */}
                        <div className="py-8 px-8 space-y-6">
                           {[
                              { name: "Track Order", href: "/order-tracking" },
                              { name: "Contact Us", href: "/contact" },
                              { name: "Refund & Cancellation Policy", href: "/refund-policy" },
                              { name: "Shipping & Delivery Policy", href: "/shipping-policy" },
                           ].map((link, idx) => (
                              <Link key={idx} href={link.href} className="block text-[#2d5a27]/80 text-[14px] font-bold tracking-wide hover:text-brand-primary transition-colors hover:translate-x-1 transition-transform duration-300">
                                 {link.name}
                              </Link>
                           ))}
                        </div>

                        {/* Minimal Bottom Wavy Wave Decoration */}
                        <div className="relative h-14 bg-white overflow-hidden">
                           <div className="absolute bottom-0 left-0 w-full h-[60px] z-0 opacity-10">
                              <svg viewBox="0 0 1440 320" className="w-full h-full fill-[#2d5a27]" preserveAspectRatio="none">
                                 <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                              </svg>
                           </div>
                           <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#E9F5E6]/30 to-transparent z-0"></div>
                        </div>
                     </div>
                  </li>
               </ul>
            </div>
         </nav>

         {/* Mobile Menu Drawer (Simplified) */}
         <div className={`lg:hidden fixed inset-0 bg-brand-deep/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`} onClick={e => e.stopPropagation()}>
               <div className="p-6">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b">
                     <span className="text-xl font-black serif italic tracking-tighter">GoAmrit</span>
                     <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
                  </div>
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col space-y-4">
                     <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-bold uppercase tracking-widest border-b border-brand-sand/10">Home</Link>
                     <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-bold uppercase tracking-widest border-b border-brand-sand/10">Shop All</Link>
                     <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-bold uppercase tracking-widest border-b border-brand-sand/10">About Us</Link>
                     <Link href="/collective" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-bold uppercase tracking-widest border-b border-brand-sand/10 text-brand-gold">Collective</Link>
                     {/* Add more as needed */}
                  </nav>
               </div>
            </div>
         </div>
      </div>
   );
};
