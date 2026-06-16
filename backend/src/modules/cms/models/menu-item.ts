import { model } from "@medusajs/framework/utils"

export const MenuItem = model.define("menu_item", {
  id: model.id().primaryKey(),
  label: model.text(),
  url: model.text().nullable(),
  type: model.enum(['page', 'blog_category', 'custom']).default('custom'),
  reference_id: model.text().nullable(),
  parent_id: model.text().nullable(),
  order: model.number().default(0),
  menu_key: model.text().default('header'), // e.g. 'header', 'footer'
  metadata: model.json().nullable(),
})
