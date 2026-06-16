import { sdk } from "@/lib/medusa";
import { notFound, permanentRedirect } from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import { RelatedProductsSidebar } from "@/components/blog/RelatedProductsSidebar";

export async function generateMetadata({ params }: any) {
  const { handle } = await params;
  
  try {
    const response = await sdk.client.fetch<any>(`/store/blog-posts/${handle}`)
    if (response.post) {
      return {
        title: `${response.post.title} | GoAmrit Organic Harvest`,
        description: response.post.content?.substring(0, 160).replace(/<[^>]*>/g, '') || `GoAmrit Blog`,
      };
    }
  } catch (err) {}

  return { title: "Not Found" };
}

export default async function Page({ params }: any) {
  const { category, handle } = await params;

  console.log(`[Server] Identifying Blog Post for handle: ${handle} in category: ${category}`);
  
  try {
    const response = await sdk.client.fetch<any>(`/store/blog-posts/${handle}`)
    if (response.post) {
      const post = response.post
      const primaryCategory = post.categories?.[0] || { name: "Stories", handle: "stories" }

      if (category !== primaryCategory.handle) {
         permanentRedirect(`/blog/${primaryCategory.handle}/${handle}`);
      }

      // Extract headings for Sidebar
      const headings: string[] = []
      let headingIndex = 0;
      
      const htmlContent = post.content?.replace(/<h2[^>]*>(.*?)<\/h2>/g, (match: string, innerText: string) => {
         if (headingIndex < 10) {
           headings.push(innerText.replace(/<[^>]*>/g, ''))
         }
         const replacement = match.replace('<h2', `<h2 id="section-${headingIndex}" class="scroll-mt-32"`);
         headingIndex++;
         return replacement;
      }) || "";

      // Fetch Related Products (limit to 4 as requested)
      let relatedProducts: any[] = []
      try {
        if (post.related_product_category_id) {
           const { products } = await sdk.store.product.list({ category_id: post.related_product_category_id, limit: 4 })
           relatedProducts = products
        } else {
           // Fallback: Try to fetch products matching the blog category name
           const { product_categories } = await sdk.store.category.list({ name: primaryCategory.name })
           if (product_categories && product_categories.length > 0) {
              const { products } = await sdk.store.product.list({ category_id: product_categories[0].id, limit: 4 })
              relatedProducts = products
           }
        }
        
        // Final fallback to top products if still empty
        if (relatedProducts.length < 1) {
           const { products } = await sdk.store.product.list({ limit: 4 })
           relatedProducts = products
        }
      } catch (err) {
        console.error("Error fetching related products:", err)
      }

      const publishedDate = new Date(post.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });

      return (
        <div className="bg-white min-h-screen">
          {/* Progress Bar (Sticky) */}
          <div className="fixed top-20 left-0 w-full h-1 bg-gray-100 z-50">
            <div className="h-full bg-brand-primary w-1/3 transition-all duration-300" />
          </div>

          <div className="md:pt-28 pt-20 pb-20">
            <div className="container mx-auto px-4 max-w-7xl">
              {/* Reference Header: Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 mb-20 items-stretch min-h-[500px]">
                {/* Left Side: Content */}
                <div className="flex flex-col justify-center py-12">
                   {/* Breadcrumbs */}
                  <nav className="flex items-center gap-x-2 text-[11px] font-medium text-gray-500 mb-12">
                    <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
                    <span className="text-gray-300 font-bold">&gt;</span>
                    <a href="/blog/stories" className="hover:text-brand-primary transition-colors">All Blogs</a>
                    <span className="text-gray-300 font-bold">&gt;</span>
                    <span className="text-gray-400 truncate max-w-[200px]">{post.title}</span>
                  </nav>

                  <div className="uppercase text-[12px] font-black text-brand-deep tracking-[0.1em] mb-8">
                     {primaryCategory.name}
                  </div>
                  
                  <h1 className="text-[42px] md:text-[56px] lg:text-[64px] font-black text-[#262626] leading-[1.1] tracking-[-0.02em] max-w-[580px]">
                    {post.title}
                  </h1>
                </div>

                {/* Right Side: Featured Image Banner */}
                <div className="relative rounded-[2rem] overflow-hidden bg-[#392010] flex items-center justify-center p-8 group">
                   {/* Background Pattern logic can go here if needed */}
                   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#fff_0%,transparent_70%)]" />
                   
                   <div className="relative z-10 w-full h-full">
                      {post.image_url ? (
                        <Image 
                          src={post.image_url} 
                          alt={post.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-1000"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                           {/* Empty placeholder to keep the layout consistent without text */}
                           <div className="w-16 h-px bg-white/20" />
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Author and Share (Standard for reading flow) */}
              <div className="max-w-4xl mb-12 flex flex-wrap items-center gap-6 py-6 border-b border-gray-100">
                <div className="flex items-center gap-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-sand flex items-center justify-center text-brand-deep font-bold border-2 border-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Author" className="w-full h-full object-cover" />
                  </div>
                  <div>
                      <p className="text-xs font-black text-brand-deep uppercase tracking-tighter mb-0">Ajay Kumar</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0">{publishedDate}</p>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />
                <div className="flex items-center gap-x-4">
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Share</span>
                   <div className="flex gap-x-2">
                      {['twitter', 'facebook', 'linkedin'].map(social => (
                        <button key={social} className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300">
                           <div className="w-3 h-3 flex items-center justify-center font-black text-[8px]">{social[0].toUpperCase()}</div>
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <aside className="lg:col-span-3 sticky top-32 hidden lg:block">
                  <div className="border-l-2 border-gray-100 pl-6 py-2">
                    <h5 className="text-[10px] font-black text-brand-deep uppercase tracking-[0.2em] mb-6">In This Story</h5>
                    <nav className="flex flex-col gap-y-4">
                      {headings.length > 0 ? headings.map((heading: string, i: number) => (
                        <a 
                          key={i} 
                          href={`#section-${i}`} 
                          className="text-xs font-bold text-gray-400 hover:text-brand-primary transition-all duration-300 flex items-start gap-x-3 group"
                        >
                          <span className="text-[9px] text-gray-200 group-hover:text-brand-primary">{String(i + 1).padStart(2, '0')}</span>
                          <span className="leading-tight">{heading}</span>
                        </a>
                      )) : (
                        <p className="text-[10px] text-gray-300 italic">No sections found</p>
                      )}
                    </nav>
                  </div>
                </aside>

                <article className="lg:col-span-6">
                  <div className="prose prose-lg max-w-none 
                    prose-headings:text-brand-deep prose-headings:font-black prose-headings:tracking-tighter
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:serif prose-h2:italic
                    prose-p:text-brand-deep/80 prose-p:leading-[1.8] prose-p:font-medium
                    prose-a:text-brand-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-3xl prose-img:shadow-xl
                  ">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  </div>
                </article>

                <aside className="lg:col-span-3 space-y-10">
                   {/* Related Products Section */}
                   <RelatedProductsSidebar products={relatedProducts} />

                   <div className="bg-brand-deep rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                      <h5 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-4 relative z-10">Subscribe</h5>
                      <h3 className="text-2xl font-black serif italic tracking-tighter mb-6 relative z-10">Join our organic ritual</h3>
                      <div className="space-y-4 relative z-10">
                         <input type="email" placeholder="your@email.com" className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary whitespace-nowrap" />
                         <button className="w-full bg-brand-primary text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-full hover:bg-white hover:text-brand-deep transition-all">Join Collective</button>
                      </div>
                   </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )
    }
  } catch (err) {
      console.error("Blog post error:", err);
  }

  return notFound();
}
