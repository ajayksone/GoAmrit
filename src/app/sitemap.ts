import { MetadataRoute } from 'next'
import { sdk } from '@/lib/medusa'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://goamrit.com' // Replace with production URL

  // Fetch all products for dynamic URLs
  let productUrls: any[] = []
  try {
    const { products } = await sdk.store.product.list()
    productUrls = products.map((product: any) => ({
      url: `${baseUrl}/${product.handle}`,
      lastModified: new Date(product.updated_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (e) {
    console.error("Sitemap fetch error:", e)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productUrls,
  ]
}
