import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Leaf } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-brand-deep text-brand-cream/80 py-16 mt-32">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Leaf className="text-brand-gold" size={24} />
            <span className="text-2xl font-bold tracking-tighter text-white serif uppercase italic">GoAmrit</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            From our farms to your table, we bring you the purest organic dairy and farm-fresh products, 
            crafted with love and traditional methods that respect nature.
          </p>
          <div className="flex space-x-4 pt-2">
            <Link href="#" className="hover:text-brand-gold transition-colors"><Instagram size={20} /></Link>
            <Link href="#" className="hover:text-brand-gold transition-colors"><Facebook size={20} /></Link>
            <Link href="#" className="hover:text-brand-gold transition-colors"><Twitter size={20} /></Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white serif uppercase tracking-widest">Our Store</h3>
          <ul className="space-y-3 text-sm flex flex-col">
            <Link href="/shop" className="hover:text-white transition-colors">All Products</Link>
            <Link href="/desi-ghee" className="hover:text-white transition-colors">Dairy & Ghee</Link>
            <Link href="/edible-oil" className="hover:text-white transition-colors">Cold-Pressed Oils</Link>
            <Link href="/honey" className="hover:text-white transition-colors">Natural Sweeteners</Link>
            <Link href="/spices" className="hover:text-white transition-colors">Organic Spices</Link>
          </ul>
        </div>

        {/* Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white serif uppercase tracking-widest">Information</h3>
          <ul className="space-y-3 text-sm flex flex-col">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link>
            <Link href="/refund" className="hover:text-white transition-colors">Refund & Return Policy</Link>
            <Link href="/faq" className="hover:text-white transition-colors">General FAQs</Link>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white serif uppercase tracking-widest">Get In Touch</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-brand-gold mt-1 shrink-0" />
              <span>GoAmrit Farms, Village Kunjpura, Haryana, India.</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-brand-gold shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-brand-gold shrink-0" />
              <span>hello@goamrit.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-white/10 text-xs flex flex-col sm:flex-row justify-between items-center text-brand-cream/40">
        <p>&copy; {new Date().getFullYear()} GoAmrit Organic India. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0 uppercase tracking-widest font-semibold">
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
};
