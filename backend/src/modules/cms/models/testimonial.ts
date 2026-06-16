import { model } from "@medusajs/framework/utils"

export const Testimonial = model.define("testimonial", {
  id: model.id().primaryKey(),
  user_name: model.text(),
  content: model.text().nullable(),
  type: model.enum(["text", "video"]).default("text"),
  video_url: model.text().nullable(),
  thumbnail_url: model.text().nullable(),
  product_handle: model.text().nullable(),
  productTitle: model.text().nullable(),
  productThumb: model.text().nullable(),
  price: model.number().nullable(),
  rating: model.number().default(5),
  is_active: model.boolean().default(true),
})
