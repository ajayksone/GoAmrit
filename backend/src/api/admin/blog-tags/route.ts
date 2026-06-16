import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../modules/cms/service"
import { CMS_MODULE } from "../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const [blog_tags, count] = await cmsService.listAndCountBlogTags(
    {},
    {
      take: req.query.take ? parseInt(req.query.take as string) : 20,
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
    }
  )

  res.json({
    blog_tags,
    count,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  const blog_tag = await cmsService.createBlogTags(req.body as any)
  res.json({ blog_tag })
}
