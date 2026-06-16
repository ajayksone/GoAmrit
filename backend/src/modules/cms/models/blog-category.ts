import { model } from "@medusajs/framework/utils"

export const BlogCategory = model.define("blog_category", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text().unique(),
  // SEO Fields
  seo_title: model.text().nullable(),
  seo_description: model.text().nullable(),
  seo_keywords: model.text().nullable(),
  seo_og_image: model.text().nullable(),
})
