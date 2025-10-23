"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Loader2,
  Play
} from "lucide-react"
import { useVideoDetail, useTikTokOverview } from "@/hooks"
import { useEffect, use } from "react"
import { useRouter } from "next/navigation"

interface VideoDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function VideoDetailPage({ params }: VideoDetailPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const videoId = resolvedParams.id
  
  const { 
    video, 
    isLoading, 
    error, 
    lastUpdated,
    fetchVideoDetail,
    clearError 
  } = useVideoDetail()
  
  const { userProfile } = useTikTokOverview()

  // Fetch video details on component mount
  useEffect(() => {
    console.log('🎵 Video ID from params:', videoId)
    if (videoId) {
      fetchVideoDetail(videoId, false)
    }
  }, [videoId, fetchVideoDetail])

  const handleRefresh = () => {
    if (videoId) {
      fetchVideoDetail(videoId, true)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'Photo'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (!videoId) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-[#FF2E97] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Video ID Required</h2>
            <p className="text-[#C5C5D2] mb-4">No video ID provided in the URL</p>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="bg-[#2A1A4D]/50 border-[#3A2A5D] text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Video Details</h1>
          </div>
          
          <Button 
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="bg-[#2A1A4D]/50 border-[#3A2A5D] text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-[#FF2E97]/10 border border-[#FF2E97]/30 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-[#FF2E97]" />
            <span className="text-[#FF2E97] text-sm">{error}</span>
            <Button 
              onClick={clearError}
              variant="ghost"
              size="sm"
              className="text-[#FF2E97] hover:text-[#FF2E97] ml-auto"
            >
              ×
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !video && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-[#2A1A4D]/50 rounded-xl overflow-hidden">
                <div className="h-96 bg-[#2A1A4D] animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-[#2A1A4D] rounded animate-pulse mb-4"></div>
                  <div className="h-4 w-full bg-[#2A1A4D] rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-2/3 bg-[#2A1A4D] rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#2A1A4D]/50 rounded-xl p-4">
                  <div className="h-4 w-24 bg-[#2A1A4D] rounded animate-pulse mb-2"></div>
                  <div className="h-6 w-16 bg-[#2A1A4D] rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Content */}
        {video && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Section */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
                <CardContent className="p-0">
                  {/* Video Cover */}
                  <div className="relative">
                    <img 
                      src={video.cover_image_url} 
                      alt={video.title}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
                        onClick={() => window.open(video.share_url, '_blank')}
                      >
                        <Play className="h-6 w-6 mr-2" />
                        Watch on TikTok
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                        {formatDuration(video.duration)}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        {userProfile && (
                          <>
                            <img 
                              src={userProfile.avatar_url} 
                              alt={userProfile.display_name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="min-w-0 flex-1">
                              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{userProfile.display_name}</h2>
                              <p className="text-[#C5C5D2] truncate">@{userProfile.username}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="bg-[#2A1A4D]/50 border-[#3A2A5D] text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white w-full sm:w-auto"
                        onClick={() => window.open(video.share_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open TikTok
                      </Button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-3">{video.title}</h3>
                    <p className="text-[#C5C5D2] leading-relaxed mb-4">{video.video_description}</p>
                    
                    {/* Engagement Stats */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center sm:space-x-6 gap-4 text-[#C5C5D2]">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-5 w-5" />
                        <span className="font-medium">{formatNumber(video.like_count)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">{formatNumber(video.comment_count)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Share2 className="h-5 w-5" />
                        <span className="font-medium">{formatNumber(video.share_count)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span className="font-medium">{formatNumber(video.view_count)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              {/* Video Stats */}
              <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
                <CardHeader>
                  <CardTitle className="text-white">Video Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#6C63FF]" />
                      <span className="text-[#C5C5D2]">Created</span>
                    </div>
                    <span className="text-white font-medium">{formatDate(video.create_time)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-[#FF2E97]" />
                      <span className="text-[#C5C5D2]">Duration</span>
                    </div>
                    <span className="text-white font-medium">{formatDuration(video.duration)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-[#00F5FF]" />
                      <span className="text-[#C5C5D2]">Dimensions</span>
                    </div>
                    <span className="text-white font-medium">{video.width} × {video.height}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-[#FF2E97]" />
                      <span className="text-[#C5C5D2]">Video ID</span>
                    </div>
                    <span className="text-white font-medium text-xs">{video.id}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
                <CardHeader>
                  <CardTitle className="text-white">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white"
                    onClick={() => window.open(video.share_url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on TikTok
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full bg-[#2A1A4D]/50 border-[#3A2A5D] text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white"
                    onClick={() => {
                      navigator.clipboard.writeText(video.share_url)
                      // You could add a toast notification here
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </CardContent>
              </Card>

              {/* Last Updated */}
              {lastUpdated && (
                <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
                  <CardContent className="pt-6">
                    <p className="text-[#C5C5D2] text-xs">
                      Last updated: {new Date(lastUpdated).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
