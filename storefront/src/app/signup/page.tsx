"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Loader2, Leaf, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await register(formData);
      router.push("/account");
    } catch (err: any) {
      setError("Email already in harvest database. Please login or use another.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl border border-brand-sand/30 space-y-12 animate-fadeInBottom">
        <div className="text-center space-y-4">
           <div className="inline-block bg-brand-primary/10 p-4 rounded-2xl mb-4">
              <ShieldCheck size={32} className="text-brand-primary" />
           </div>
           <h1 className="text-3xl font-bold serif tracking-tight">Join The <span className="text-brand-primary italic text-brand-gold">Community.</span></h1>
           <p className="text-brand-deep/40 text-[10px] uppercase font-bold tracking-[0.2em]">Start your organic wellness journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs py-3 px-5 rounded-2xl border border-red-100 italic text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-deep/60 pl-4">First Identity</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-deep/20">
                     <User size={18} />
                  </div>
                  <input value={formData.first_name} name="first_name" onChange={handleChange} required placeholder="Arjun" className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-full py-5 pl-16 pr-8 text-sm outline-none focus:bg-white focus:border-brand-primary transition-premium" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-deep/60 pl-4">Last Identity</label>
                <input value={formData.last_name} name="last_name" onChange={handleChange} required placeholder="Sharma" className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-full py-5 px-8 text-sm outline-none focus:bg-white focus:border-brand-primary transition-premium" />
             </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-deep/60 pl-4">Email Address</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-deep/20 group-focus-within:text-brand-primary transition-colors">
                   <Mail size={18} />
                </div>
                <input value={formData.email} name="email" onChange={handleChange} type="email" placeholder="arjun@wellness.com" required className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-full py-5 pl-16 pr-8 text-sm outline-none focus:bg-white focus:border-brand-primary transition-premium italic" />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-deep/60 pl-4">Create Secret Word</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-deep/20 group-focus-within:text-brand-primary transition-colors">
                   <Lock size={18} />
                </div>
                <input value={formData.password} name="password" onChange={handleChange} type="password" placeholder="••••••••" required className="w-full bg-brand-cream/20 border border-brand-sand/40 rounded-full py-5 pl-16 pr-8 text-sm outline-none focus:bg-white focus:border-brand-primary transition-premium" />
              </div>
           </div>

           <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-primary text-white py-6 rounded-full font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-brand-deep transition-premium shadow-2xl shadow-brand-primary/20 flex items-center justify-center space-x-4 group disabled:opacity-50 active:scale-[0.98]"
           >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><span>Complete Enrollment</span> <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" /></>}
           </button>
        </form>

        <div className="text-center pt-8 border-t border-brand-sand/20 space-y-4">
           <p className="text-xs text-brand-deep/40 italic">Already parts of our harvest community?</p>
           <Link href="/login" className="inline-flex items-center space-x-2 text-brand-primary hover:text-brand-deep font-bold uppercase tracking-widest text-[11px] transition-colors group">
              <span>Return To Login</span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
           </Link>
        </div>
      </div>
    </div>
  );
}
