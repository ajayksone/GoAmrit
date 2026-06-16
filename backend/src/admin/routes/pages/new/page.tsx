import { useNavigate } from "react-router-dom"
import { Container, Heading, Input, Label, Button, Switch, Badge } from "@medusajs/ui"
import { useState, useMemo, useRef } from "react"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import SEOExtension from "../../../components/SEOExtension"

const NewPage = () => {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const quillRef = useRef<any>(null)

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    content: "",
    is_active: true,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    seo_og_image: "",
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const payload = {
        ...formData,
        handle: formData.handle || formData.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      }

      const response = await fetch("/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        navigate("/pages")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to create page")
      }
    } catch (e) {
      console.error("Error creating page", e)
      alert("Error creating page")
    } finally {
      setIsSaving(false)
    }
  }

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }), [])

  return (
    <Container>
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <Heading level="h1">New Website Page</Heading>
          <Button variant="secondary" onClick={() => navigate("/pages")}>Cancel</Button>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-1">
              <Input 
                placeholder="Page Title" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                className="text-2xl font-bold border-none focus:ring-0 h-14 px-4"
                required
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 min-h-[500px] flex flex-col">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold">Page Content</div>
              <ReactQuill 
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={modules}
                style={{ height: '450px' }}
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
          </div>

          <div className="lg:col-span-1 flex flex-col gap-y-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 font-semibold text-sm">Status</div>
              <div className="p-4 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                  <Label>Published</Label>
                  <Switch 
                    checked={formData.is_active} 
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})} 
                  />
                </div>
                <div className="pt-4 border-t border-gray-100 italic text-[10px] text-gray-400">
                  When active, this page will be reachable via its URL handle.
                </div>
                <Button variant="primary" type="submit" isLoading={isSaving} className="w-full">
                  Create Page
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 font-semibold text-sm">URL Handle</div>
              <div className="p-4">
                <Input 
                  value={formData.handle} 
                  onChange={(e) => setFormData({...formData, handle: e.target.value})} 
                  placeholder="e.g. why-goamrit"
                />
                <p className="text-[10px] text-gray-400 mt-2">Will be: /pages/{formData.handle || "..."}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default NewPage
