"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User, LogOut, Package, MapPin, Heart, ArrowRight, Loader2, ShieldCheck, Leaf } from "lucide-react";
import Link from "next/link";
import { sdk } from "@/lib/medusa";

export default function AccountPage() {
  const { customer, isLoading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !customer) {
      router.push("/login");
    }
  }, [customer, isLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { orders } = await sdk.store.order.list();
        setOrders(orders);
      } catch (e) {
        console.error("Error fetching orders:", e);
      } finally {
        setIsOrdersLoading(false);
      }
    };
    if (customer) fetchOrders();
  }, [customer]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <Loader2 size={48} className="text-brand-primary animate-spin" />
        <p className="text-brand-deep/40 font-bold uppercase tracking-widest text-xs tracking-widest italic">Reviewing your profile...</p>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="bg-brand-cream/10 min-h-screen py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Sidebar Nav */}
          <aside className="lg:col-span-3 space-y-8">
             <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-brand-sand/30 space-y-10">
                <div className="flex flex-col items-center text-center space-y-4">
                   <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center relative group">
                      <User size={32} className="text-brand-primary" />
                      <div className="absolute inset-0 border-2 border-brand-primary rounded-full animate-ping opacity-20 group-hover:block hidden" />
                   </div>
                   <div className="space-y-1">
                      <h2 className="text-xl font-bold serif">{customer.first_name} {customer.last_name}</h2>
                      <p className="text-[10px] text-brand-deep/40 uppercase font-black tracking-widest italic">{customer.email}</p>
                   </div>
                </div>

                <nav className="flex flex-col space-y-4">
                   <AccountLink icon={Package} label="Orders" active />
                   <AccountLink icon={MapPin} label="Addresses" />
                   <AccountLink icon={Heart} label="Selections" />
                   <button 
                     onClick={logout}
                     className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-premium font-bold uppercase tracking-widest text-[10px] mt-8 border border-transparent hover:border-red-100"
                   >
                     <LogOut size={16} />
                     <span>Sign Out</span>
                   </button>
                </nav>
             </div>
             
             <div className="bg-brand-primary text-white rounded-[2.5rem] p-10 shadow-xl space-y-6 relative overflow-hidden group">
                <Leaf className="absolute -top-6 -right-6 text-white/10 w-32 h-32 group-hover:rotate-45 transition-transform duration-1000" />
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full w-fit">
                   <ShieldCheck size={14} className="text-brand-gold" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Wellness Member</span>
                </div>
                <h3 className="text-2xl font-bold serif leading-tight">Farmer's Support <br />Legacy.</h3>
                <p className="text-xs text-brand-cream/70 italic font-light">By shopping with us, you are supporting 15+ village communities across Rajasthan.</p>
             </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-12">
             <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-sand/30 pb-10">
                <div className="space-y-4">
                   <h1 className="text-4xl md:text-5xl font-bold serif tracking-tight italic">Your Harvest <span className="text-brand-primary">History.</span></h1>
                   <p className="text-brand-deep/40 italic font-light">Trace and track every wellness selection you've made.</p>
                </div>
                <Link href="/shop" className="group flex items-center space-x-2 text-brand-primary hover:text-brand-deep transition-colors font-bold uppercase tracking-widest text-[10px]">
                   <span>Explore Harvest</span>
                   <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
             </header>

             <div className="space-y-8">
                {isOrdersLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                     <Loader2 size={32} className="text-brand-primary animate-spin" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-brand-deep/40">Fetching selections...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-6">
                     {orders.map((order) => (
                       <OrderCard key={order.id} order={order} />
                     ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[3rem] p-20 text-center space-y-8 border border-brand-sand/20 shadow-sm">
                     <div className="w-20 h-20 bg-brand-sand/20 rounded-full flex items-center justify-center mx-auto text-brand-deep/20">
                        <Package size={32} />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-2xl font-bold serif italic">No harvests yet.</h3>
                        <p className="text-brand-deep/40 text-sm max-w-sm mx-auto leading-relaxed italic">Begin your journey to wellness by exploring our range of pure, organic farm offerings.</p>
                     </div>
                     <Link href="/shop" className="inline-flex items-center space-x-4 bg-brand-primary text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-deep transition-premium shadow-xl shadow-brand-primary/20">
                        <span>Place First Selection</span>
                        <ArrowRight size={14} />
                     </Link>
                  </div>
                )}
             </div>
          </main>

        </div>
      </div>
    </div>
  );
}

const AccountLink = ({ icon: Icon, label, active = false }: any) => (
  <button className={`flex items-center space-x-4 w-full px-6 py-4 rounded-2xl transition-premium text-left group ${active ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' : 'text-brand-deep/60 hover:bg-brand-cream/50'}`}>
    <Icon size={18} className={`${active ? 'text-white' : 'text-brand-deep/20 group-hover:text-brand-primary'} transition-colors`} />
    <span className="font-bold uppercase tracking-widest text-[10px]">{label}</span>
  </button>
);

const OrderCard = ({ order }: any) => (
  <div className="bg-white rounded-[2rem] p-8 border border-brand-sand/30 shadow-sm hover:shadow-xl transition-premium group relative">
     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-brand-cream/50 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Package size={24} className="text-brand-primary" />
           </div>
           <div className="space-y-1">
              <h4 className="font-bold serif text-lg tracking-tight">Order #{order.display_id}</h4>
              <p className="text-[10px] text-brand-deep/40 uppercase font-black tracking-widest italic">{new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} Selection(s)</p>
           </div>
        </div>
        
        <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0">
           <div className="text-right">
              <span className="text-[9px] uppercase font-black tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1.5 rounded-full">{order.status}</span>
              <p className="text-2xl font-bold serif tracking-tighter italic mt-1">₹{order.total.toLocaleString()}</p>
           </div>
           <Link href={`/account/orders/${order.id}`} className="w-12 h-12 rounded-full border border-brand-sand/50 flex items-center justify-center hover:bg-brand-deep hover:text-white hover:border-brand-deep transition-premium">
              <ArrowRight size={18} />
           </Link>
        </div>
     </div>
  </div>
);
