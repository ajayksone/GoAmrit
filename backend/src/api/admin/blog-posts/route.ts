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
  const [blog_posts, count] = await cmsService.listAndCountBlogPosts(
    {},
    {
      take: req.query.take ? parseInt(req.query.take as string) : 20,
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
    }
  )

  // Fetch categories for all posts to build View links
  const allCategoryIds = [...new Set(blog_posts.flatMap(p => p.category_ids || []))]
  let categoriesMap: Record<string, any> = {}
  
  if (allCategoryIds.length > 0) {
    const categories = await cmsService.listBlogCategories({ id: allCategoryIds })
    categoriesMap = categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat }), {})
  }

  const postsWithCategories = blog_posts.map(post => ({
    ...post,
    categories: (post.category_ids || []).map(id => categoriesMap[id]).filter(Boolean)
  }))

  res.json({
    blog_posts: postsWithCategories,
    count,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  
  if ((req.body as any).handle) {
    const existing = await cmsService.listBlogPosts({ handle: (req.body as any).handle })
    if (existing.length > 0) {
      return res.status(400).json({ 
        message: `Blog post with handle "${(req.body as any).handle}" already exists.`
      })
    }
  }

  const blog_post = await cmsService.createBlogPosts(req.body as any)
  res.json({ blog_post })
}
