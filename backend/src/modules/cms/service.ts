import { MedusaService } from "@medusajs/framework/utils"
import { Page } from "./models/page"
import { Testimonial } from "./models/testimonial"
import { BlogPost } from "./models/blog-post"
import { BlogCategory } from "./models/blog-category"
import { BlogTag } from "./models/blog-tag"
import { MenuItem } from "./models/menu-item"
import { CMSSettings } from "./models/cms-settings"

export default class CMSService extends MedusaService({
  Page,
  Testimonial,
  BlogPost,
  BlogCategory,
  BlogTag,
  MenuItem,
  CMSSettings,
}) {
}
