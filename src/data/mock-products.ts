export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
}

export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Organic A2 Gir Cow Ghee",
    description: "Traditional Bilona method ghee from grass-fed Gir cows, naturally rich in Vitamin A and Omega-3.",
    price: 1850,
    image: "https://images.unsplash.com/photo-1589114407003-8d6263884813?auto=format&fit=crop&q=80&w=800",
    category: "Dairy",
    tags: ["Best Seller", "Organic"]
  },
  {
    id: "2",
    title: "Stone-Pressed Mustard Oil",
    description: "Cold-pressed Kacchi Ghani mustard oil, retaining all essential nutrients and authentic pungent flavor.",
    price: 450,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800",
    category: "Oils",
    tags: ["Raw", "Pure"]
  },
  {
    id: "3",
    title: "Natural Wild Honey",
    description: "Unfiltered, raw honey collected from the deep forests of central India. No added sugar.",
    price: 890,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800",
    category: "Sweeteners",
    tags: ["Natural"]
  },
  {
    id: "4",
    title: "Organic Turmeric Powder",
    description: "High-curcumin turmeric sourced from organic hill farms, carefully ground to preserve oil content.",
    price: 220,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d040cb5?auto=format&fit=crop&q=80&w=800",
    category: "Spices"
  },
  {
    id: "5",
    title: "Whole Wheat Sharbati Atta",
    description: "Freshly ground whole wheat flour from the finest Sharbati grains. High fiber and protein.",
    price: 380,
    category: "Grains",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "6",
    title: "Preservative-Free Mango Pickle",
    description: "Handcrafted sundried mango pickle made with home-style spices and cold-pressed oil.",
    price: 320,
    image: "https://images.unsplash.com/photo-1589114407003-8d6263884813?auto=format&fit=crop&q=80&w=800",
    category: "Gourmet"
  }
];
