"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, ArrowRight, CreditCard, Box, MapPin, Truck, Leaf, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { sdk } from "@/lib/medusa";

export default function CheckoutPage() {
  const { cart, isLoading, refreshCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const [address, setAddress] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    country_code: "in",
    province: "",
    postal_code: "",
    phone: "",
    email: ""
  });

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const updateCartAddress = async () => {
    if (!cart?.id) return;
    try {
      setIsProcessing(true);
      await sdk.store.cart.update(cart.id, {
        shipping_address: address,
        email: address.email
      });
      setStep(2);
    } catch (e) {
      console.error("Error updating cart address:", e);
      alert("Failed to update address. Please check your details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiateRazorpayPayment = async () => {
    if (!cart?.id) return;
    
    try {
      setIsProcessing(true);
      
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // 1. Initiate Payment Session in Medusa
      const { cart: updatedCart } = await sdk.store.payment.initiatePaymentSession(cart, {
        provider_id: "razorpay"
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_YourKeyPlaceholder", 
        amount: updatedCart.total, // Medusa total is already in paise/cents for INR
        currency: "INR",
        name: "GoAmrit",
        description: "Organic Harvest Purchase",
        order_id: (updatedCart as any).payment_collection?.payment_sessions?.find((s: any) => s.provider_id === "razorpay")?.data?.id,
        handler: async function (response: any) {
           // On success, complete the cart in Medusa
           try {
              const { type, order } = await sdk.store.cart.complete(cart.id);
              if (type === "order") {
                setOrder(order);
                setIsOrderConfirmed(true);
              } else {
                alert("Payment received but order creation failed. Our farmers will contact you.");
              }
           } catch (err) {
              console.error("Completion error:", err);
           }
        },
        prefill: {
          name: `${address.first_name} ${address.last_name}`,
          email: address.email,
          contact: address.phone
        },
        theme: {
          color: "#2d5a27"
        }
      };

      const rzp = (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert("Harvery interrupted: " + response.error.description);
      });
      rzp.open();

    } catch (e) {
      console.error("Payment initiation failed:", e);
      // For demo purposes, we allow skip to confirmation if keys aren't set
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY) {
        setStep(3); // Show manual confirmation
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isOrderConfirmed) {
    return (
      <div className="min-h-screen bg-brand-cream/20 flex items-center justify-center p-4">
         <div className="bg-white rounded-[3rem] p-12 md:p-24 text-center max-w-2xl shadow-2xl border border-brand-sand/30 space-y-12 animate-fadeIn">
            <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto">
               <CheckCircle2 size={48} className="text-brand-primary" />
            </div>
            <div className="space-y-4">
               <h1 className="text-4xl font-bold serif tracking-tight">Ritual <span className="text-brand-primary italic">Complete.</span></h1>
               <p className="text-brand-deep/60 leading-relaxed font-light italic">Your organic selection is being harvested. Order ID: <span className="font-bold text-brand-deep">#{order?.display_id || "7821"}</span></p>
            </div>
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Link href="/account" className="bg-brand-deep text-white py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-primary transition-premium">Track Shipment</Link>
               <Link href="/" className="border-2 border-brand-sand text-brand-deep/60 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:border-brand-deep hover:text-brand-deep transition-premium">Back To Home</Link>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream/10 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-12 lg:py-24 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          <div className="lg:col-span-8 flex-grow space-y-12">
             <div className="flex items-center justify-between pb-8 border-b border-brand-sand/30">
                <Link href="/cart" className="flex items-center space-x-2 text-brand-deep/60 hover:text-brand-primary transition-colors font-bold uppercase tracking-widest text-[10px]">
                   <ArrowLeft size={14} />
                   <span>Return To Basket</span>
                </Link>
                <h1 className="text-3xl font-bold serif tracking-tight uppercase tracking-widest">Checkout <span className="text-brand-primary italic font-normal">Ritual.</span></h1>
             </div>

             <div className="flex items-center justify-between max-w-md mx-auto relative px-4">
                <div className="absolute top-1/2 left-0 w-full h-px bg-brand-sand/30 -z-10" />
                {[1, 2].map((s) => (
                   <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border transition-premium ${step >= s ? 'bg-brand-deep text-white border-brand-deep shadow-xl' : 'bg-white text-brand-deep/30 border-brand-sand/50'}`}>
                      {s === 1 ? <MapPin size={16} /> : <CreditCard size={16} />}
                   </div>
                ))}
             </div>

             <div className="space-y-16 animate-fadeIn">
                {step === 1 && (
                  <div className="space-y-10">
                     <div className="space-y-6 bg-white p-10 rounded-3xl shadow-sm border border-brand-sand/30">
                        <h2 className="text-xl font-bold serif italic mb-8 pb-3 border-b border-brand-sand/20">Delivery Coordinates (India Focus)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-deep/40 pl-2">First Name</label>
                              <input value={address.first_name} name="first_name" onChange={handleAddressChange} placeholder="Arjun" className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-2xl py-4 px-6 text-sm outline-none focus:bg-white focus:border-brand-primary/30 transition-premium" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-deep/40 pl-2">Last Name</label>
                              <input value={address.last_name} name="last_name" onChange={handleAddressChange} placeholder="Sharma" className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-2xl py-4 px-6 text-sm outline-none focus:bg-white focus:border-brand-primary/30 transition-premium" />
                           </div>
                           <div className="space-y-2 md:col-span-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-deep/40 pl-2">Harvest Address (Line 1)</label>
                              <input value={address.address_1} name="address_1" onChange={handleAddressChange} placeholder="Flat/House No, Building, Street" className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-2xl py-4 px-6 text-sm outline-none focus:bg-white focus:border-brand-primary/30 transition-premium" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-deep/40 pl-2">City / Village</label>
                              <input value={address.city} name="city" onChange={handleAddressChange} placeholder="Jaipur" className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-2xl py-4 px-6 text-sm outline-none focus:bg-white focus:border-brand-primary/30 transition-premium" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-deep/40 pl-2">State / Province</label>
                              <select value={address.province} name="province" onChange={handleAddressChange} className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-2xl py-4 px-6 text-sm outline-none focus:bg-white focus:border-brand-primary/30 transition-premium appearance-none">
                                 <option value="">Select State</option>
                                 {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-deep/40 pl-2">Indian Pincode</label>
                              <input value={address.postal_code} name="postal_code" onChange={handleAddressChange} placeholder="302001" className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-2xl py-4 px-6 text-sm outline-none focus:bg-white focus:border-brand-primary/30 transition-premium" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-deep/40 pl-2">Contact Mobile</label>
                              <input value={address.phone} name="phone" onChange={handleAddressChange} placeholder="+91 99999..." className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-2xl py-4 px-6 text-sm outline-none focus:bg-white focus:border-brand-primary/30 transition-premium" />
                           </div>
                           <div className="space-y-2 md:col-span-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-deep/40 pl-2">Email for Recipe & Tracking</label>
                              <input value={address.email} name="email" onChange={handleAddressChange} type="email" placeholder="arjun@wellness.com" className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-2xl py-4 px-6 text-sm outline-none focus:bg-white focus:border-brand-primary/30 transition-premium" />
                           </div>
                        </div>
                     </div>
                     <button 
                        onClick={updateCartAddress}
                        disabled={isProcessing}
                        className="w-full sm:w-fit bg-brand-deep text-white px-16 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand-primary transition-premium shadow-2xl shadow-brand-deep/20 flex items-center justify-center space-x-4 ml-auto group disabled:opacity-50"
                     >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <><span>Select Payment Path</span> <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></>}
                     </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-10">
                     <div className="space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-brand-sand/30">
                        <h2 className="text-xl font-bold serif italic mb-8 pb-3 border-b border-brand-sand/20">Payment Rituals</h2>
                        <div className="space-y-4">
                           <PaymentOption 
                              title="Razorpay (India Secure)" 
                              description="UPI, GooglePay, Cards & NetBanking" 
                              icon={ShieldCheck} 
                              active 
                           />
                           <p className="text-[10px] text-brand-deep/40 italic px-4">Trusted by 10,000+ Wellness seekers across India.</p>
                        </div>
                     </div>
                     <div className="flex justify-between items-center pt-8">
                        <button onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest text-brand-deep/40 hover:text-brand-deep transition-colors">Go Back</button>
                        <button 
                           onClick={initiateRazorpayPayment}
                           disabled={isProcessing}
                           className="w-full sm:w-fit bg-brand-primary text-white px-20 py-6 rounded-full font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-brand-deep transition-premium shadow-2xl shadow-brand-primary/30 flex items-center justify-center space-x-4 group disabled:opacity-50"
                        >
                           {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><span>Harvest With Razorpay</span> <ArrowRight size={18} /></>}
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>

          {/* Sidebar Order Summary */}
          <aside className="lg:w-[400px] w-full sticky top-32 space-y-8">
             <div className="bg-brand-deep/95 backdrop-blur-md rounded-[2.5rem] p-10 text-white shadow-2xl transform hover:scale-[1.02] transition-premium">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-gold border-b border-brand-cream/10 pb-6 italic">Commitment Summary</h3>
                <div className="space-y-6 pt-8 max-h-[400px] overflow-y-auto custom-scrollbar">
                   {cart?.items?.map((item: any) => (
                      <div key={item.id} className="flex gap-4 items-center group">
                         <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-cream/10 shrink-0">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover grayscale-20 brightness-90 group-hover:brightness-100 transition-premium" />
                         </div>
                         <div className="flex-grow space-y-1">
                            <h4 className="text-[11px] font-bold serif italic text-brand-cream/90 truncate">{item.title}</h4>
                            <div className="flex items-center justify-between text-[9px] uppercase font-black tracking-widest text-brand-gold/60">
                               <span>{item.quantity} Unit(s)</span>
                               <span>₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="space-y-4 pt-10 mt-10 border-t border-brand-cream/10 text-[10px] font-black uppercase tracking-[0.2em] text-brand-cream/40">
                   <div className="flex justify-between items-center text-brand-cream/80">
                      <span>Harvest Subtotal</span>
                      <span>₹{(cart?.item_subtotal || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center italic text-brand-gold">
                      <span>Sustainable Delivery</span>
                      <span>{(cart?.shipping_total || 0) === 0 ? "Complimentary" : "₹" + (cart?.shipping_total || 0).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-2xl font-bold serif text-white pt-6 text-right">
                      <span className="text-[10px] mt-2 italic">Total Commitment</span>
                      <span className="tracking-tighter italic">₹{(cart?.total || 0).toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const PaymentOption = ({ title, description, icon: Icon, active = false }: any) => (
  <button className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-premium group ${active ? 'bg-brand-cream/50 border-brand-primary shadow-sm' : 'bg-white border-brand-sand/30 hover:border-brand-deep hover:bg-brand-cream/10'}`}>
     <div className="flex items-center space-x-5">
        <div className={`p-4 rounded-xl transition-premium ${active ? 'bg-brand-primary text-white rotate-6' : 'bg-brand-sand/20 text-brand-deep/40 group-hover:rotate-12'}`}>
           <Icon size={20} />
        </div>
        <div className="text-left space-y-1">
           <h4 className={`text-sm font-bold serif uppercase tracking-widest ${active ? 'text-brand-primary' : 'text-brand-deep/80'}`}>{title}</h4>
           <p className="text-[10px] text-brand-deep/40 italic font-light tracking-wide">{description}</p>
        </div>
     </div>
     <div className={`w-5 h-5 rounded-full border-2 p-1 transition-premium ${active ? 'border-brand-primary bg-brand-primary ring-4 ring-brand-primary/10' : 'border-brand-sand/50'}`}>
        {active && <div className="w-full h-full bg-white rounded-full" />}
     </div>
  </button>
);
