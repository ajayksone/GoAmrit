import { model } from "@medusajs/framework/utils"

export const BlogTag = model.define("blog_tag", {
  id: model.id().primaryKey(),
  name: model.text(),
  handle: model.text().unique(),
})
