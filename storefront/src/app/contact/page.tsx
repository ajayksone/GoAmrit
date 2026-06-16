"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Send, Leaf, Heart, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message received! A member of the GoAmrit community will reach out path to you.");
    }, 1500);
  };

  return (
    <div className="bg-brand-cream/10 min-h-screen py-24 lg:py-40">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-24 items-start relative">
          
          {/* Column 1: Contact Information */}
          <div className="lg:w-1/3 space-y-20 sticky top-32">
             <div className="space-y-6">
                <Leaf className="text-brand-primary animate-pulse" size={40} />
                <h1 className="text-4xl md:text-6xl font-black serif italic tracking-tighter leading-none">Reach Out <br /><span className="text-brand-gold">to the Soil.</span></h1>
                <p className="text-brand-deep/60 leading-relaxed font-light text-lg italic mt-8 border-l-2 border-brand-sand pl-8">Whether it's a doubt about Ghee rituals, or you just want to share a recipe idea, our farmers are always ready to connect.</p>
             </div>

             <div className="space-y-12">
                <ContactInfoItem 
                  icon={MapPin} 
                  title="Visit Our Sanctuary" 
                  value="GoAmrit Farms, Vill. Kunjpura, Haryana - 132023, India." 
                />
                <ContactInfoItem 
                  icon={Phone} 
                  title="Direct Farm Call" 
                  value="+91 98765 43210 (Mon-Sat, 9AM-6PM)" 
                />
                <ContactInfoItem 
                  icon={Mail} 
                  title="Digital Postcard" 
                  value="hello@goamrit.com" 
                />
             </div>

             <div className="space-y-6 pt-12 border-t border-brand-sand/30">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-brand-deep/30">Harvest Updates on Social</h4>
                <div className="flex space-x-6">
                   {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                      <button key={idx} className="bg-white p-4 rounded-full shadow-sm hover:shadow-xl hover:bg-brand-deep hover:text-white transition-premium group transform hover:-translate-y-2">
                         <Icon size={20} className="group-hover:scale-110 transition-transform" />
                      </button>
                   ))}
                </div>
             </div>
          </div>

          {/* Column 2: Form & Map */}
          <div className="flex-grow space-y-12 w-full lg:pl-12">
             <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-2xl border border-brand-sand/30 space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover:bg-brand-gold/10 transition-colors duration-1000" />
                
                <h2 className="text-2xl font-bold serif italic mb-12 tracking-tight text-brand-deep border-b border-brand-sand/30 pb-6">Write to Us</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-deep/40 pl-2">Full Legal Name</label>
                      <input type="text" required placeholder="Ajay Sharma" className="w-full bg-brand-cream/20 border-transparent border-b-2 border-b-brand-sand focus:border-b-brand-primary focus:bg-white p-4 text-sm outline-none transition-premium italic" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-deep/40 pl-2">Electronic Mail</label>
                      <input type="email" required placeholder="ajay@organic.com" className="w-full bg-brand-cream/20 border-transparent border-b-2 border-b-brand-sand focus:border-b-brand-primary focus:bg-white p-4 text-sm outline-none transition-premium italic" />
                   </div>
                   <div className="md:col-span-2 space-y-3 pt-6">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-deep/40 pl-2">Your Thoughts</label>
                      <textarea rows={5} required placeholder="Tell us what's on your mind... your journey with organic living." className="w-full bg-brand-cream/20 border-transparent border-b-2 border-b-brand-sand focus:border-b-brand-primary focus:bg-white p-8 text-sm outline-none transition-premium italic ring-brand-sand/10 rounded-3xl" />
                   </div>
                </div>

                <div className="pt-12 text-right">
                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full sm:w-fit bg-brand-deep text-white px-16 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand-primary transition-premium shadow-2xl shadow-brand-deep/20 flex items-center justify-center space-x-4 ml-auto group disabled:opacity-50"
                   >
                     {isSubmitting ? <span>Harvesting message...</span> : <><span>Post Letter</span> <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" /></>}
                   </button>
                </div>
             </form>

             {/* Simulated Map */}
             <div className="relative h-[500px] w-full bg-brand-sand/20 rounded-[3rem] overflow-hidden group shadow-inner">
                <div className="absolute inset-0 grayscale contrast-125 opacity-40 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-1000">
                    <img src="https://images.unsplash.com/photo-1544254249-16a858e3703c?auto=format&fit=crop&q=80&w=1200" alt="Farm Aerial View" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-brand-deep p-8 rounded-full shadow-2xl shadow-brand-deep/50 animate-bounce">
                       <MapPin className="text-brand-gold" size={32} />
                    </div>
                </div>
                <div className="absolute bottom-12 left-12 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-xs border border-white/20">
                   <h3 className="text-xl font-bold serif italic text-brand-deep leading-tight mb-2">The Sanctuary <span className="text-brand-primary">Base.</span></h3>
                   <p className="text-[10px] text-brand-deep/60 leading-relaxed font-light italic">Navigate to the heart of GoAmrit. We love visitors during the harvest season.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ContactInfoItem = ({ icon: Icon, title, value }: any) => (
  <div className="flex space-x-8 items-start group">
     <div className="bg-brand-cream p-5 rounded-2xl shadow-sm text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-premium group-hover:rotate-12 transform">
        <Icon size={20} strokeWidth={2.5} />
     </div>
     <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-brand-deep">{title}</h3>
        <p className="text-sm font-light leading-relaxed text-brand-deep/60 italic max-w-[240px]">{value}</p>
     </div>
  </div>
);
