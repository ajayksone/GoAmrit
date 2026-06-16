import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../modules/cms/service"
import { CMS_MODULE } from "../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const [menu_items, count] = await cmsService.listAndCountMenuItems(
    {},
    {
      order: { order: "ASC" }
    }
  )

  res.json({
    menu_items,
    count,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const menu_item = await cmsService.createMenuItems(req.body as any)
  res.json({ menu_item })
}
