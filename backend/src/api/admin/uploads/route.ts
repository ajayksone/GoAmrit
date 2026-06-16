import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const files = (req as any).files as any[]
  
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" })
  }

  const staticDir = path.join(process.cwd(), "static")
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true })
  }

  const uploadedFiles = files.map(file => {
    // Generate a unique filename if multer memory storage doesn't provide one
    let targetFilename = file.filename;
    
    if (!targetFilename) {
      // Clean original name
      const safeOriginalName = (file.originalname || "upload.file").replace(/[^a-zA-Z0-9.-]/g, "_")
      targetFilename = `${Date.now()}-${safeOriginalName}`
      
      const targetPath = path.join(staticDir, targetFilename)
      
      // Save it out
      if (file.buffer) {
        fs.writeFileSync(targetPath, file.buffer)
      } else if (file.path) {
        fs.copyFileSync(file.path, targetPath)
      }
    } else {
      // If it has file.filename from diskStorage, ensure it's in the static folder
      if (file.path && !file.path.includes("static")) {
        fs.copyFileSync(file.path, path.join(staticDir, targetFilename))
      }
    }

    return {
      url: `${process.env.BACKEND_URL || 'http://localhost:9000'}/static/${targetFilename}`,
      key: targetFilename,
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
    }
  })

  res.json({ files: uploadedFiles })
}
