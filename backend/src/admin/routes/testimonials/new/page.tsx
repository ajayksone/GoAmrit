import { useNavigate } from "react-router-dom"
import { Container, Heading, Input, Label, Textarea, Button, Switch, Select } from "@medusajs/ui"
import { useState } from "react"

const NewTestimonial = () => {
  const navigate = useNavigate()
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Testimonial added successfully")
        navigate("/testimonials")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to add testimonial")
      }
    } catch (e) {
      console.error("Error adding testimonial", e)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Container className="flex flex-col gap-y-12">
      <Heading level="h1">Add New Testimonial</Heading>
      
      <div className="flex flex-col gap-y-6 max-w-2xl">
        <div className="flex flex-col gap-y-2">
          <Label>User Name</Label>
          <Input 
            value={formData.user_name} 
            onChange={(e) => setFormData({...formData, user_name: e.target.value})} 
            placeholder="e.g. Rahul Sharma"
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
              placeholder="What did the customer say?"
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
                placeholder="e.g. vedic-ghee"
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
          <Button variant="primary" onClick={handleSave} isLoading={isSaving}>Add Testimonial</Button>
          <Button variant="secondary" onClick={() => navigate("/testimonials")}>Cancel</Button>
        </div>
      </div>
    </Container>
  )
}

export default NewTestimonial
