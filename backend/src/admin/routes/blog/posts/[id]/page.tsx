import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Input, Label, Button, Switch, Badge } from "@medusajs/ui"
import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Eye, Photo } from "@medusajs/icons"
import SEOExtension from "../../../../components/SEOExtension"

const EditBlogPostPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || "http://localhost:3000"
  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    content: "",
    image_url: "",
    is_published: false,
    category_ids: [] as string[],
    related_product_category_id: "" as string,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    seo_og_image: "",
  })

  const [categories, setCategories] = useState<any[]>([])
  const [productCategories, setProductCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const quillRef = useRef<any>(null)
  const featuredImageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, catRes, prodCatRes] = await Promise.all([
          fetch(`/admin/blog-posts/${id}`),
          fetch("/admin/blog-categories"),
          fetch("/admin/product-categories")
        ])
        
        if (postRes.ok && catRes.ok) {
          const postData = await postRes.json()
          const catData = await catRes.json()
          const prodCatData = await prodCatRes.json()
          
          setFormData({
            title: postData.blog_post.title || "",
            handle: postData.blog_post.handle || "",
            content: postData.blog_post.content || "",
            image_url: postData.blog_post.image_url || "",
            is_published: postData.blog_post.is_published || false,
            category_ids: postData.blog_post.category_ids || [],
            related_product_category_id: postData.blog_post.related_product_category_id || "",
            seo_title: postData.blog_post.seo_title || "",
            seo_description: postData.blog_post.seo_description || "",
            seo_keywords: postData.blog_post.seo_keywords || "",
            seo_og_image: postData.blog_post.seo_og_image || "",
          })
          setCategories(catData.blog_categories || [])
          setProductCategories(prodCatData.product_categories || [])
        } else {
          setError("Failed to fetch post data")
        }
      } catch (e) {
        console.error("Failed to fetch data", e)
        setError("An error occurred while fetching post data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    
    try {
      if (!formData.title) throw new Error("Title is required")
      
      // Client-side check for very large content (e.g. Base64 images)
      if (formData.content.length > 10 * 1024 * 1024) { // Roughly 10MB
        throw new Error("Content is too large! Please upload images to a server instead of pasting them directly as Base64.")
      }
      
      const response = await fetch(`/admin/blog-posts/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        // Show success or navigate back
        navigate("/blog/posts")
      } else {
        let message = "Failed to update post"
        if (response.status === 413 || response.status === 500) {
           // 500 is often returned by Medusa for PayloadTooLarge errors if not caught by middleware
           message = "The post content is too large (likely due to images). Please use smaller images or upload them to a file service."
        }
        try {
          const data = await response.json()
          message = data.message || message
        } catch (e) {
          // Ignore JSON parse error if it's not JSON
        }
        setError(message)
      }
    } catch (e: any) {
      console.error("Failed to update post", e)
      setError(e.message || "An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
     if (!window.confirm("Are you sure you want to delete this post?")) return
     
     try {
       const response = await fetch(`/admin/blog-posts/${id}`, {
         method: "DELETE",
       })
       if (response.ok) {
         navigate("/blog/posts")
       }
     } catch (e) {
       console.error("Failed to delete post", e)
     }
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("files", file)
    
    const response = await fetch("/admin/uploads", {
      method: "POST",
      body: formData,
    })
    
    if (!response.ok) throw new Error("Upload failed")
    
    const data = await response.json()
    return data.uploads[0].url
  }

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setUploading(true)
      const url = await handleUpload(file)
      setFormData(prev => ({ ...prev, image_url: url }))
    } catch (e: any) {
      setError("Failed to upload image: " + e.message)
    } finally {
      setUploading(false)
    }
  }

  const imageHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (file) {
        try {
          const url = await handleUpload(file)
          const quill = quillRef.current.getEditor()
          const range = quill.getSelection()
          quill.insertEmbed(range.index, 'image', url)
        } catch (e: any) {
          setError("Failed to upload editor image: " + e.message)
        }
      }
    }
  }

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), [])

  if (loading) return (
    <Container>
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400 animate-pulse font-medium">Loading editor...</p>
      </div>
    </Container>
  )

  return (
    <Container>
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
             <Heading level="h1">Edit Post</Heading>
             <Badge color={formData.is_published ? "green" : "orange"}>
                {formData.is_published ? "Published" : "Draft"}
             </Badge>
          </div>
          <div className="flex gap-x-2">
            <Button variant="secondary" type="button" onClick={() => navigate("/blog/posts")}>
              Back to Posts
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 flex flex-col gap-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
              <Input 
                id="title" 
                placeholder="Enter title here" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-2xl font-bold border-none focus:ring-0 placeholder:text-gray-300 h-14 px-4"
                required
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 min-h-[500px] flex flex-col shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center gap-x-2 text-sm text-gray-500">
                <span>Content</span>
              </div>
              <ReactQuill 
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={modules}
                style={{ height: '400px', display: 'flex', flexDirection: 'column' }}
                className="flex-1"
              />
            </div>

            <SEOExtension 
              data={{
                seo_title: formData.seo_title,
                seo_description: formData.seo_description,
                seo_keywords: formData.seo_keywords,
                seo_og_image: formData.seo_og_image
              }}
              onChange={(seo) => setFormData({ ...formData, ...seo })}
              title={formData.title}
              content={formData.content}
            />
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-x-2">
                 <span>⚠️</span>
                 <span>{error}</span>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-y-6">
            {/* Publish Box */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 font-semibold text-sm">
                Publish
              </div>
              <div className="p-4 flex flex-col gap-y-4 text-sm">
                <div className="flex items-center justify-between">
                   <span className="text-gray-500">Status:</span>
                   <span className="font-medium text-gray-900">{formData.is_published ? "Published" : "Draft"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published" className="text-sm text-gray-500">Enable visibility</Label>
                  <Switch 
                    id="is_published" 
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-500">Public URL:</span>
                   <a 
                    href={`${storefrontUrl}/blog/${(formData as any).categories?.[0]?.handle || 'stories'}/${formData.handle}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-x-1"
                   >
                     <Eye size={14} /> View Post
                   </a>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between gap-x-2">
                   <Button 
                    variant="transparent" 
                    className="text-red-500 hover:text-red-700 p-0 text-sm h-auto" 
                    type="button"
                    onClick={handleDelete}
                   >
                      Move to Bin
                   </Button>
                   <Button variant="primary" type="submit" disabled={saving} className="px-6">
                      {saving ? "Updating..." : "Update"}
                   </Button>
                </div>
              </div>
            </div>

            {/* URL Handle Box */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 font-semibold text-sm">
                URL Handle
              </div>
              <div className="p-4">
                <Input 
                  id="handle" 
                  placeholder="post-slug" 
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="bg-gray-50 border-gray-200 text-sm"
                />
              </div>
            </div>

            {/* Categories Box */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 font-semibold text-sm">
                Blog Categories
              </div>
              <div className="p-4">
                <div className="max-h-48 overflow-y-auto mb-4 border border-gray-100 rounded p-2 flex flex-col gap-y-2">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-x-2">
                        <input 
                          type="checkbox" 
                          id={`cat-${cat.id}`}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={formData.category_ids.includes(cat.id)}
                          onChange={(e) => {
                            const ids = e.target.checked 
                              ? [...formData.category_ids, cat.id]
                              : formData.category_ids.filter(id => id !== cat.id)
                            setFormData({ ...formData, category_ids: ids })
                          }}
                        />
                        <label htmlFor={`cat-${cat.id}`} className="text-sm text-gray-600 cursor-pointer">
                          {cat.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">No categories found</p>
                  )}
                </div>
                <Button variant="transparent" className="text-blue-500 p-0 text-xs hover:underline h-auto font-medium" onClick={() => navigate("/blog/categories")}>
                   + Add New Category
                </Button>
              </div>
            </div>

            {/* Product Category Box */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 font-semibold text-sm text-brand-primary">
                Sidebar Product Category
              </div>
              <div className="p-4">
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded text-sm px-3 py-2 outline-none focus:ring-1 focus:ring-brand-primary"
                  value={formData.related_product_category_id}
                  onChange={(e) => setFormData({ ...formData, related_product_category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {productCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <p className="mt-2 text-[10px] text-gray-400">Choose which product category to show in the blog sidebar.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 font-semibold text-sm flex items-center justify-between">
                <span>Featured Image</span>
                {uploading && <span className="text-[10px] text-blue-500 animate-pulse">Uploading...</span>}
              </div>
              <div className="p-4 flex flex-col gap-y-3">
                <input 
                  type="file" 
                  ref={featuredImageInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                />
                
                {formData.image_url ? (
                  <div className="relative group rounded overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={formData.image_url} alt="Preview" className="w-full h-40 object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-x-2">
                       <Button 
                        size="small" 
                        variant="secondary" 
                        type="button"
                        onClick={() => featuredImageInputRef.current?.click()}
                       >
                         Change
                       </Button>
                       <Button 
                        size="small" 
                        variant="transparent" 
                        className="text-white hover:text-red-400"
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: "" })}
                       >
                        Remove
                       </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center gap-y-3 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all group"
                    onClick={() => featuredImageInputRef.current?.click()}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                       <Photo className="text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">Featured image for the post</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <Label htmlFor="image_url_manual" className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 block">Or use external URL</Label>
                  <Input 
                    id="image_url_manual" 
                    placeholder="https://..." 
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default EditBlogPostPage
