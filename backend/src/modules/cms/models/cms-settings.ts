import { model } from "@medusajs/framework/utils"

export const CMSSettings = model.define("cms_settings", {
  id: model.id().primaryKey(),
  key: model.text().unique(), // e.g. 'blog_index'
  seo_title: model.text().nullable(),
  seo_description: model.text().nullable(),
  seo_keywords: model.text().nullable(),
  seo_og_image: model.text().nullable(),
  metadata: model.json().nullable(),
})
