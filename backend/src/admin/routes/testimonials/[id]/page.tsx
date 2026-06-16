import { useParams, useNavigate } from "react-router-dom"
import { Container, Heading, Input, Label, Textarea, Button, Switch, Select } from "@medusajs/ui"
import { useState, useEffect } from "react"

const EditTestimonial = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    user_name: "",
    content: "",
    type: "text" as "text" | "video",
    video_url: "",
    thumbnail_url: "",
    product_handle: "",
    rating: 5,
    is_active: true,
  })

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetch(`/admin/testimonials/${id}`)
        const json = await response.json()
        if (json.testimonial) {
           setFormData({
             user_name: json.testimonial.user_name || "",
             content: json.testimonial.content || "",
             type: (json.testimonial.type as any) || "text",
             video_url: json.testimonial.video_url || "",
             thumbnail_url: json.testimonial.thumbnail_url || "",
             product_handle: json.testimonial.product_handle || "",
             rating: json.testimonial.rating || 5,
             is_active: json.testimonial.is_active ?? true,
           })
        }
      } catch (e) {
        console.error("Failed to fetch testimonial", e)
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchTestimonial()
  }, [id])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/admin/testimonials/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Testimonial updated successfully")
        navigate("/testimonials")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to update testimonial")
      }
    } catch (e) {
      console.error("Error updating testimonial", e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    
    try {
      const response = await fetch(`/admin/testimonials/${id}`, {
        method: "DELETE"
      })
      if (response.ok) {
        alert("Testimonial deleted")
        navigate("/testimonials")
      }
    } catch (e) {
      console.error("Delete error:", e)
    }
  }

  if (isLoading) return <div className="p-8">Loading testimonial data...</div>

  return (
    <Container className="flex flex-col gap-y-12">
      <div className="flex items-center justify-between">
        <Heading level="h1">Edit Testimonial: {formData.user_name}</Heading>
        <Button variant="danger" onClick={handleDelete}>Delete Testimonial</Button>
      </div>
      
      <div className="flex flex-col gap-y-6 max-w-2xl">
        <div className="flex flex-col gap-y-2">
          <Label>User Name</Label>
          <Input 
            value={formData.user_name} 
            onChange={(e) => setFormData({...formData, user_name: e.target.value})} 
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Feedback Type</Label>
          <Select 
             value={formData.type} 
             onValueChange={(val) => setFormData({...formData, type: val as any})}
          >
             <Select.Trigger>
                <Select.Value placeholder="Select type" />
             </Select.Trigger>
             <Select.Content>
                <Select.Item value="text">Text Feedback</Select.Item>
                <Select.Item value="video">Video Testimonial</Select.Item>
             </Select.Content>
          </Select>
        </div>

        {formData.type === 'text' ? (
          <div className="flex flex-col gap-y-2">
            <Label>Feedback Message</Label>
            <Textarea 
              rows={5}
              value={formData.content} 
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-y-2">
              <Label>Video URL (YouTube or MP4 link)</Label>
              <Input 
                value={formData.video_url} 
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Thumbnail URL (for Video Cover)</Label>
              <Input 
                value={formData.thumbnail_url} 
                onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Associated Product Handle (for Shopping Link)</Label>
              <Input 
                value={formData.product_handle} 
                onChange={(e) => setFormData({...formData, product_handle: e.target.value})}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-y-2">
          <Label>Rating (1-5)</Label>
          <Input 
             type="number"
             min={1} max={5}
             value={formData.rating} 
             onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
          />
        </div>

        <div className="flex items-center gap-x-4">
          <Label>Show on Website</Label>
          <Switch 
            checked={formData.is_active} 
            onCheckedChange={(checked) => setFormData({...formData, is_active: checked})} 
          />
        </div>

        <div className="flex gap-x-4 pt-12">
          <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Update Testimonial</Button>
          <Button variant="secondary" onClick={() => navigate("/testimonials")}>Cancel</Button>
        </div>
      </div>
    </Container>
  )
}

export default EditTestimonial
