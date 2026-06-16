import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const staticDir = path.join(process.cwd(), "static")
  
  if (!fs.existsSync(staticDir)) {
    return res.json({ files: [] })
  }

  const fileNames = fs.readdirSync(staticDir)
  
  const files = fileNames.map(name => {
    const stats = fs.statSync(path.join(staticDir, name))
    const ext = path.extname(name).toLowerCase()
    let type = "other"
    
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext)) {
      type = "image"
    } else if ([".mp4", ".webm", ".ogg"].includes(ext)) {
      type = "video"
    }

    return {
      name,
      url: `/static/${name}`,
      size: stats.size,
      created_at: stats.mtime,
      type
    }
  }).sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
  res.setHeader("Pragma", "no-cache")
  res.setHeader("Expires", "0")
  res.json({ files })
}
