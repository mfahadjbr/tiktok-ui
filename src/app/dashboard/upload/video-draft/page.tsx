"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video, 
  FileText, 
  Upload,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
  Clock
} from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { useTikTokPost } from "@/hooks"
import { toast } from "sonner"

export default function VideoDraftPostingPage() {
  const [formData, setFormData] = useState({
    text: "",
    videoUrl: ""
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    isLoading,
    error,
    uploadProgress,
    publishId,
    uploadStatus,
    lastResponse,
    uploadVideoDraft,
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
      clearError()
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
      clearError()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (activeTab === 'file') {
      if (!selectedFile || !formData.text.trim()) {
        toast.error("Please select a video file and enter a description")
        return
      }

      try {
        const response = await uploadVideoDraft(selectedFile, formData.text)

        if (response.success) {
          toast.success(response.message)
          toast.info("Check your TikTok app to complete the post!")
          // Reset form
          setFormData({ text: "", videoUrl: "" })
          setSelectedFile(null)
          setVideoPreview(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        } else {
          toast.error(response.message)
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error("Failed to upload video draft. Please try again.")
      }
    } else {
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
        const response = await uploadVideoDraftFromUrl(formData.videoUrl, formData.text)

        if (response.success) {
          toast.success(response.message)
          toast.info("Check your TikTok app to complete the post!")
          // Reset form
          setFormData({ text: "", videoUrl: "" })
        } else {
          toast.error(response.message)
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error("Failed to upload video draft. Please try again.")
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-linear-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] rounded-2xl p-8">
          <div className="absolute inset-0 bg-linear-to-r from-[#FF6B6B]/10 via-[#4ECDC4]/10 to-[#FF6B6B]/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard/upload" className="p-2 text-[#C5C5D2] hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Video Draft Posting</h1>
                <p className="text-[#C5C5D2]">Create draft posts that go to your TikTok inbox</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Create Draft Post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'file' | 'url')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#1A103D]/30">
                  <TabsTrigger value="file" className="data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    File Upload
                  </TabsTrigger>
                  <TabsTrigger value="url" className="data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-white">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Video URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="mt-6">
                  {/* File Upload */}
                  <div 
                    className="border-2 border-dashed border-[#FF6B6B]/30 rounded-xl p-8 text-center hover:border-[#FF6B6B] transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-[#C5C5D2] mx-auto mb-4" />
                    <p className="text-white mb-2">Drag and drop video here</p>
                    <p className="text-[#C5C5D2] text-sm mb-4">or click to browse</p>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="bg-[#1A103D]/50 border-[#FF6B6B]/30 text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      Choose Video File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Video Preview */}
                  {videoPreview && (
                    <div className="mt-6">
                      <div className="aspect-video bg-[#1A103D]/50 rounded-lg overflow-hidden relative">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {selectedFile && (
                        <p className="text-[#C5C5D2] text-sm mt-2">
                          File: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="url" className="mt-6">
                  {/* URL Input */}
                  <div className="space-y-4">
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
                        className="bg-[#1A103D]/50 border-[#FF6B6B]/30 text-white placeholder-[#C5C5D2] focus:border-[#FF6B6B] focus:ring-[#FF6B6B]"
                      />
                      <p className="text-[#C5C5D2] text-sm">
                        Enter a direct link to your video file (MP4, MOV, etc.)
                      </p>
                    </div>

                    {/* URL Video Preview */}
                    {formData.videoUrl && (
                      <div className="mt-4">
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
                        <div className="mt-2">
                          <p className="text-white font-medium">Video URL:</p>
                          <p className="text-[#C5C5D2] text-sm break-all bg-[#1A103D]/30 p-2 rounded">
                            {formData.videoUrl}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

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
            </CardContent>
          </Card>

          {/* Text Content Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Draft Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Text Content */}
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
                    className="bg-[#1A103D]/50 border-[#FF6B6B]/30 text-white placeholder-[#C5C5D2] focus:border-[#FF6B6B] focus:ring-[#FF6B6B] min-h-[120px]"
                    required
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    {formData.text.length}/280 characters
                  </p>
                </div>

                {/* Draft Info */}
                <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-[#FF6B6B] mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Draft Post</h4>
                      <p className="text-[#C5C5D2] text-sm">
                        This will be saved as a draft in your TikTok inbox. You can review and edit it before publishing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || (activeTab === 'file' ? !selectedFile : !formData.videoUrl.trim()) || !formData.text.trim()}
                    className="flex-1 bg-linear-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#FF5555] hover:to-[#3EC7C4] text-white font-semibold py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FF6B6B]/30"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Draft...
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Save as Draft
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
