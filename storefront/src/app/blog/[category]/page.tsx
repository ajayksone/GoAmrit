import { sdk } from "@/lib/medusa";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function CategoryBlogPage({ params }: any) {
  const { category: catHandle } = await params;
  
  // Fetch Posts and Categories
  let posts: any[] = [];
  let category: any = null;
  
  try {
    const catRes = await sdk.client.fetch<any>("/store/blog-categories");
    category = (catRes.blog_categories || []).find((c: any) => c.handle === catHandle);
    
    if (!category) return notFound();

    const postRes = await sdk.client.fetch<any>("/store/blog-posts?take=100");
    posts = (postRes.blog_posts || []).filter((p: any) => p.category_ids?.includes(category.id));
  } catch (err) {
    console.error("Failed to fetch shop data", err);
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
                <Link href="/blog" className="hover:text-brand-primary transition-colors">Blogs</Link>
                <span>/</span>
                <span className="text-brand-deep">{category.name}</span>
             </nav>
             <h1 className="text-4xl md:text-5xl font-black serif italic tracking-tighter text-brand-deep uppercase">
                {category.name} <span className="text-brand-primary">Insights</span>
             </h1>
             <div className="w-20 h-1 bg-brand-primary mx-auto rounded-full mt-4" />
             <p className="max-w-xl mx-auto text-gray-400 text-sm font-medium italic pt-4">
                Exploring the heart of {category.name} through traditional wisdom, farm stories, and time-honored rituals.
             </p>
          </header>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts.length > 0 ? posts.map((post: any) => (
              <PostCard key={post.id} post={post} category={category} />
            )) : (
              <div className="col-span-full py-32 text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ArrowLeft size={32} className="text-gray-200" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-300 serif italic">No stories found here yet.</h3>
                 <Link href="/blog" className="inline-block mt-6 text-brand-primary font-black uppercase tracking-widest text-[10px] underline underline-offset-8">Explore All Stories</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function PostCard({ post, category }: { post: any, category: any }) {
  const url = `/blog/${category.handle}/${post.handle}`;
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
            <span className="text-brand-primary">{category.name}</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full" />
            <span className="text-gray-400 font-bold">{date}</span>
         </div>
         
         <Link href={url}>
           <h3 className="text-xl md:text-2xl font-bold text-brand-deep leading-snug group-hover:text-brand-primary transition-colors cursor-pointer tracking-tight">
             {post.title}
           </h3>
         </Link>

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
