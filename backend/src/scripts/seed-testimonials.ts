import { CMS_MODULE } from "../modules/cms"
import CMSService from "../modules/cms/service"
import { ExecArgs } from "@medusajs/framework/types"

export default async ({ container }: ExecArgs) => {
  const cmsService: CMSService = container.resolve(CMS_MODULE)

  const testimonials = [
    {
      user_name: "Anita Verma",
      content: "The A2 Ghee is pure magic! It reminds me of the ghee my grandmother used to make. Smells divine.",
      type: "text",
      rating: 5,
      is_active: true
    },
    {
       user_name: "Vikram Singh",
       content: "Finally found real organic honey without any sugar syrup. Great for early morning lemon water.",
       type: "text",
       rating: 4,
       is_active: true
    },
    {
       user_name: "Riya S.",
       type: "video",
       video_url: "https://www.rosierfoods.com/cdn/shop/videos/c/vp/13efe994c55741f19f7d39d83b20da85/13efe994c55741f19f7d39d83b20da85.SD-480p-1.2Mbps-54311062.mp4?v=0",
       thumbnail_url: "/testimonial_1.png",
       product_handle: "desi-ghee",
       productTitle: "Vedic A2 Gir Cow Ghee",
       productThumb: "/ghee_popular.png",
       price: 3370,
       rating: 5,
       is_active: true
    },
    {
       user_name: "Sameer Malhotra",
       type: "video",
       video_url: "https://www.rosierfoods.com/cdn/shop/videos/c/vp/13efe994c55741f19f7d39d83b20da85/13efe994c55741f19f7d39d83b20da85.SD-480p-1.2Mbps-54311062.mp4?v=0",
       thumbnail_url: "/testimonial_2.png",
       product_handle: "edible-oil",
       productTitle: "Wood-Pressed Mustard Oil",
       productThumb: "/oil_popular.png",
       price: 390,
       rating: 5,
       is_active: true
    }
  ]

  console.log("Seeding testimonials (with upsert/update)...")
  for (const t of testimonials) {
    const existing = await cmsService.listTestimonials({ user_name: t.user_name })
    if (existing.length > 0) {
      await cmsService.updateTestimonials({
        id: existing[0].id,
        ...t
      })
      console.log(`Updated testimonial: ${t.user_name}`)
    } else {
      await cmsService.createTestimonials(t)
      console.log(`Created testimonial: ${t.user_name}`)
    }
  }
}
