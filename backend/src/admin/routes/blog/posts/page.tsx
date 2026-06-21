import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Table, Heading, Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Eye } from "@medusajs/icons"

const BlogPostsPage = () => {
  const [data, setData] = useState<any>(null)
  const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || "http://localhost:3000"

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/admin/blog-posts")
        const json = await response.json()
        setData(json)
      } catch (e) {
        console.error("Failed to fetch posts", e)
      } finally {
        // isLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <Container className="flex flex-col gap-y-12">
      <div className="flex items-center justify-between">
        <Heading level="h1">All Blog Posts</Heading>
        <Link to="/blog/create">
          <Button variant="primary">Create New Post</Button>
        </Link>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Handle</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.blog_posts?.map((post: any) => (
            <Table.Row key={post.id}>
              <Table.Cell>{post.title}</Table.Cell>
              <Table.Cell>{post.handle}</Table.Cell>
              <Table.Cell>{post.is_published ? "Published" : "Draft"}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-x-2">
                  <Link to={`/blog/posts/${post.id}`}>
                    <Button variant="secondary" size="small">Edit</Button>
                  </Link>
                  <a 
                    href={`${storefrontUrl}/blog/${post.categories?.[0]?.handle || 'stories'}/${post.handle}`} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <Button variant="transparent" size="small" className="text-blue-500 hover:text-blue-700">
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                  </a>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
          {!data?.blog_posts?.length && (
            <Table.Row>
              <Table.Cell className="text-center p-4">No posts found.</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blog Posts",
})

export default BlogPostsPage
