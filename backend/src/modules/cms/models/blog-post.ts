import { model } from "@medusajs/framework/utils"

export const BlogPost = model.define("blog_post", {
  id: model.id().primaryKey(),
  title: model.text(),
  handle: model.text().unique(),
  content: model.text().nullable(),
  image_url: model.text().nullable(),
  is_published: model.boolean().default(false),
  published_at: model.dateTime().nullable(),
  category_ids: model.json().nullable(),
  tags: model.json().nullable(),
  related_product_category_id: model.text().nullable(),
  // SEO Fields
  seo_title: model.text().nullable(),
  seo_description: model.text().nullable(),
  seo_keywords: model.text().nullable(),
  seo_og_image: model.text().nullable(),
})
