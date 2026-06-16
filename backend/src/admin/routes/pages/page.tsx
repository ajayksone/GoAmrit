import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Table, Heading, Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const PagesPage = () => {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchPages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/admin/pages")
      const json = await response.json()
      setData(json)
    } catch (e) {
      console.error("Failed to fetch pages", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/admin/pages/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchPages()
      } else {
        alert("Failed to delete page")
      }
    } catch (e) {
      console.error("Error deleting page:", e)
      alert("Error deleting page")
    }
  }

  return (
    <Container className="flex flex-col gap-y-12">
      <div className="flex items-center justify-between">
        <Heading level="h1">Website Pages Management</Heading>
        <Link to="/pages/new">
          <Button variant="primary">Create New Page</Button>
        </Link>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Handle</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.pages?.map((page: any) => (
            <Table.Row key={page.id}>
              <Table.Cell>{page.title}</Table.Cell>
              <Table.Cell>/{page.handle}</Table.Cell>
              <Table.Cell>{page.is_active ? "Active" : "Inactive"}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-x-2">
                  <Link to={`/pages/${page.id}`}>
                    <Button variant="secondary" size="small">Edit</Button>
                  </Link>
                  <a 
                    href={`http://localhost:3000/${page.handle}`} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <Button variant="secondary" size="small">View</Button>
                  </a>
                  <Button 
                    variant="danger" 
                    size="small" 
                    onClick={() => handleDelete(page.id, page.title)}
                  >
                    Delete
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "CMS Pages",
})

export default PagesPage
