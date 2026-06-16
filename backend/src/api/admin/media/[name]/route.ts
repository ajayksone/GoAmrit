import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { name } = req.params
  const filePath = path.join(process.cwd(), "static", name)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" })
  }

  try {
    fs.unlinkSync(filePath)
    res.json({ success: true, message: "File deleted" })
  } catch (e: any) {
    res.status(500).json({ message: "Failed to delete file", error: e.message })
  }
}
