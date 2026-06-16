import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../../modules/cms/service"
import { CMS_MODULE } from "../../../../modules/cms"

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
  const blog_post = await cmsService.retrieveBlogPost(req.params.id)

  res.json({
    blog_post,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  
  const blog_post = await cmsService.updateBlogPosts({
    id: req.params.id,
    ...req.body
  })

  res.json({ blog_post })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  await cmsService.deleteBlogPosts(req.params.id)
  res.status(200).json({ id: req.params.id, object: "blog_post", deleted: true })
}
