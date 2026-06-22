import { sdk } from "@/lib/medusa";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import CategoryClient from "@/components/category/CategoryClient";
import { notFound } from "next/navigation";
import Script from "next/script";

const categoryMap: Record<string, { name: string; description: string }> = {
  'desi-ghee': { name: 'Desi Ghee', description: 'Pure, hand-churned bilona cow ghee for everyday nourishment.' },
  'pickle': { name: 'Pickles', description: 'Homemade, sun-dried authentic Indian pickles rich in flavor.' },
  'pulses': { name: 'Pulses', description: 'Unpolished, farm-fresh dals and pulses packed with protein.' },
  'edible-oil': { name: 'Edible Oil', description: 'Wood-pressed, unrefined oils retaining natural nutrients.' },
  'honey': { name: 'Honey', description: 'Raw, unfiltered wild forest honey with natural immunity.' },
  'spices': { name: 'Spices', description: 'Aromatic, stone-ground authentic spices for rich taste.' },
  'atta': { name: 'Atta', description: 'Stone-ground, whole wheat and multigrain fresh flours.' }
};

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  
  if (categoryMap[slug]) {
    const categoryInfo = categoryMap[slug];
    return {
      title: `${categoryInfo.name} | GoAmrit Organic Harvest`,
      description: categoryInfo.description,
    };
  }

  // Check if it's a product
  try {
    const { products } = await sdk.store.product.list({ handle: slug });
    if (products.length > 0) {
      const product = products[0];
      return {
        title: `${product.title} | GoAmrit Organic Harvest`,
        description: product.description,
        openGraph: {
          title: product.title,
          description: product.description,
          images: [product.thumbnail || ""],
        },
      };
    }
  } catch (err) {
    console.error("Metadata fetch error:", err);
  }

  // Check if it's a CMS Page
  try {
    const response = await sdk.client.fetch<any>(`/store/pages/${slug}`)
    if (response.page) {
      return {
        title: `${response.page.title} | GoAmrit Organic Harvest`,
        description: response.page.metadata?.description || `GoAmrit ${response.page.title}`,
      };
    }
  } catch (err) {}

  // Check if it's a Blog Post
  try {
    const response = await sdk.client.fetch<any>(`/store/blog-posts/${slug}`)
    if (response.post) {
      return {
        title: `${response.post.title} | GoAmrit Organic Harvest`,
        description: response.post.content?.substring(0, 160) || `GoAmrit Blog`,
      };
    }
  } catch (err) {}

  return { title: "Not Found" };
}

export default async function Page({ params }: any) {
  const { slug } = await params;

  // Case 1: Category
  if (categoryMap[slug]) {
    console.log(`[Server] Detected category: ${slug}`);
    return <CategoryClient slug={slug} categoryInfo={JSON.parse(JSON.stringify(categoryMap[slug]))} />;
  }

  // Case 2: Product
  console.log(`[Server] Identifying product for slug: ${slug}`);
  try {
    // Fetch active regions dynamically
    const { regions } = await sdk.store.region.list();
    const activeRegionId = regions?.[0]?.id;

    const { products } = await sdk.store.product.list({ 
       handle: slug,
       ...(activeRegionId && { region_id: activeRegionId }),
       fields: "*variants,*variants.prices,*variants.calculated_price"
    });
    
      if (products.length > 0) {
        // Safe serialization for Client Components
        const product = JSON.parse(JSON.stringify(products[0]));
        const { products: allProducts } = await sdk.store.product.list({
           ...(activeRegionId && { region_id: activeRegionId }),
           fields: "*variants,*variants.prices,*variants.calculated_price"
        });
        const relatedProducts = JSON.parse(JSON.stringify(
          allProducts.filter((p: any) => p.id !== product.id).slice(0, 4)
        ));

        const jsonLd = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.title,
          "image": [product.thumbnail],
          "description": product.description,
          "sku": product.id,
          "brand": { "@type": "Brand", "name": "GoAmrit" },
          "offers": {
            "@type": "Offer",
            "url": `https://goamrit.com/${product.handle}`,
            "priceCurrency": "INR",
            "price": product.variants?.[0]?.calculated_price?.calculated_amount || product.variants?.[0]?.prices?.find((p: any) => p.currency_code === "inr")?.amount || 0,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
          }
        };

        return (
          <>
            <Script
              id="product-jsonld"
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient 
              product={product} 
              relatedProducts={relatedProducts} 
            />
          </>
        );
      }
    } catch (error) {
      console.error("Product handle page error:", error);
    }

  // Case 3: CMS Page
  console.log(`[Server] Identifying CMS page for slug: ${slug}`);
  try {
    const response = await sdk.client.fetch<any>(`/store/pages/${slug}`)
    console.log(`[Server] CMS API response for ${slug}:`, JSON.stringify(response));
    if (response.page) {
      const page = response.page
      console.log(`[Server] Rendering CMS page: ${page.title}`);
      return (
        <div className="pt-32 pb-20 bg-brand-cream/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <header className="mb-12 text-center space-y-4">
              <span className="text-[10px] uppercase font-black tracking-[0.5em] text-brand-primary italic">GoAmrit Ritual</span>
              <h1 className="text-4xl md:text-6xl font-black serif italic tracking-tighter text-brand-deep">
                {page.title}
              </h1>
              <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full" />
            </header>

            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-lg shadow-brand-sand/10 border border-brand-sand/20 prose prose-brand max-w-none prose-p:text-brand-deep/80 prose-p:italic prose-p:font-medium prose-p:leading-relaxed">
              {typeof page.content === 'object' && page.content?.text ? (
                <div className="whitespace-pre-wrap">{page.content.text}</div>
              ) : typeof page.content === 'string' ? (
                <div className="whitespace-pre-wrap">{page.content}</div>
              ) : (
                <pre className="text-xs p-4 bg-gray-50 rounded-xl overflow-auto">
                  {JSON.stringify(page.content, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )
    }
  } catch (err) {
    console.error(`[Server] CMS page fetch error for ${slug}:`, err);
  }

  // Case 4: Blog Post (Redirect to new URL structure)
  console.log(`[Server] Checking for Blog Post redirect for slug: ${slug}`);
  try {
    const response = await sdk.client.fetch<any>(`/store/blog-posts/${slug}`)
    if (response.post) {
      const post = response.post
      const categoryHandle = post.categories?.[0]?.handle || "stories"
      // In Next.js App Router, we usually use redirect() from next/navigation
      // but since this is a Server Component inside a multi-purpose route,
      // we can just import and use it.
      const { redirect } = await import("next/navigation")
      redirect(`/blog/${categoryHandle}/${slug}`)
    }
  } catch (err) {}

  // Case 4: Not Found
  console.log(`[Server] SLUG NOT FOUND: ${slug}`);
  return notFound();
}
