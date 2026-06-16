import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Table, Badge, Input, Label, Select, Drawer, toast } from "@medusajs/ui"
import { Plus, Trash, EllipsisVertical, PencilSquare } from "@medusajs/icons"
import { useState, useEffect } from "react"

const MenuPage = () => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [pages, setPages] = useState<any[]>([])
  const [blogCategories, setBlogCategories] = useState<any[]>([])

  const [formData, setFormData] = useState({
    label: "",
    url: "",
    type: "custom",
    reference_id: "",
    order: 0,
    menu_key: "header"
  })

  const fetchData = async () => {
    try {
      const [menuRes, pageRes, blogCatRes] = await Promise.all([
        fetch("/admin/menu"),
        fetch("/admin/pages"),
        fetch("/admin/blog-categories")
      ])
      
      const menuData = await menuRes.json()
      const pageData = await pageRes.json()
      const blogCatData = await blogCatRes.json()
      
      setItems(menuData.menu_items || [])
      setPages(pageData.pages || [])
      setBlogCategories(blogCatData.blog_categories || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    const url = editingItem ? `/admin/menu/${editingItem.id}` : "/admin/menu"
    const method = "POST" 
    
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        toast.success(`Menu item ${editingItem ? 'updated' : 'created'}`)
        setIsDrawerOpen(false)
        setEditingItem(null)
        setFormData({ label: "", url: "", type: "custom", reference_id: "", order: 0, menu_key: "header" })
        fetchData()
      }
    } catch (e) {
      toast.error("Operation failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return
    try {
      const response = await fetch(`/admin/menu/${id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Deleted")
        fetchData()
      }
    } catch (e) { toast.error("Delete failed") }
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      label: item.label,
      url: item.url || "",
      type: item.type,
      reference_id: item.reference_id || "",
      order: item.order,
      menu_key: item.menu_key
    })
    setIsDrawerOpen(true)
  }

  return (
    <Container>
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <Heading level="h1">Mega Menu Administration</Heading>
          <Button variant="primary" onClick={() => { setEditingItem(null); setIsDrawerOpen(true); }}>
            <Plus /> Add Menu Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <section>
              <Heading level="h2" className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4">Header Navigation</Heading>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                 <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Order</Table.HeaderCell>
                        <Table.HeaderCell>Label</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {items.filter(i => i.menu_key === 'header').map((item) => (
                        <Table.Row key={item.id}>
                          <Table.Cell className="text-[10px] font-bold text-gray-400">{item.order}</Table.Cell>
                          <Table.Cell className="font-bold">{item.label}</Table.Cell>
                          <Table.Cell><Badge size="small">{item.type}</Badge></Table.Cell>
                          <Table.Cell className="text-right">
                             <div className="flex gap-x-2 justify-end">
                                <Button size="small" variant="transparent" onClick={() => openEdit(item)}><PencilSquare size={16}/></Button>
                                <Button size="small" variant="transparent" className="text-red-500" onClick={() => handleDelete(item.id)}><Trash size={16}/></Button>
                             </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                 </Table>
              </div>
           </section>

           <section>
              <Heading level="h2" className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4">Footer Navigation</Heading>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                 <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Order</Table.HeaderCell>
                        <Table.HeaderCell>Label</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {items.filter(i => i.menu_key === 'footer').map((item) => (
                        <Table.Row key={item.id}>
                          <Table.Cell className="text-[10px] font-bold text-gray-400">{item.order}</Table.Cell>
                          <Table.Cell className="font-bold">{item.label}</Table.Cell>
                          <Table.Cell><Badge size="small">{item.type}</Badge></Table.Cell>
                          <Table.Cell className="text-right">
                             <div className="flex gap-x-2 justify-end">
                                <Button size="small" variant="transparent" onClick={() => openEdit(item)}><PencilSquare size={16}/></Button>
                                <Button size="small" variant="transparent" className="text-red-500" onClick={() => handleDelete(item.id)}><Trash size={16}/></Button>
                             </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                 </Table>
              </div>
           </section>
        </div>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
           <Drawer.Content className="max-w-[400px]">
              <Drawer.Header>
                 <Drawer.Title>{editingItem ? 'Edit' : 'Add'} Menu Item</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body className="flex flex-col gap-y-6">
                 <div className="flex flex-col gap-y-2">
                    <Label>Label</Label>
                    <Input value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} placeholder="Shop All" />
                 </div>

                 <div className="flex flex-col gap-y-2">
                    <Label>Navigation Type</Label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value, reference_id: ""})}
                    >
                       <option value="custom">Custom URL</option>
                       <option value="page">CMS Page</option>
                       <option value="blog_category">Blog Category</option>
                    </select>
                 </div>

                 {formData.type === 'custom' && (
                    <div className="flex flex-col gap-y-2">
                       <Label>URL</Label>
                       <Input value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
                    </div>
                 )}

                 {formData.type === 'page' && (
                    <div className="flex flex-col gap-y-2">
                       <Label>Select Page</Label>
                       <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
                        value={formData.reference_id}
                        onChange={e => setFormData({...formData, reference_id: e.target.value})}
                       >
                          <option value="">Choose a page...</option>
                          {pages.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                       </select>
                    </div>
                 )}

                 {formData.type === 'blog_category' && (
                    <div className="flex flex-col gap-y-2">
                       <Label>Select Blog Category</Label>
                       <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
                        value={formData.reference_id}
                        onChange={e => setFormData({...formData, reference_id: e.target.value})}
                       >
                          <option value="">Choose a category...</option>
                          {blogCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                 )}

                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-y-2">
                       <Label>Menu Position</Label>
                       <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm"
                        value={formData.menu_key}
                        onChange={e => setFormData({...formData, menu_key: e.target.value})}
                       >
                          <option value="header">Header</option>
                          <option value="footer">Footer</option>
                       </select>
                    </div>
                    <div className="flex flex-col gap-y-2">
                       <Label>Display Order</Label>
                       <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
                    </div>
                 </div>
              </Drawer.Body>
              <Drawer.Footer>
                 <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                 <Button variant="primary" onClick={handleSave}>Save Item</Button>
              </Drawer.Footer>
           </Drawer.Content>
        </Drawer>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Navigation Menu",
})

export default MenuPage 
