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
      take: 100,
      skip: 0,
    }
  )

  res.json({
    blog_categories,
    count,
  })
}
