"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Link as LinkIcon, 
  FileText, 
  Upload,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useTikTokPost } from "@/hooks"
import { toast } from "sonner"

export default function VideoUrlPostPage() {
  const [formData, setFormData] = useState({
    videoUrl: "",
    text: ""
  })
  const [postType, setPostType] = useState<'direct' | 'draft'>('draft')

  const {
    isLoading,
    error,
    uploadProgress,
    publishId,
    uploadStatus,
    lastResponse,
    uploadVideoFromUrl,
    uploadVideoDraftFromUrl,
    clearError,
    resetState
  } = useTikTokPost()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.videoUrl.trim() || !formData.text.trim()) {
      toast.error("Please enter a video URL and description")
      return
    }

    // Basic URL validation
    try {
      new URL(formData.videoUrl)
    } catch {
      toast.error("Please enter a valid URL")
      return
    }

    try {
      let response
      if (postType === 'direct') {
        response = await uploadVideoFromUrl(formData.videoUrl, formData.text)
      } else {
        response = await uploadVideoDraftFromUrl(formData.videoUrl, formData.text)
      }

      if (response.success) {
        toast.success(response.message)
        if (postType === 'draft') {
          toast.info("Check your TikTok app to complete the post!")
        }
        // Reset form
        setFormData({ videoUrl: "", text: "" })
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Failed to upload video. Please try again.")
    }
  }

  const handlePostTypeChange = (type: 'direct' | 'draft') => {
    setPostType(type)
    clearError()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-linear-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] rounded-2xl p-8">
          <div className="absolute inset-0 bg-linear-to-r from-[#00D4AA]/10 via-[#00F5FF]/10 to-[#00D4AA]/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard/upload" className="p-2 text-[#C5C5D2] hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Upload Video from URL</h1>
                <p className="text-[#C5C5D2]">Share videos directly from URLs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* URL Input Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <LinkIcon className="h-5 w-5" />
                <span>Video URL</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Post Type Selection */}
                <div className="mb-6">
                  <Label className="text-[#C5C5D2] font-medium mb-3 block">Post Type</Label>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={postType === 'draft' ? 'default' : 'outline'}
                      onClick={() => handlePostTypeChange('draft')}
                      className={postType === 'draft' ? 'bg-linear-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white' : 'bg-[#1A103D]/50 border-[#6C63FF]/30 text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white'}
                    >
                      Draft Post
                    </Button>
                    <Button
                      type="button"
                      variant={postType === 'direct' ? 'default' : 'outline'}
                      onClick={() => handlePostTypeChange('direct')}
                      className={postType === 'direct' ? 'bg-linear-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white' : 'bg-[#1A103D]/50 border-[#6C63FF]/30 text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white'}
                    >
                      Direct Post
                    </Button>
                  </div>
                  <p className="text-[#C5C5D2] text-sm mt-2">
                    {postType === 'draft' 
                      ? 'Draft posts go to your TikTok inbox for review' 
                      : 'Direct posts are published immediately (requires app review)'
                    }
                  </p>
                </div>

                {/* Video URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-white font-medium">
                    Video URL
                  </Label>
                  <Input
                    id="videoUrl"
                    name="videoUrl"
                    type="url"
                    placeholder="https://example.com/video.mp4"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="bg-[#1A103D]/50 border-[#6C63FF]/30 text-white placeholder-[#C5C5D2] focus:border-[#6C63FF] focus:ring-[#6C63FF]"
                    required
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    Enter a direct link to your video file (MP4, MOV, etc.)
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="text" className="text-white font-medium">
                    Video Description
                  </Label>
                  <Textarea
                    id="text"
                    name="text"
                    placeholder="Write your video description here..."
                    value={formData.text}
                    onChange={handleInputChange}
                    className="bg-[#1A103D]/50 border-[#6C63FF]/30 text-white placeholder-[#C5C5D2] focus:border-[#6C63FF] focus:ring-[#6C63FF] min-h-[120px]"
                    required
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    {formData.text.length}/280 characters
                  </p>
                </div>

                {/* Upload Progress */}
                {isLoading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">Uploading...</span>
                      <span className="text-[#C5C5D2] text-sm">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <Alert className="mt-4 border-red-500 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Display */}
                {lastResponse?.success && (
                  <Alert className="mt-4 border-green-500 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-300">
                      {lastResponse.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.videoUrl.trim() || !formData.text.trim()}
                    className="w-full bg-linear-to-r from-[#00D4AA] to-[#00F5FF] hover:from-[#00C49A] hover:to-[#00E5E5] text-white font-semibold py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00D4AA]/30"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {postType === 'draft' ? 'Save as Draft' : 'Post Now'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Video Preview Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Video Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.videoUrl ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-[#1A103D]/50 rounded-lg overflow-hidden relative">
                    <video
                      src={formData.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      onError={() => {
                        toast.error("Unable to load video preview. Please check the URL.")
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-medium">Video URL:</p>
                    <p className="text-[#C5C5D2] text-sm break-all bg-[#1A103D]/30 p-2 rounded">
                      {formData.videoUrl}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-[#1A103D]/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-[#C5C5D2] mx-auto mb-4" />
                    <p className="text-[#C5C5D2]">Enter a video URL to see preview</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
