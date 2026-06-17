import { sdk } from "@/lib/medusa";
import Link from "next/link";
import { Search, ArrowRight, Calendar } from "lucide-react";

export const metadata = {
  title: "Blogs | GoAmrit Organic India",
  description: "Traditional wisdom, organic farming stories, and health rituals from the heart of GoAmrit.",
};

export default async function BlogPage() {
  // Fetch Posts and Categories
  let posts: any[] = [];
  let categories: any[] = [];
  
  try {
    const postRes = await sdk.client.fetch<any>("/store/blog-posts?take=100");
    posts = postRes.blog_posts || [];
    
    const catRes = await sdk.client.fetch<any>("/store/blog-categories");
    categories = catRes.blog_categories || [];
  } catch (err) {
    console.error("Failed to fetch blog data", err);
  }

  return (
    <div className="bg-white min-h-screen">
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-[1300px]">
          
          {/* Page Header */}
          <header className="text-center mb-16 space-y-4">
             <nav className="flex items-center justify-center space-x-2 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-6">
                <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
                <span>/</span>
                <span className="text-brand-deep">Blogs</span>
             </nav>
             <h1 className="text-4xl md:text-5xl font-black serif italic tracking-tighter text-brand-deep uppercase">
                Our <span className="text-brand-primary">Blogs</span>
             </h1>
             <div className="w-20 h-1 bg-brand-primary mx-auto rounded-full mt-4" />
          </header>

          {/* Search & Categories */}
          <div className="max-w-5xl mx-auto mb-20 space-y-10">
             <div className="relative group max-w-xl mx-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-brand-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="SEARCH BLOGS" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-6 text-xs font-black tracking-widest uppercase focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                />
             </div>

             <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/blog" className="px-6 py-2.5 bg-brand-deep text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-deep/10 transition-all">
                   All
                </Link>
                {categories.map((cat: any) => (
                  <Link 
                    key={cat.id} 
                    href={`/blog/${cat.handle}`}
                    className="px-6 py-2.5 bg-gray-50 text-gray-400 hover:bg-brand-primary/5 hover:text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full transition-all"
                  >
                    {cat.name}
                  </Link>
                ))}
             </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination Placeholder */}
          {posts.length > 12 && (
            <div className="mt-24 flex items-center justify-center space-x-4">
               <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:text-white transition-all">1</button>
               <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:text-white transition-all">2</button>
               <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:text-white transition-all">
                  <ArrowRight size={16} />
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function PostCard({ post }: { post: any }) {
  const primaryCategory = post.categories?.[0] || { name: "Rituals", handle: "stories" };
  const url = `/blog/${primaryCategory.handle}/${post.handle}`;
  const date = new Date(post.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="group flex flex-col h-full bg-white">
      <Link href={url} className="relative aspect-[4/3] mb-6 overflow-hidden rounded-[20px] shadow-sm ring-1 ring-gray-100">
        <img 
          src={post.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000"} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
      </Link>
      
      <div className="flex flex-col flex-grow space-y-4 px-2">
         <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.1em]">
            <span className="text-brand-primary">{primaryCategory.name}</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full" />
            <span className="text-gray-400 font-bold">{date}</span>
         </div>
         
         <Link href={url}>
           <h3 className="text-xl md:text-2xl font-bold text-brand-deep leading-snug group-hover:text-brand-primary transition-colors cursor-pointer tracking-tight">
             {post.title}
           </h3>
         </Link>

         {/* Excerpt Placeholder - TBO style usually has a short 2 line teaser */}
         <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-medium italic">
           {post.seo_description || "Discover the essence of pure living and traditional organic wisdom from our family to yours..."}
         </p>

         <Link 
           href={url} 
           className="pt-2 flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest text-brand-deep group-hover:text-brand-primary transition-all underline decoration-brand-primary/30 underline-offset-8 decoration-2 hover:decoration-brand-primary"
         >
           <span>Read More</span>
           <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
         </Link>
      </div>
    </div>
  );
}
