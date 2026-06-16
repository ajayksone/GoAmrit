import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../../modules/cms/service"
import { CMS_MODULE } from "../../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const menu_item = await cmsService.retrieveMenuItem(id)
  res.json({ menu_item })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const menu_item = await cmsService.updateMenuItems({ id, ...(req.body as any) })
  res.json({ menu_item })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteMenuItems(id)
  res.status(200).json({ id, object: "menu_item", deleted: true })
}
