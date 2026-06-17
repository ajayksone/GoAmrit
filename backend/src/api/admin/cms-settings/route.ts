import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../modules/cms/service"
import { CMS_MODULE } from "../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { key } = req.query
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  
  const [settings] = await cmsService.listCMSSettings({ key: key as string })
  res.json({ settings: settings || null })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id, key, ...rest } = req.body as any
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  
  let settings
  if (id) {
    settings = await cmsService.updateCMSSettings({ id, ...rest })
  } else {
    // Check if key exists
    const existing = await cmsService.listCMSSettings({ key })
    if (existing.length > 0) {
      settings = await cmsService.updateCMSSettings({ id: existing[0].id, ...rest })
    } else {
      settings = await cmsService.createCMSSettings({ key, ...rest })
    }
  }
  
  res.json({ settings })
}
