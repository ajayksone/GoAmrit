import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../modules/cms/service"
import { CMS_MODULE } from "../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const [testimonials, count] = await cmsService.listAndCountTestimonials(
    req.query as any,
    req.query.select ? { select: req.query.select as any } : {}
  )

  res.json({ testimonials, count })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const testimonial = await cmsService.createTestimonials(req.body as any)

  res.json({ testimonial })
}
