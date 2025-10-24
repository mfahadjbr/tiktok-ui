"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  Image, 
  FileText, 
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  Users,
  UserCheck,
  Lock,
  Link as LinkIcon
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useTikTokPost } from "@/hooks"
import { toast } from "sonner"

export default function PhotoDirectPostPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    privacyLevel: "PUBLIC_TO_EVERYONE",
    disableComment: false,
    autoAddMusic: false,
    brandContentToggle: false,
    brandOrganicToggle: false
  })

  const {
    isLoading,
    error,
    uploadProgress,
    publishId,
    uploadStatus,
    lastResponse,
    uploadPhotoDirect,
    clearError,
    resetState
  } = useTikTokPost()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      privacyLevel: value
    })
  }

  const handleCheckboxChange = (name: string) => {
    setFormData({
      ...formData,
      [name]: !formData[name as keyof typeof formData]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.imageUrl.trim() || !formData.title.trim() || !formData.description.trim()) {
      toast.error("Please enter an image URL, title, and description")
      return
    }

    // Basic URL validation
    try {
      new URL(formData.imageUrl)
    } catch {
      toast.error("Please enter a valid URL")
      return
    }

    try {
      const request = {
        photo_urls: [formData.imageUrl],
        cover_index: 0,
        title: formData.title,
        description: formData.description,
        privacy_level: formData.privacyLevel,
        disable_comment: formData.disableComment,
        auto_add_music: formData.autoAddMusic,
        brand_content_toggle: formData.brandContentToggle,
        brand_organic_toggle: formData.brandOrganicToggle
      }

      const response = await uploadPhotoDirect(request)

      if (response.success) {
        toast.success(response.message)
        toast.info("Your photo has been posted to TikTok!")
        // Reset form
        setFormData({ 
          title: "", 
          description: "", 
          imageUrl: "",
          privacyLevel: "PUBLIC_TO_EVERYONE",
          disableComment: false,
          autoAddMusic: false,
          brandContentToggle: false,
          brandOrganicToggle: false
        })
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Failed to upload photo. Please try again.")
    }
  }

  const privacyOptions = [
    { value: "PUBLIC_TO_EVERYONE", label: "Public to Everyone", icon: Globe },
    { value: "MUTUAL_FOLLOW_FRIENDS", label: "Mutual Follow Friends", icon: Users },
    { value: "FOLLOWER_OF_CREATOR", label: "Followers Only", icon: UserCheck },
    { value: "SELF_ONLY", label: "Private", icon: Lock }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-linear-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] rounded-2xl p-8">
          <div className="absolute inset-0 bg-linear-to-r from-[#FF2E97]/10 via-[#6C63FF]/10 to-[#FF2E97]/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard/upload" className="p-2 text-[#C5C5D2] hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">TikTok Photo Direct Post</h1>
                <p className="text-[#C5C5D2]">Post photos directly to TikTok with privacy controls and advanced options</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#FF2E97]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Photo Upload</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* URL Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-white font-medium">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="bg-[#1A103D]/50 border-[#FF2E97]/30 text-white placeholder-[#C5C5D2] focus:border-[#FF2E97] focus:ring-[#FF2E97]"
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    Enter a direct link to your image file (JPG, PNG, etc.)
                  </p>
                </div>

                {/* URL Image Preview */}
                {formData.imageUrl && (
                  <div className="mt-4">
                    <div className="aspect-square bg-[#1A103D]/50 rounded-lg overflow-hidden relative">
                      <img
                        src={formData.imageUrl}
                        alt="Image preview"
                        className="w-full h-full object-cover"
                        onError={() => {
                          toast.error("Unable to load image preview. Please check the URL.")
                        }}
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-white font-medium">Image URL:</p>
                      <p className="text-[#C5C5D2] text-sm break-all bg-[#1A103D]/30 p-2 rounded">
                        {formData.imageUrl}
                      </p>
                    </div>
                  </div>
                )}
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
            </CardContent>
          </Card>

          {/* Content & Settings Section */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#FF2E97]/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Post Content & Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white font-medium">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter post title..."
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-[#1A103D]/50 border-[#FF2E97]/30 text-white placeholder-[#C5C5D2] focus:border-[#FF2E97] focus:ring-[#FF2E97]"
                    required
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Write your post description here..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-[#1A103D]/50 border-[#FF2E97]/30 text-white placeholder-[#C5C5D2] focus:border-[#FF2E97] focus:ring-[#FF2E97] min-h-[120px]"
                    required
                  />
                  <p className="text-[#C5C5D2] text-sm">
                    {formData.description.length}/280 characters
                  </p>
                </div>

                {/* Privacy Level */}
                <div className="space-y-2">
                  <Label className="text-white font-medium">
                    Privacy Level
                  </Label>
                  <Select value={formData.privacyLevel} onValueChange={handleSelectChange}>
                    <SelectTrigger className="bg-[#1A103D]/50 border-[#FF2E97]/30 text-white focus:border-[#FF2E97] focus:ring-[#FF2E97]">
                      <SelectValue placeholder="Select privacy level" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A103D] border-[#FF2E97]/30">
                      {privacyOptions.map((option) => {
                        const IconComponent = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value} className="text-white hover:bg-[#FF2E97]/20">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-[#C5C5D2] text-sm">
                    Choose who can see your post
                  </p>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Advanced Options</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.disableComment}
                        onChange={() => handleCheckboxChange('disableComment')}
                        className="w-4 h-4 text-[#FF2E97] bg-[#1A103D]/50 border-[#FF2E97]/30 rounded focus:ring-[#FF2E97] focus:ring-2"
                      />
                      <span className="text-white text-sm">Disable Comments</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.autoAddMusic}
                        onChange={() => handleCheckboxChange('autoAddMusic')}
                        className="w-4 h-4 text-[#FF2E97] bg-[#1A103D]/50 border-[#FF2E97]/30 rounded focus:ring-[#FF2E97] focus:ring-2"
                      />
                      <span className="text-white text-sm">Auto Add Music</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.brandContentToggle}
                        onChange={() => handleCheckboxChange('brandContentToggle')}
                        className="w-4 h-4 text-[#FF2E97] bg-[#1A103D]/50 border-[#FF2E97]/30 rounded focus:ring-[#FF2E97] focus:ring-2"
                      />
                      <span className="text-white text-sm">Brand Content Toggle</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.brandOrganicToggle}
                        onChange={() => handleCheckboxChange('brandOrganicToggle')}
                        className="w-4 h-4 text-[#FF2E97] bg-[#1A103D]/50 border-[#FF2E97]/30 rounded focus:ring-[#FF2E97] focus:ring-2"
                      />
                      <span className="text-white text-sm">Brand Organic Toggle</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.imageUrl.trim() || !formData.title.trim() || !formData.description.trim()}
                    className="flex-1 bg-linear-to-r from-[#FF2E97] to-[#6C63FF] hover:from-[#E61E87] hover:to-[#5A52E6] text-white font-semibold py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FF2E97]/30"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post to TikTok
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
