import { model } from "@medusajs/framework/utils"

export const Page = model.define("page", {
  id: model.id().primaryKey(),
  title: model.text(),
  handle: model.text().unique(),
  content: model.json().nullable(),
  is_active: model.boolean().default(true),
  // SEO Fields
  seo_title: model.text().nullable(),
  seo_description: model.text().nullable(),
  seo_keywords: model.text().nullable(),
  seo_og_image: model.text().nullable(),
  metadata: model.json().nullable(),
})
