"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Image, 
  FileText, 
  Upload,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
} from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { useTikTokPost } from "@/hooks"
import { toast } from "sonner"

export default function ImageTextPostPage() {
  const [formData, setFormData] = useState({
    text: ""
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [postType, setPostType] = useState<'direct' | 'draft'>('draft')
  const [coverIndex, setCoverIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    isLoading,
    error,
    uploadProgress,
    publishId,
    uploadStatus,
    lastResponse,
    uploadPhotoDirect,
    uploadPhotoDraft,
    clearError,
    resetState
  } = useTikTokPost()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      setSelectedFiles(prev => [...prev, ...imageFiles])
      
      const newPreviews = imageFiles.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
      clearError()
    }
  }

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
    if (coverIndex >= index && coverIndex > 0) {
      setCoverIndex(coverIndex - 1)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...imageFiles])
      
      const newPreviews = imageFiles.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
      clearError()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedFiles.length === 0 || !formData.text.trim()) {
      toast.error("Please select at least one image and enter a description")
      return
    }

    try {
      // Convert images to base64 data URLs
      const photoUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
        })
      )
      
      const request = {
        photo_urls: photoUrls,
        cover_index: coverIndex,
        title: formData.text,
        description: formData.text,
        ...(postType === 'direct' && {
          privacy_level: 'PUBLIC_TO_EVERYONE' as const,
          disable_comment: false,
          auto_add_music: false,
          brand_content_toggle: false,
          brand_organic_toggle: false
        })
      }

      let response
      if (postType === 'direct') {
        response = await uploadPhotoDirect(request)
      } else {
        response = await uploadPhotoDraft(request)
      }

      if (response.success) {
        toast.success(response.message)
        if (postType === 'draft') {
          toast.info("Check your TikTok app to complete the post!")
        }
        // Reset form
        setFormData({ text: "" })
        setSelectedFiles([])
        setImagePreviews([])
        setCoverIndex(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Failed to upload images. Please try again.")
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
          <div className="absolute inset-0 bg-linear-to-r from-[#6C63FF]/10 via-[#FF2E97]/10 to-[#6C63FF]/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard/upload" className="p-2 text-[#C5C5D2] hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Create Image + Text Post</h1>
                <p className="text-[#C5C5D2]">Upload images and write engaging captions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Upload Images</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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

              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-[#6C63FF]/30 rounded-xl p-8 text-center hover:border-[#6C63FF] transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-[#C5C5D2] mx-auto mb-4" />
                <p className="text-white mb-2">Drag and drop images here</p>
                <p className="text-[#C5C5D2] text-sm mb-4">or click to browse</p>
                <Button 
                  type="button"
                  variant="outline" 
                  className="bg-[#1A103D]/50 border-[#6C63FF]/30 text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
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
              
              {/* Image Preview */}
              {imagePreviews.length > 0 && (
                <div className="mt-6">
                  <Label className="text-white font-medium mb-3 block">
                    Selected Images ({imagePreviews.length})
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-[#1A103D]/50 rounded-lg overflow-hidden relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {coverIndex === index && (
                            <div className="absolute top-2 left-2 bg-linear-to-r from-[#6C63FF] to-[#FF2E97] text-white text-xs px-2 py-1 rounded">
                              Cover
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex justify-center">
                          <Button
                            type="button"
                            variant={coverIndex === index ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCoverIndex(index)}
                            className={coverIndex === index ? 'bg-linear-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white' : 'bg-[#1A103D]/50 border-[#6C63FF]/30 text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white'}
                          >
                            {coverIndex === index ? 'Cover Image' : 'Set as Cover'}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Text & Schedule Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Post Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Text Content */}
                <div className="space-y-2">
                  <Label htmlFor="text" className="text-white font-medium">
                    Post Text
                  </Label>
                  <Textarea
                    id="text"
                    name="text"
                    placeholder="Write your post caption here..."
                    value={formData.text}
                    onChange={handleInputChange}
                    className="bg-[#1A103D]/50 border-[#6C63FF]/30 text-white placeholder-[#C5C5D2] focus:border-[#6C63FF] focus:ring-[#6C63FF] min-h-[120px]"
                    required
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    {formData.text.length}/280 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || selectedFiles.length === 0 || !formData.text.trim()}
                    className="flex-1 bg-linear-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6C63FF]/30"
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
        </div>
      </div>
    </DashboardLayout>
  )
}
