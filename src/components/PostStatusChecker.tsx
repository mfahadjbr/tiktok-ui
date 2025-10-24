"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Clock,
  CheckSquare,
  XCircle
} from "lucide-react"
import { useTikTokPost } from "@/hooks"
import { toast } from "sonner"

interface PostStatusCheckerProps {
  publishId?: string
  onStatusUpdate?: (status: string) => void
}

export const PostStatusChecker = ({ publishId, onStatusUpdate }: PostStatusCheckerProps) => {
  const [inputPublishId, setInputPublishId] = useState(publishId || '')
  const [statusData, setStatusData] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  const { checkPostStatus, isLoading, error } = useTikTokPost()

  const handleCheckStatus = async (publishIdToCheck?: string) => {
    const id = publishIdToCheck || inputPublishId
    if (!id.trim()) {
      toast.error("Please enter a publish ID")
      return
    }

    setIsChecking(true)
    try {
      const response = await checkPostStatus(id)
      setStatusData(response)
      onStatusUpdate?.(response.data?.status || 'unknown')
      
      if (response.success) {
        toast.success("Status checked successfully")
      } else {
        toast.error(response.message || "Failed to check status")
      }
    } catch (error) {
      console.error('Status check error:', error)
      toast.error("Failed to check post status")
    } finally {
      setIsChecking(false)
    }
  }

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
      setAutoRefresh(false)
    } else {
      setAutoRefresh(true)
      const interval = setInterval(() => {
        if (inputPublishId.trim()) {
          handleCheckStatus()
        }
      }, 10000) // Check every 10 seconds
      setRefreshInterval(interval)
    }
  }

  useEffect(() => {
    if (publishId) {
      setInputPublishId(publishId)
      handleCheckStatus(publishId)
    }
  }, [publishId])

  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [refreshInterval])

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
      case 'uploading':
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300"><Clock className="h-3 w-3 mr-1" />Processing</Badge>
      case 'completed':
      case 'success':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-300"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'failed':
      case 'error':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-300"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="secondary" className="bg-gray-500/20 text-gray-300"><AlertCircle className="h-3 w-3 mr-1" />Unknown</Badge>
    }
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <CheckSquare className="h-5 w-5" />
          <span>Post Status Checker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <Label htmlFor="publishId" className="text-gray-300 font-medium">
            Publish ID
          </Label>
          <div className="flex space-x-2">
            <Input
              id="publishId"
              value={inputPublishId}
              onChange={(e) => setInputPublishId(e.target.value)}
              placeholder="Enter publish ID (e.g., 7560829660117126412)"
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button
              onClick={() => handleCheckStatus()}
              disabled={isChecking || isLoading || !inputPublishId.trim()}
              className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
            >
              {isChecking || isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Auto Refresh Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={toggleAutoRefresh}
            className={autoRefresh ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}
          >
            {autoRefresh ? 'Stop Auto Refresh' : 'Auto Refresh (10s)'}
          </Button>
          {autoRefresh && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              Auto-refreshing
            </Badge>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Status Display */}
        {statusData && (
          <div className="space-y-4">
            <Alert className="border-blue-500 bg-blue-500/10">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-300">
                Status checked successfully
              </AlertDescription>
            </Alert>

            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Success:</span>
                <span className={statusData.success ? 'text-green-400' : 'text-red-400'}>
                  {statusData.success ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Message:</span>
                <span className="text-gray-400 text-sm">{statusData.message}</span>
              </div>

              {statusData.data && (
                <>
                  {statusData.data.status && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium">Status:</span>
                      {getStatusBadge(statusData.data.status)}
                    </div>
                  )}
                  
                  {statusData.data.publish_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium">Publish ID:</span>
                      <span className="text-gray-400 text-sm font-mono">{statusData.data.publish_id}</span>
                    </div>
                  )}

                  {statusData.data.error && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium">Error:</span>
                      <span className="text-red-400 text-sm">{statusData.data.error}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h4 className="text-gray-300 font-medium mb-2">How to use:</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Enter the publish ID from your upload response</li>
            <li>• Click the refresh button to check current status</li>
            <li>• Enable auto-refresh to monitor status changes</li>
            <li>• Status updates every 10 seconds when auto-refresh is enabled</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostStatusChecker
