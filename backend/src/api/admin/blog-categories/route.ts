import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../modules/cms/service"
import { CMS_MODULE } from "../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const [blog_categories, count] = await cmsService.listAndCountBlogCategories(
    {},
    {
      take: req.query.take ? parseInt(req.query.take as string) : 20,
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
    }
  )

  res.json({
    blog_categories,
    count,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const blog_category = await cmsService.createBlogCategories(req.body as any)
  res.json({ blog_category })
}
