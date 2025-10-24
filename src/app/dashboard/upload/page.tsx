"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Image, 
  Video, 
  FileText, 
  Upload as UploadIcon,
  Link as LinkIcon,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function UploadPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-linear-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] rounded-2xl p-8">
          <div className="absolute inset-0 bg-linear-to-r from-[#6C63FF]/10 via-[#FF2E97]/10 to-[#6C63FF]/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Upload Video</h1>
            <p className="text-[#C5C5D2]">Choose the type of content you want to create and share</p>
          </div>
        </div>

        {/* Upload Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* TikTok Photo Draft Post */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-linear-to-r from-[#6C63FF] to-[#FF2E97] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-[#5A52E6] group-hover:to-[#E61E87] transition-colors">
                <Image className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">TikTok Photo Draft Post</CardTitle>
              <p className="text-[#C5C5D2]">
                Create photo draft posts that go to your TikTok inbox. Perfect for reviewing before publishing.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <Image className="h-4 w-4" />
                  <span className="text-sm">Upload images</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Write captions</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <UploadIcon className="h-4 w-4" />
                  <span className="text-sm">Save as draft</span>
                </div>
              </div>
              <Button 
                asChild
                className="w-full bg-linear-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-[#6C63FF]/30"
              >
                <Link href="/dashboard/upload/image-text">
                  Create Photo Draft
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Video Upload - File Upload */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-linear-to-r from-[#00F5FF] to-[#6C63FF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-[#00E5E5] group-hover:to-[#5A52E6] transition-colors">
                <Video className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">Upload Video File</CardTitle>
              <p className="text-[#C5C5D2]">
                Upload video files directly from your device. Perfect for sharing your own content and creations.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Select video file</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Add description</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <UploadIcon className="h-4 w-4" />
                  <span className="text-sm">Post to TikTok</span>
                </div>
              </div>
              <Button 
                asChild
                className="w-full bg-linear-to-r from-[#00F5FF] to-[#6C63FF] hover:from-[#00E5E5] hover:to-[#5A52E6] text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-[#00F5FF]/30"
              >
                <Link href="/dashboard/upload/video-file">
                  Upload Video File
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* TikTok Photo Direct Post */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#FF2E97]/30">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-linear-to-r from-[#FF2E97] to-[#6C63FF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-[#E61E87] group-hover:to-[#5A52E6] transition-colors">
                <Image className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">TikTok Photo Direct Post</CardTitle>
              <p className="text-[#C5C5D2]">
                Post photos directly to TikTok with privacy controls and advanced posting options.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <Image className="h-4 w-4" />
                  <span className="text-sm">Upload images</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Add title & description</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <UploadIcon className="h-4 w-4" />
                  <span className="text-sm">Post directly</span>
                </div>
              </div>
              <Button 
                asChild
                className="w-full bg-linear-to-r from-[#FF2E97] to-[#6C63FF] hover:from-[#E61E87] hover:to-[#5A52E6] text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-[#FF2E97]/30"
              >
                <Link href="/dashboard/upload/photo-direct">
                  Post Photo Directly
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Video Draft Posting */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-linear-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-[#FF5555] group-hover:to-[#3EC7C4] transition-colors">
                <Video className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">Video Draft Posting</CardTitle>
              <p className="text-[#C5C5D2]">
                Create draft posts that go to your TikTok inbox. Perfect for reviewing before publishing.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Upload video file or URL</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Add description</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <UploadIcon className="h-4 w-4" />
                  <span className="text-sm">Save as draft</span>
                </div>
              </div>
              <Button 
                asChild
                className="w-full bg-linear-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#FF5555] hover:to-[#3EC7C4] text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-[#FF6B6B]/30"
              >
                <Link href="/dashboard/upload/video-draft">
                  Create Draft Post
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        
      </div>
    </DashboardLayout>
  )
}
