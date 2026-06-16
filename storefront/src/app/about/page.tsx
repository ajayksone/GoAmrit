import React from "react";
import Link from "next/link";
import { Leaf, Award, Compass, Users, Map, Quote, Sprout, Heart, Sun, Search, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-brand-cream/10 min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
            alt="Lush farm landscape" 
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-brand-deep/30 mix-blend-multiply" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8 animate-fadeIn">
           <Leaf className="mx-auto text-brand-gold" size={48} />
           <h1 className="text-5xl md:text-8xl font-bold serif text-white tracking-tighter leading-none italic animate-fadeInUp">Rooted in <span className="text-brand-gold">Truth.</span></h1>
           <p className="text-brand-cream/80 max-w-xl mx-auto text-lg md:text-2xl font-light leading-relaxed italic animate-fadeInUp" style={{ animationDelay: '200ms' }}>Tracing the journey from a single Gir cow to a community of organic wellness.</p>
        </div>
      </section>

      {/* Our Mission / Vision */}
      <section className="py-24 lg:py-40 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10 relative">
               <span className="text-sm font-black uppercase tracking-[0.3em] text-brand-gold italic">01. The Beginning</span>
               <h2 className="text-4xl md:text-6xl font-bold serif leading-tight tracking-tight text-brand-deep">Recalling the <br /><span className="text-brand-primary italic font-medium">Ancient Grains.</span></h2>
               <div className="space-y-6 text-brand-deep/60 leading-relaxed text-lg font-light italic border-l-2 border-brand-sand pl-8 py-4">
                  <p>In 2015, we looked at our kitchen shelves and realized how disconnected we had become from our soil. The ghee didn't smell like home, and the honey didn't taste like the forest.</p>
                  <p>GoAmrit was born out of this simple urge to reclaim purity. We started with a small patch of land near the Yamuna river, committed to zero chemicals and zero compromises.</p>
               </div>
               <div className="flex gap-16 pt-8">
                  <div className="space-y-2">
                     <p className="text-5xl font-bold serif text-brand-primary tracking-tighter italic">20K+</p>
                     <p className="text-[10px] uppercase font-black tracking-widest text-brand-deep/30">Families Touched</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-5xl font-bold serif text-brand-primary tracking-tighter italic">100%</p>
                     <p className="text-[10px] uppercase font-black tracking-widest text-brand-deep/30">Chemical Free</p>
                  </div>
               </div>
            </div>
            
            <div className="relative group">
                <div className="aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl skew-y-1 transform group-hover:skew-y-0 transition-premium rotate-2 group-hover:rotate-0 duration-1000">
                   <img src="https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&q=80&w=1200" alt="Founder with farmers" className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-brand-gold p-10 rounded-[2rem] shadow-2xl hidden lg:block transform hover:rotate-6 transition-premium">
                   <Quote className="text-brand-deep mb-4" size={32} />
                   <p className="text-brand-deep font-bold serif text-xl leading-relaxed italic max-w-[200px]">"Wellness isn't a destination; it's the quality of the journey from soil to soul."</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-40 bg-brand-deep relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-geometry.png')] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center space-y-20">
           <div className="max-w-xl mx-auto space-y-4 text-brand-cream px-4">
              <span className="text-xs uppercase tracking-widest font-black text-brand-gold">Our Philosophy</span>
              <h2 className="text-4xl md:text-6xl font-bold serif">Values that <span className="italic">Sustain Us.</span></h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
              <ValueCard 
                icon={Sun} 
                title="Traditional Rituals" 
                text="From Bilona churning to sun-drying, we respect the pace of nature over industrial speed." 
              />
              <ValueCard 
                icon={Compass} 
                title="Ethical Sourcing" 
                text="Direct partnerships with artisan farmers ensure zero middlemen and fair life for livestock." 
              />
              <ValueCard 
                icon={Search} 
                title="Radical Honesty" 
                text="Every gram of product is traceable. We show you the labs, the farms, and the people." 
              />
           </div>
        </div>
      </section>

      {/* Farm Highlight */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 relative p-12 lg:p-0">
             <div className="grid grid-cols-2 gap-6">
                <img src="https://images.unsplash.com/photo-1544254249-16a858e3703c?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-xl mt-12 bg-brand-cream h-[300px] object-cover" />
                <img src="https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-xl bg-brand-cream h-[300px] object-cover" />
                <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=400" className="rounded-3xl shadow-xl col-span-2 bg-brand-cream h-[300px] object-cover" />
             </div>
             {/* Decorative Element */}
             <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl -z-10" />
          </div>

          <div className="order-1 lg:order-2 space-y-12 lg:pl-12">
             <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-black text-brand-gold">The Sanctuary</span>
                <h2 className="text-3xl md:text-5xl font-bold serif leading-snug">The GoAmrit <br/><span className="text-brand-primary italic">Living Farms.</span></h2>
             </div>
             <p className="text-brand-deep/60 leading-relaxed font-light text-lg">Located in the lush belt of Haryana and Uttarakhand, our sanctuary is more than a farm. It's an ecosystem where diverse flora and fauna live in harmony.</p>
             
             <ul className="space-y-6">
                {[
                  "Natural pest management using organic neem solutions.",
                  "Rainwater harvesting and zero-grey-water waste philosophy.",
                  "Solar-powered processing units providing green energy."
                ].map(item => (
                  <li key={item} className="flex items-center space-x-6 group">
                     <span className="bg-brand-primary/20 p-2 rounded-full group-hover:scale-125 transition-transform duration-500"><Leaf size={14} className="text-brand-primary" /></span>
                     <span className="text-sm font-bold tracking-wide italic text-brand-deep/80">{item}</span>
                  </li>
                ))}
             </ul>
             
             <button className="inline-flex items-center space-x-4 border-b-2 border-brand-primary py-2 text-brand-primary font-black uppercase tracking-widest text-[10px] hover:text-brand-deep hover:border-brand-deep transition-premium">
                <span>View Farm Gallery</span>
                <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
           <div className="bg-brand-sand/20 rounded-[4rem] p-12 md:p-32 flex flex-col items-center text-center space-y-12 shadow-inner border border-brand-sand/30 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-full bg-brand-deep opacity-0 group-hover:opacity-[0.02] transition-opacity duration-1000 -z-10" />
              <Sprout className="text-brand-gold animate-bounce" size={48} />
              <div className="space-y-4">
                 <h2 className="text-4xl md:text-6xl font-bold serif max-w-2xl text-brand-deep">Ready to experience <br /><span className="text-brand-primary italic tracking-tighter">Pure Life?</span></h2>
                 <p className="text-brand-deep/40 text-lg md:text-xl font-light italic max-w-md mx-auto">Start your journey with us today and taste the difference that love and tradition make.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                 <Link href="/shop" className="bg-brand-primary text-white px-16 py-6 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-deep transition-premium shadow-2xl shadow-brand-primary/20">Explore Collections</Link>
                 <Link href="/contact" className="bg-white border border-brand-sand text-brand-deep/60 px-16 py-6 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-deep hover:text-brand-cream transition-premium">Get In Touch</Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

const ValueCard = ({ icon: Icon, title, text }: any) => (
  <div className="space-y-6 text-center group cursor-default h-full flex flex-col items-center">
     <div className="bg-white/10 p-10 rounded-[2.5rem] border border-white/5 group-hover:bg-brand-cream/5 transition-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000" />
        <Icon className="text-brand-gold mx-auto relative z-10" size={40} strokeWidth={1.5} />
     </div>
     <div className="space-y-3 px-4 flex-grow flex flex-col justify-center">
        <h3 className="text-brand-cream font-bold serif text-xl tracking-wide uppercase italic">{title}</h3>
        <p className="text-brand-cream/50 text-sm font-light leading-relaxed italic">{text}</p>
     </div>
  </div>
);
