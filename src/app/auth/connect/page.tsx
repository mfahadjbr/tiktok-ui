"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/Home-Content/Header"
import { Footer } from "@/components/Home-Content/Footer"
import { ExternalLink, Loader2, AlertCircle, CheckCircle, Users } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTikTokAuth } from "@/hooks"

export default function ConnectPage() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showTestUserSuccess, setShowTestUserSuccess] = useState(false)
  const router = useRouter()
  
  // Use the TikTok auth hook
  const { initiateTikTokConnect, initiateTikTokTestUser, isLoading, error } = useTikTokAuth()

  const handleConnectTikTok = async () => {
    try {
      await initiateTikTokConnect()
      // Show success popup and redirect to dashboard after OAuth completion
      setShowSuccessPopup(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err) {
      console.error('TikTok connection failed:', err)
      // Error is handled by the hook state
    }
  }

  const handleTestUser = async () => {
    try {
      await initiateTikTokTestUser()
      // Show success popup and redirect to dashboard
      setShowTestUserSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err) {
      console.error('TikTok test user failed:', err)
      // Error is handled by the hook state
    }
  }

  return (
    <div className="min-h-screen bg-[#0A012A]">
      <Header />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1A103D] rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">TikTok OAuth Complete!</h3>
            <p className="text-[#C5C5D2] mb-4">TikTok connection successful. Redirecting to dashboard...</p>
            <div className="w-full bg-[#2A1A4D] rounded-full h-2">
              <div className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Test User Success Popup */}
      {showTestUserSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1A103D] rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Test User Process Complete!</h3>
            <p className="text-[#C5C5D2] mb-4">Test user URL generated and opened. Redirecting to dashboard...</p>
            <div className="w-full bg-[#2A1A4D] rounded-full h-2">
              <div className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A] pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/10 via-[#FF2E97]/10 to-[#6C63FF]/10"></div>
      </section>

      {/* Connect Section */}
      <section className="py-12 relative overflow-hidden bg-gradient-to-br from-[#0A012A] via-[#1A103D] to-[#0A012A]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/8 via-[#FF2E97]/8 to-[#6C63FF]/8"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <Card className="bg-[#1A103D]/30 backdrop-blur-sm border-0 shadow-2xl shadow-[#6C63FF]/50 ring-0">
              <CardContent className="p-12 text-center">
                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-3 bg-[#FF2E97]/10 border border-[#FF2E97]/30 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-[#FF2E97]" />
                    <span className="text-[#FF2E97] text-sm">{error}</span>
                  </div>
                )}

                {/* TikTok Logo */}
                <div className="w-24 h-24 bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="h-12 w-12 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-8">
                  Connect Your TikTok Channel
                </h1>

                {/* Connect Button */}
                <Button
                  onClick={handleConnectTikTok}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] hover:from-[#5A52E6] hover:to-[#E61E87] text-white font-semibold py-4 rounded-2xl transition-all duration-300 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Connect with TikTok
                    </>
                  )}
                </Button>

                {/* Test User Button */}
                <Button
                  onClick={handleTestUser}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full bg-[#2A1A4D]/50 border border-[#3A2A5D] text-[#C5C5D2] hover:bg-[#1A103D] hover:text-white hover:border-[#6C63FF] font-semibold py-3 rounded-2xl transition-all duration-300 mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Add Test User
                    </>
                  )}
                </Button>

                {/* Loading Bar */}
                {isLoading && (
                  <div className="w-full bg-[#2A1A4D] rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-[#6C63FF] to-[#FF2E97] h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                  </div>
                )}

                {/* Info Text */}
                <p className="text-[#C5C5D2] text-sm">
                  {isLoading 
                    ? "Please wait while we process your request..." 
                    : showSuccessPopup
                    ? "TikTok OAuth completed successfully. Redirecting to dashboard..."
                    : showTestUserSuccess
                    ? "Test user process completed. Redirecting to dashboard..."
                    : "Connect your TikTok account or add a test user to start automating your posts"
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
