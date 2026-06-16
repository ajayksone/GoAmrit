import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"
import SEOExtension from "../../../components/SEOExtension"

const BlogSettingsPage = () => {
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<any>({
    id: "",
    key: "blog_index",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    seo_og_image: ""
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/admin/cms-settings?key=blog_index")
        const data = await response.json()
        if (data.settings) {
          setSettings(data.settings)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/admin/cms-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })
      const data = await response.json()
      if (response.ok) {
        setSettings(data.settings)
        toast.success("Blog SEO settings saved")
      }
    } catch (e) {
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return <Container>Loading settings...</Container>

  return (
    <Container className="flex flex-col gap-y-12">
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1">Blog Global Settings</Heading>
          <p className="text-gray-500 text-sm mt-2">Manage on-page SEO for your main blog index page.</p>
        </div>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
          Save Settings
        </Button>
      </div>

      <div className="max-w-4xl flex flex-col gap-y-12">
        <SEOExtension 
          data={{
            seo_title: settings.seo_title || "",
            seo_description: settings.seo_description || "",
            seo_keywords: settings.seo_keywords || "",
            seo_og_image: settings.seo_og_image || ""
          }}
          onChange={(seo) => setSettings({ ...settings, ...seo })}
          title="GoAmrit Blog"
          content=""
        />

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
           <Heading level="h3" className="text-blue-800 text-base mb-2">How it works</Heading>
           <p className="text-blue-700 text-sm leading-relaxed">
             The settings above define the Meta Title and Description for your main blog landing page (e.g. <code>/blog</code>). 
             Search engines use this data to understand the overall theme of your stories and articles.
           </p>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blog Settings",
})

export default BlogSettingsPage
