import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Table, Heading, Button, StatusBadge } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const TestimonialsPage = () => {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/admin/testimonials")
        const json = await response.json()
        setData(json)
      } catch (e) {
        console.error("Failed to fetch testimonials", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  return (
    <Container className="flex flex-col gap-y-12">
      <div className="flex items-center justify-between">
        <Heading level="h1">Testimonials Management</Heading>
        <Link to="/testimonials/new">
          <Button variant="primary">Add New Testimonial</Button>
        </Link>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>User Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Rating</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.testimonials?.map((v: any) => (
            <Table.Row key={v.id}>
              <Table.Cell className="font-bold">{v.user_name}</Table.Cell>
              <Table.Cell>
                 <StatusBadge color={v.type === 'video' ? 'purple' : 'blue'}>
                    {v.type.toUpperCase()}
                 </StatusBadge>
              </Table.Cell>
              <Table.Cell>{v.rating} ⭐</Table.Cell>
              <Table.Cell>
                 <StatusBadge color={v.is_active ? 'green' : 'grey'}>
                    {v.is_active ? "Active" : "Inactive"}
                 </StatusBadge>
              </Table.Cell>
              <Table.Cell>
                <Link to={`/testimonials/${v.id}`}>
                  <Button variant="secondary" size="small">Edit</Button>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Reviews",
})

export default TestimonialsPage
