import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Table, Heading, Button, Input, Label, Drawer, Text, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Plus, PencilSquare, Trash } from "@medusajs/icons"
import SEOExtension from "../../../components/SEOExtension"

const BlogCategoriesPage = () => {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [newCat, setNewCat] = useState({ 
    id: "",
    name: "", 
    handle: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    seo_og_image: ""
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/admin/blog-categories")
      if (response.ok) {
        const json = await response.json()
        setData(json)
      }
    } catch (e) {
      console.error("Failed to fetch categories", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSave = async () => {
    if (!newCat.name) {
      setError("Name is required")
      return
    }
    
    setIsSaving(true)
    setError(null)
    
    try {
      const payload = {
        name: newCat.name,
        handle: newCat.handle || newCat.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
        seo_title: newCat.seo_title,
        seo_description: newCat.seo_description,
        seo_keywords: newCat.seo_keywords,
        seo_og_image: newCat.seo_og_image
      }

      const url = newCat.id ? `/admin/blog-categories/${newCat.id}` : "/admin/blog-categories"
      const method = "POST" // Medusa v2 custom routes often use POST for updates too

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      
      const resData = await response.json()
      
      if (response.ok) {
        setIsDrawerOpen(false)
        resetForm()
        fetchCategories()
        toast.success(`Category ${newCat.id ? 'updated' : 'created'}`)
      } else {
        setError(resData.message || "Failed to save category")
      }
    } catch (e: any) {
      console.error("Failed to save category", e)
      setError(e.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setNewCat({ id: "", name: "", handle: "", seo_title: "", seo_description: "", seo_keywords: "", seo_og_image: "" })
    setError(null)
  }

  const openEdit = (cat: any) => {
    setNewCat({
      id: cat.id,
      name: cat.name,
      handle: cat.handle,
      seo_title: cat.seo_title || "",
      seo_description: cat.seo_description || "",
      seo_keywords: cat.seo_keywords || "",
      seo_og_image: cat.seo_og_image || ""
    })
    setIsDrawerOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return
    try {
      const response = await fetch(`/admin/blog-categories/${id}`, {
        method: "DELETE"
      })
      if (response.ok) {
        fetchCategories()
        toast.success("Category deleted")
      }
    } catch (e) {
      console.error("Failed to delete", e)
    }
  }

  return (
    <Container className="flex flex-col gap-y-12">
      <div className="flex items-center justify-between">
        <Heading level="h1">Blog Categories</Heading>
        <Button variant="primary" onClick={() => {
          resetForm()
          setIsDrawerOpen(true)
        }}>
          <Plus size={16} /> Create Category
        </Button>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Handle</Table.HeaderCell>
            <Table.HeaderCell className="text-right">Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={3} className="text-center p-8 text-gray-400 italic">
                Loading categories...
              </Table.Cell>
            </Table.Row>
          ) : data?.blog_categories?.map((cat: any) => (
            <Table.Row key={cat.id}>
              <Table.Cell className="font-medium">{cat.name}</Table.Cell>
              <Table.Cell className="text-gray-500">{cat.handle}</Table.Cell>
              <Table.Cell className="text-right">
                <div className="flex justify-end gap-x-2">
                  <Button variant="transparent" size="small" onClick={() => openEdit(cat)}>
                     <PencilSquare size={16} />
                  </Button>
                  <Button 
                    variant="transparent" 
                    size="small" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content className="max-w-[800px]">
          <Drawer.Header>
            <Drawer.Title>{newCat.id ? 'Edit' : 'Create'} Category</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-y-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="flex flex-col gap-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Health & Wellness" 
                    value={newCat.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setNewCat({ 
                        ...newCat, 
                        name,
                        handle: newCat.id ? newCat.handle : (newCat.handle || name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""))
                      })
                    }}
                  />
               </div>
               <div className="flex flex-col gap-y-2">
                  <Label htmlFor="handle">Handle (URL Slug)</Label>
                  <Input 
                    id="handle" 
                    placeholder="category-handle" 
                    value={newCat.handle}
                    onChange={(e) => setNewCat({ ...newCat, handle: e.target.value })}
                  />
               </div>
            </div>

            <SEOExtension 
              data={{
                seo_title: newCat.seo_title,
                seo_description: newCat.seo_description,
                seo_keywords: newCat.seo_keywords,
                seo_og_image: newCat.seo_og_image
              }}
              onChange={(seo) => setNewCat({ ...newCat, ...seo })}
              title={newCat.name}
              content="" // Categories don't have main content yet
            />

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                {error}
              </div>
            )}
          </Drawer.Body>
          <Drawer.Footer>
             <div className="flex items-center justify-end gap-x-2">
                <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                  {newCat.id ? 'Save Changes' : 'Create Category'}
                </Button>
             </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blog Categories",
})

export default BlogCategoriesPage

