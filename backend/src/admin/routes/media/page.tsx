import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, toast } from "@medusajs/ui"
import { useState, useEffect, useRef } from "react"
import { Photo, Trash, SquareTwoStack, Plus } from "@medusajs/icons"

const MediaLibraryPage = () => {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchFiles = async () => {
    try {
      const response = await fetch("/admin/media")
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      }
    } catch (e) {
      console.error("Failed to fetch media", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploading(true)
    const formData = new FormData()
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i])
    }

    try {
      setUploading(true)
      const response = await fetch("/admin/uploads", {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        toast.success("Success", { description: "Files uploaded successfully" })
        // Small delay to allow filesystem to sync
        setTimeout(() => {
          fetchFiles()
        }, 500)
      } else {
        toast.error("Error", { description: "Failed to upload files" })
      }
    } catch (e) {
      toast.error("Error", { description: "An error occurred during upload" })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchFiles()
  }

  const deleteFile = async (name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const response = await fetch(`/admin/media/${name}`, {
        method: "DELETE",
      })
      if (response.ok) {
        toast.success("Deleted", { description: "File removed successfully" })
        setFiles(files.filter(f => f.name !== name))
      } else {
        toast.error("Error", { description: "Could not delete file" })
      }
    } catch (e) {
      console.error("Delete failed", e)
    }
  }

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    toast.success("Copied", { description: "URL copied to clipboard" })
  }

  return (
    <Container>
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <Heading level="h1">Media Library</Heading>
          <div className="flex gap-x-2">
            <Button 
              variant="secondary" 
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={handleUpload}
            />
            <Button 
              variant="primary" 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-x-2"
            >
              <Plus size={16} /> 
              {uploading ? "Uploading..." : "Upload Media"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 animate-pulse font-medium">Loading media...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map((file) => (
              <div 
                key={file.name} 
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                  {file.type === "image" ? (
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-full object-contain" 
                    />
                  ) : file.type === "video" ? (
                    <div className="flex flex-col items-center gap-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Video</span>
                      <video className="w-full h-full object-contain pointer-events-none">
                        <source src={file.url} />
                      </video>
                    </div>
                  ) : (
                    <Photo className="text-gray-300" size={32} />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-x-2">
                    <button 
                      onClick={() => copyToClipboard(file.url)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 hover:text-blue-500 transition-colors shadow-sm"
                      title="Copy URL"
                    >
                      <SquareTwoStack size={16} />
                    </button>
                    <button 
                      onClick={() => deleteFile(file.name)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors shadow-sm"
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-2">
                  <p className="text-[10px] font-medium text-gray-600 truncate mb-1" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[9px] text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
            
            {files.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-gray-200 rounded-lg h-64 flex flex-col items-center justify-center text-gray-400 gap-y-2">
                <Photo size={32} strokeWidth={1} />
                <p className="font-medium">No media items found</p>
                <Button variant="transparent" onClick={() => fileInputRef.current?.click()} className="text-blue-500">
                  Upload your first file
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Media Library",
  // icon: Photo,
})

export default MediaLibraryPage
