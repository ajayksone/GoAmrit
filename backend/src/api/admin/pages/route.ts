import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../modules/cms/service"
import { CMS_MODULE } from "../../../modules/cms"

export const config = {
  bodyParser: {
    sizeLimit: "50mb",
  },
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const [pages, count] = await cmsService.listAndCountPages(
    {},
    {
      take: req.query.take ? parseInt(req.query.take as string) : 20,
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
    }
  )

  res.json({
    pages,
    count,
    offset: req.query.skip,
    limit: req.query.take,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  
  if ((req.body as any).handle) {
    const existing = await cmsService.listPages({ handle: (req.body as any).handle })
    if (existing.length > 0) {
      return res.status(400).json({ 
        message: `Page with handle "${(req.body as any).handle}" already exists. Please choose a unique handle.`
      })
    }
  }

  const page = await cmsService.createPages(req.body as any)
  res.json({ page })
}
