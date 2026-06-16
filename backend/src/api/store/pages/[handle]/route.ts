import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../../modules/cms/service"
import { CMS_MODULE } from "../../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { handle } = req.params
  console.log(`[Backend API] Fetching page for handle: ${handle}`);
  
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const pages = await cmsService.listPages({ 
    handle: String(handle),
    is_active: true
  })
  
  console.log(`[Backend API] Pages found for ${handle}:`, pages.length);

  if (pages.length === 0) {
    return res.status(404).json({ message: "Page not found" })
  }

  const response = { page: pages[0] }
  console.log(`[Backend API] Returning page: ${response.page.title}`);
  res.json(response)
}
