import { MiddlewaresConfig } from "@medusajs/framework/http"
import { json } from "body-parser"
import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  },
})

const upload = multer({ storage })

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/admin/uploads",
      middlewares: [
        upload.array("files"),
      ],
    },
    {
      matcher: "/admin/blog-posts*",
      middlewares: [
        json({ limit: "50mb" }),
      ],
    },
    {
      matcher: "/admin/pages*",
      middlewares: [
        json({ limit: "50mb" }),
      ],
    },
  ],
}

