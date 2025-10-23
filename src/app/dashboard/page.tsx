"use client"

import { DashboardLayout } from "@/components/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Repeat2, 
  TrendingUp,
  Eye,
  RefreshCw,
  AlertCircle,
  Loader2
} from "lucide-react"
import { useTikTokOverview } from "@/hooks"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  
  // Use TikTok overview hook
  const { 
    userProfile, 
    userVideos, 
    totalVideos,
    isLoading, 
    error, 
    lastUpdated,
    fetchOverviewData,
    clearError 
  } = useTikTokOverview()

  // Fetch data on component mount
  useEffect(() => {
    fetchOverviewData(false) // false = don't refresh, use cached data
  }, [fetchOverviewData])

  const handleRefresh = () => {
    fetchOverviewData(true) // true = refresh data from API
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'Photo'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] rounded-2xl p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/10 via-[#FF2E97]/10 to-[#6C63FF]/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                {userProfile ? (
                  <>
                    <img 
                      src={userProfile.avatar_url} 
                      alt={userProfile.display_name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-2xl font-bold text-white truncate">{userProfile.display_name}</h2>
                      <p className="text-[#C5C5D2] truncate">@{userProfile.username}</p>
                      <p className="text-[#C5C5D2] text-xs sm:text-sm mt-1 line-clamp-2">{userProfile.bio_description || 'No bio available'}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#2A1A4D] rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-5 sm:h-6 w-32 sm:w-48 bg-[#2A1A4D] rounded animate-pulse mb-2"></div>
                      <div className="h-3 sm:h-4 w-24 sm:w-32 bg-[#2A1A4D] rounded animate-pulse"></div>
                    </div>
                  </div>
                )}
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
              <div className="mb-4 p-3 bg-[#FF2E97]/10 border border-[#FF2E97]/30 rounded-lg flex items-center space-x-2">
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
            
            {/* Last Updated */}
            {lastUpdated && (
              <p className="text-[#C5C5D2] text-xs">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C5C5D2]">Followers</CardTitle>
              <Users className="h-4 w-4 text-[#6C63FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {userProfile ? userProfile.follower_count : '...'}
              </div>
              <p className="text-xs text-[#C5C5D2]">Total followers</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C5C5D2]">Following</CardTitle>
              <Users className="h-4 w-4 text-[#00F5FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {userProfile ? userProfile.following_count : '...'}
              </div>
              <p className="text-xs text-[#C5C5D2]">Accounts following</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C5C5D2]">Total Videos</CardTitle>
              <MessageSquare className="h-4 w-4 text-[#FF2E97]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {userProfile ? userProfile.video_count : '...'}
              </div>
              <p className="text-xs text-[#C5C5D2]">All time videos</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#C5C5D2]">Total Likes</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#6C63FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {userProfile ? userProfile.likes_count : '...'}
              </div>
              <p className="text-xs text-[#C5C5D2]">All time likes</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Videos */}
        <Card className="bg-[#1A103D]/50 backdrop-blur-sm border-0 shadow-xl shadow-[#6C63FF]/30">
          <CardHeader>
            <CardTitle className="text-white">Recent Videos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#2A1A4D]/50 rounded-xl overflow-hidden">
                    <div className="h-48 bg-[#2A1A4D] animate-pulse"></div>
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-[#2A1A4D] rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 w-24 bg-[#2A1A4D] rounded animate-pulse mb-1"></div>
                          <div className="h-3 w-20 bg-[#2A1A4D] rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-3 w-full bg-[#2A1A4D] rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-3/4 bg-[#2A1A4D] rounded animate-pulse mb-3"></div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex space-x-4">
                          <div className="h-3 w-8 bg-[#2A1A4D] rounded animate-pulse"></div>
                          <div className="h-3 w-8 bg-[#2A1A4D] rounded animate-pulse"></div>
                          <div className="h-3 w-8 bg-[#2A1A4D] rounded animate-pulse"></div>
                        </div>
                        <div className="h-3 w-16 bg-[#2A1A4D] rounded animate-pulse"></div>
                      </div>
                      <div className="h-8 w-full bg-[#2A1A4D] rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : userVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userVideos.map((video) => (
                  <div key={video.id} className="bg-[#2A1A4D]/50 rounded-xl border-0 shadow-lg shadow-[#6C63FF]/20 overflow-hidden">
                    {/* Video Cover Image */}
                    <div className="relative">
                      <img 
                        src={video.cover_image_url} 
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                          {formatDuration(video.duration)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Video Content */}
                    <div className="p-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 mb-3">
                        {userProfile && (
                          <>
                            <img 
                              src={userProfile.avatar_url} 
                              alt={userProfile.display_name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{userProfile.display_name}</p>
                              <p className="text-[#C5C5D2] text-sm truncate">@{userProfile.username}</p>
                            </div>
                          </>
                        )}
                  </div>
                  
                      {/* Video Description */}
                      <p className="text-[#C5C5D2] text-sm leading-relaxed mb-3 line-clamp-2">
                        {video.video_description}
                      </p>
                  
                      {/* Video Stats */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <div className="grid grid-cols-3 gap-2 text-[#C5C5D2]">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span className="text-xs">{video.like_count}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-xs">{video.comment_count}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span className="text-xs">{video.view_count}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-[#1A103D] text-[#C5C5D2] text-xs w-fit">
                          {formatDate(video.create_time)}
                        </Badge>
                      </div>
                      
                      {/* View Button */}
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white"
                        onClick={() => {
                          console.log('🎵 Clicking video with ID:', video.id)
                          router.push(`/dashboard/video/${video.id}`)
                        }}
                      >
                        View Details
                      </Button>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#C5C5D2]">No videos found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
