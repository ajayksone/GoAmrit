import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { file } = req.params
  const filePath = path.join(process.cwd(), "static", file)

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found")
  }

  // Get file extension to set content type
  const ext = path.extname(file).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  }

  const contentType = mimeTypes[ext] || 'application/octet-stream'
  
  const stream = fs.createReadStream(filePath)
  res.setHeader('Content-Type', contentType)
  stream.pipe(res)
}
