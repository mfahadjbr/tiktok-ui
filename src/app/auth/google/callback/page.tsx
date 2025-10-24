"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGoogleAuth } from "@/hooks"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()
  const { handleGoogleCallback } = useGoogleAuth()

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')
        const state = urlParams.get('state')

        if (error) {
          setStatus('error')
          setErrorMessage(`Google OAuth error: ${error}`)
          return
        }

        if (!code) {
          setStatus('error')
          setErrorMessage('No authorization code received from Google')
          return
        }

        // Handle the Google callback
        await handleGoogleCallback(code, state || undefined)
        
        setStatus('success')
        
        // Redirect to connect page after a brief success display
        setTimeout(() => {
          router.push('/auth/connect')
        }, 2000)

      } catch (err) {
        console.error('Google callback error:', err)
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Failed to authenticate with Google')
      }
    }

    processCallback()
  }, [handleGoogleCallback, router])

  return (
    <div className="min-h-screen bg-[#0A012A] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1A103D]/30 backdrop-blur-sm border-0 shadow-2xl shadow-[#6C63FF]/50">
        <CardContent className="p-8 text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="h-12 w-12 text-[#6C63FF] animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Completing Google Authentication
              </h2>
              <p className="text-[#C5C5D2]">
                Please wait while we verify your Google account...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Authentication Successful!
              </h2>
              <p className="text-[#C5C5D2] mb-4">
                Your Google account has been successfully connected.
              </p>
              <p className="text-sm text-[#C5C5D2]">
                Redirecting to TikTok connection...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-[#C5C5D2] mb-4">
                {errorMessage}
              </p>
              <button
                onClick={() => router.push('/auth/login')}
                className="text-[#6C63FF] hover:text-[#5A52E6] underline"
              >
                Return to Login
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
