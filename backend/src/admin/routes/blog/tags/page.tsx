import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Table, Heading, Button, Input, Label, Drawer } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Plus } from "@medusajs/icons"

const BlogTagsPage = () => {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [newTag, setNewTag] = useState({ name: "", handle: "" })

  const fetchTags = async () => {
    try {
      const response = await fetch("/admin/blog-tags")
      const json = await response.json()
      setData(json)
    } catch (e) {
      console.error("Failed to fetch tags", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const handleCreate = async () => {
    try {
      const response = await fetch("/admin/blog-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      })
      if (response.ok) {
        setIsDrawerOpen(false)
        setNewTag({ name: "", handle: "" })
        fetchTags()
      }
    } catch (e) {
      console.error("Failed to create tag", e)
    }
  }

  return (
    <Container className="flex flex-col gap-y-12">
      <div className="flex items-center justify-between">
        <Heading level="h1">Blog Tags</Heading>
        <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} /> Create Tag
        </Button>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Handle</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.blog_tags?.map((tag: any) => (
            <Table.Row key={tag.id}>
              <Table.Cell>{tag.name}</Table.Cell>
              <Table.Cell>{tag.handle}</Table.Cell>
              <Table.Cell>
                <Button variant="secondary" size="small">Delete</Button>
              </Table.Cell>
            </Table.Row>
          ))}
          {!data?.blog_tags?.length && (
            <Table.Row>
              <Table.Cell colSpan={3} className="text-center p-4">No tags found.</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Create New Tag</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Tag Name" 
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="handle">Handle</Label>
              <Input 
                id="handle" 
                placeholder="tag-handle" 
                value={newTag.handle}
                onChange={(e) => setNewTag({ ...newTag, handle: e.target.value })}
              />
            </div>
          </Drawer.Body>
          <Drawer.Footer>
             <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
             <Button variant="primary" onClick={handleCreate}>Create</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blog Tags",
})

export default BlogTagsPage
