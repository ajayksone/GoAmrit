import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../../modules/cms/service"
import { CMS_MODULE } from "../../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { handle } = req.params
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  
  const posts = await cmsService.listBlogPosts({ 
    handle: String(handle),
    is_published: true
  })

  if (posts.length === 0) {
    return res.status(404).json({ message: "Blog post not found" })
  }

  const post = posts[0]
  let categories: any[] = []
  
  if ((post as any).category_ids && (post as any).category_ids.length > 0) {
    const allCategories = await cmsService.listBlogCategories({
      id: (post as any).category_ids
    })
    categories = allCategories as any[]
  }

  res.json({ 
    post: {
      ...post,
      categories
    } 
  })
}
