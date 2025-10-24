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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image + Text Post */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-linear-to-r from-[#6C63FF] to-[#FF2E97] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-[#5A52E6] group-hover:to-[#E61E87] transition-colors">
                <Image className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">Image + Caption</CardTitle>
              <p className="text-[#C5C5D2]">
                Create engaging posts with images and captions. Perfect for sharing photos, infographics, and visual content.
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
                  <span className="text-sm">Post to TikTok</span>
                </div>
              </div>
              <Button 
                asChild
                className="w-full bg-linear-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-[#6C63FF]/30"
              >
                <Link href="/dashboard/upload/image-text">
                  Create Image Post
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Video + Text Post */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-linear-to-r from-[#00F5FF] to-[#6C63FF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-[#00E5E5] group-hover:to-[#5A52E6] transition-colors">
                <Video className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">Video + Caption</CardTitle>
              <p className="text-[#C5C5D2]">
                Share videos with engaging descriptions. Ideal for tutorials, announcements, and dynamic content.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">Upload videos</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Add descriptions</span>
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
                <Link href="/dashboard/upload/video-text">
                  Create Video Post
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* URL Video Upload */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-linear-to-r from-[#00D4AA] to-[#00F5FF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-[#00C49A] group-hover:to-[#00E5E5] transition-colors">
                <LinkIcon className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-2">Video from URL</CardTitle>
              <p className="text-[#C5C5D2]">
                Upload videos directly from URLs. Perfect for sharing content from external sources and cloud storage.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-[#C5C5D2]">
                  <LinkIcon className="h-4 w-4" />
                  <span className="text-sm">Paste video URL</span>
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
                className="w-full bg-linear-to-r from-[#00D4AA] to-[#00F5FF] hover:from-[#00C49A] hover:to-[#00E5E5] text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg shadow-[#00D4AA]/30"
              >
                <Link href="/dashboard/upload/video-url">
                  Upload from URL
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
