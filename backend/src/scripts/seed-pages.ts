import CMSService from "../modules/cms/service"
import { CMS_MODULE } from "../modules/cms"

export default async function seedPages({ container }) {
  const cmsService: CMSService = container.resolve(CMS_MODULE)
  
  const pagesToCreate = [
    { title: "Home", handle: "home" },
    { title: "About Us", handle: "about-us" },
    { title: "Why GoAmrit", handle: "why-goamrit" },
    { title: "Our Story", handle: "our-story" },
    { title: "Farm Visit", handle: "farm-visit" },
    { title: "Our Team", handle: "our-team" },
    { title: "Events", handle: "events" },
    { title: "Quality Assurance", handle: "quality-assurance" },
    { title: "Testimonials", handle: "testimonials" },
    { title: "Our Philosophy", handle: "our-philosophy" },
    { title: "Lab Reports", handle: "lab-reports" },
    { title: "CSR Initiatives", handle: "csr-initiatives" },
    { title: "Farmers Market", handle: "farmers-market" },
    { title: "Shipping & Returns", handle: "shipping-returns" }
  ]

  for (const p of pagesToCreate) {
    const existing = await cmsService.listPages({ handle: p.handle })
    if (existing.length === 0) {
      await cmsService.createPages(p)
      console.log(`Created page: ${p.title}`)
    } else {
      console.log(`Page already exists: ${p.title}`)
    }
  }
}
