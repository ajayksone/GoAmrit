import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CMSService from "../../../modules/cms/service"
import { CMS_MODULE } from "../../../modules/cms"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const cmsService: CMSService = req.scope.resolve(CMS_MODULE)
  
  const [blog_posts, count] = await cmsService.listAndCountBlogPosts(
    { is_published: true },
    {
      take: req.query.take ? parseInt(req.query.take as string) : 20,
      skip: req.query.skip ? parseInt(req.query.skip as string) : 0,
    }
  )

  // Fetch categories for all posts
  const allCategoryIds = [...new Set(blog_posts.flatMap(p => p.category_ids || []))]
  let categoriesMap: Record<string, any> = {}
  
  if (allCategoryIds.length > 0) {
    const categories = await cmsService.listBlogCategories({ id: allCategoryIds })
    categoriesMap = categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat }), {})
  }

  const postsWithCategories = blog_posts.map((post: any) => ({
    ...post,
    categories: (post.category_ids || []).map((id: string) => categoriesMap[id]).filter(Boolean)
  }))

  res.json({
    blog_posts: postsWithCategories,
    count,
  })
}
