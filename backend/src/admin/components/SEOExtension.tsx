import { Input, Label, Textarea, Container, Heading, Badge } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Photo } from "@medusajs/icons"

interface SEOExtensionProps {
  data: {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    seo_og_image: string;
  };
  onChange: (data: any) => void;
  title: string;
  content: string;
}

const SEOExtension = ({ data, onChange, title, content }: SEOExtensionProps) => {
  const [analysis, setAnalysis] = useState({
    titleLength: 0,
    descLength: 0,
    keywordDensity: 0,
    score: 'Poor',
    color: 'red' as 'red' | 'orange' | 'green'
  })

  useEffect(() => {
    const tLen = data.seo_title?.length || title?.length || 0
    const dLen = data.seo_description?.length || 0
    
    let score = 'Poor'
    let color: 'red' | 'orange' | 'green' = 'red'

    if (tLen > 30 && tLen < 60 && dLen > 100 && dLen < 160) {
      score = 'Good'
      color = 'green'
    } else if (tLen > 10 || dLen > 50) {
      score = 'OK'
      color = 'orange'
    }

    setAnalysis({
      titleLength: tLen,
      descLength: dLen,
      keywordDensity: 0,
      score,
      color
    })
  }, [data, title, content])

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Heading level="h2" className="text-base font-bold text-gray-800">On-Page SEO Extension</Heading>
          <Badge color={analysis.color}>{analysis.score}</Badge>
        </div>
        <div className="text-[10px] uppercase font-black tracking-widest text-gray-400">Yoast Analysis Engine</div>
      </div>

      <div className="p-6 flex flex-col gap-y-8">
        {/* Google Preview */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col gap-y-2">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Search Result Preview</div>
          <div className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">
            {data.seo_title || title || "Page Title Preview"}
          </div>
          <div className="text-[#006621] text-sm">
            https://goamrit.com/pages/{(title || "").toLowerCase().replace(/ /g, "-")}
          </div>
          <div className="text-[#545454] text-sm line-clamp-2">
            {data.seo_description || "Please provide a meta description to see how your page appears in search results..."}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-bold">SEO Title</Label>
                <span className={`text-[10px] font-bold ${analysis.titleLength > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                  {analysis.titleLength} / 60
                </span>
              </div>
              <Input 
                value={data.seo_title}
                onChange={(e) => onChange({ ...data, seo_title: e.target.value })}
                placeholder={title || "Focus keyword in title"}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-bold">Meta Description</Label>
                <span className={`text-[10px] font-bold ${analysis.descLength > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                  {analysis.descLength} / 160
                </span>
              </div>
              <Textarea 
                value={data.seo_description}
                onChange={(e) => onChange({ ...data, seo_description: e.target.value })}
                placeholder="Briefly summarize the page content..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label className="text-sm font-bold">Focus Keywords</Label>
              <Input 
                value={data.seo_keywords}
                onChange={(e) => onChange({ ...data, seo_keywords: e.target.value })}
                placeholder="ghee, organic, a2 cow ghee"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label className="text-sm font-bold">OG Image URL (Social Share)</Label>
              <div className="flex gap-x-2">
                <Input 
                  value={data.seo_og_image}
                  onChange={(e) => onChange({ ...data, seo_og_image: e.target.value })}
                  placeholder="https://..."
                />
                <div className="w-10 h-10 rounded border border-gray-200 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {data.seo_og_image ? <img src={data.seo_og_image} className="w-full h-full object-cover" /> : <Photo className="text-gray-300" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Analysis List */}
        <div className="border-t border-gray-100 pt-6">
          <Heading level="h3" className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">SEO Checklist</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
             <div className="flex items-center gap-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${analysis.titleLength > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-600">Title length: {analysis.titleLength > 60 ? 'Too long' : analysis.titleLength > 10 ? 'Good' : 'Too short'}</span>
             </div>
             <div className="flex items-center gap-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${analysis.descLength > 80 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-600">Description: {analysis.descLength > 160 ? 'Too long' : analysis.descLength > 80 ? 'Good' : 'Missing'}</span>
             </div>
             <div className="flex items-center gap-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${content?.length > 300 ? 'bg-green-500' : 'bg-orange-500'}`} />
                <span className="text-gray-600">Content length: {content?.length > 300 ? 'Great!' : 'Thin content'}</span>
             </div>
             <div className="flex items-center gap-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${data.seo_keywords ? 'bg-green-500' : 'bg-orange-500'}`} />
                <span className="text-gray-600">Focus keywords: {data.seo_keywords ? 'Defined' : 'Not set'}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SEOExtension 
