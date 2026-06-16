import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../../modules/cms/service"
import { CMS_MODULE } from "../../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const testimonial = await cmsService.retrieveTestimonial(id)

  res.json({ testimonial })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const testimonial = await cmsService.updateTestimonials({
    id,
    ...req.body
  })

  res.json({ testimonial })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteTestimonials(id)

  res.json({ id, message: "Testimonial deleted successfully" })
}
