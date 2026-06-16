import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../../modules/cms/service"
import { CMS_MODULE } from "../../../../modules/cms"

export const config = {
  sizeLimit: "50mb",
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const page = await cmsService.retrievePage(id)

  res.json({ page })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const page = await cmsService.updatePages({ id, ...req.body as any })

  res.json({ page })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  await cmsService.deletePages(id)

  res.json({ id, object: "page", deleted: true })
}
