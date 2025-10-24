"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X,
  Video,
  Image,
  Send,
  Clock
} from "lucide-react"
import { useTikTokPost } from "@/hooks"
import { toast } from "sonner"

interface UploadFormProps {
  type: 'video' | 'image'
  onSuccess?: (response: {
    success: boolean;
    message: string;
    data?: {
      publish_id?: string;
      upload_url?: string;
      error?: {
        code: string;
        message: string;
        log_id: string;
      };
      upload_status?: string;
      file_info?: {
        filename: string;
        file_size: number;
        content_type: string;
        chunk_size: number;
        total_chunks: number;
        upload_completed: boolean;
      };
      instructions?: string;
    };
  }) => void
  onError?: (error: string) => void
}

export const TikTokUploadForm = ({ type, onSuccess, onError }: UploadFormProps) => {
  const [formData, setFormData] = useState({
    text: "",
    scheduledDate: "",
    scheduledTime: ""
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [postType, setPostType] = useState<'direct' | 'draft'>('draft')
  const [coverIndex, setCoverIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    isLoading,
    error,
    uploadProgress,
    lastResponse,
    uploadVideoDirect,
    uploadVideoDraft,
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
      const validFiles = files.filter(file => {
        if (type === 'video') return file.type.startsWith('video/')
        if (type === 'image') return file.type.startsWith('image/')
        return false
      })
      
      setSelectedFiles(prev => type === 'video' ? [validFiles[0]] : [...prev, ...validFiles])
      
      const newPreviews = validFiles.map(file => URL.createObjectURL(file))
      setFilePreviews(prev => type === 'video' ? newPreviews : [...prev, ...newPreviews])
      clearError()
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setFilePreviews(prev => {
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
    const validFiles = files.filter(file => {
      if (type === 'video') return file.type.startsWith('video/')
      if (type === 'image') return file.type.startsWith('image/')
      return false
    })
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => type === 'video' ? [validFiles[0]] : [...prev, ...validFiles])
      
      const newPreviews = validFiles.map(file => URL.createObjectURL(file))
      setFilePreviews(prev => type === 'video' ? newPreviews : [...prev, ...newPreviews])
      clearError()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedFiles.length === 0 || !formData.text.trim()) {
      const errorMsg = `Please select ${type === 'video' ? 'a video file' : 'at least one image'} and enter a description`
      toast.error(errorMsg)
      onError?.(errorMsg)
      return
    }

    try {
      let response

      if (type === 'video') {
        const file = selectedFiles[0]
        if (postType === 'direct') {
          response = await uploadVideoDirect(file, formData.text)
        } else {
          response = await uploadVideoDraft(file, formData.text)
        }
      } else {
        // For images, we need to upload to a server first to get URLs
        // This is a simplified version - in production, you'd upload to your server
        const photoUrls = filePreviews // In production, these would be uploaded URLs
        
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

        if (postType === 'direct') {
          response = await uploadPhotoDirect(request)
        } else {
          response = await uploadPhotoDraft(request)
        }
      }

      if (response.success) {
        toast.success(response.message)
        if (postType === 'draft') {
          toast.info("Check your TikTok app to complete the post!")
        }
        
        // Reset form
        setFormData({ text: "", scheduledDate: "", scheduledTime: "" })
        setSelectedFiles([])
        setFilePreviews([])
        setCoverIndex(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        
        onSuccess?.(response)
      } else {
        toast.error(response.message)
        onError?.(response.message)
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMsg = `Failed to upload ${type}. Please try again.`
      toast.error(errorMsg)
      onError?.(errorMsg)
    }
  }

  const handlePostTypeChange = (type: 'direct' | 'draft') => {
    setPostType(type)
    clearError()
  }

  const resetForm = () => {
    setFormData({ text: "", scheduledDate: "", scheduledTime: "" })
    setSelectedFiles([])
    setFilePreviews([])
    setCoverIndex(0)
    setPostType('draft')
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    resetState()
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            {type === 'video' ? <Video className="h-5 w-5" /> : <Image className="h-5 w-5" />}
            <span>Upload {type === 'video' ? 'Video' : 'Images'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Post Type Selection */}
          <div className="mb-6">
            <Label className="text-gray-300 font-medium mb-3 block">Post Type</Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={postType === 'draft' ? 'default' : 'outline'}
                onClick={() => handlePostTypeChange('draft')}
                className={postType === 'draft' ? `bg-${type === 'video' ? 'purple' : 'blue'}-500 hover:bg-${type === 'video' ? 'purple' : 'blue'}-600` : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}
              >
                Draft Post
              </Button>
              <Button
                type="button"
                variant={postType === 'direct' ? 'default' : 'outline'}
                onClick={() => handlePostTypeChange('direct')}
                className={postType === 'direct' ? `bg-${type === 'video' ? 'purple' : 'blue'}-500 hover:bg-${type === 'video' ? 'purple' : 'blue'}-600` : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}
              >
                Direct Post
              </Button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {postType === 'draft' 
                ? 'Draft posts go to your TikTok inbox for review' 
                : 'Direct posts are published immediately (requires app review)'
              }
            </p>
          </div>

          {/* File Upload */}
          <div 
            className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">Drag and drop {type === 'video' ? 'video' : 'images'} here</p>
            <p className="text-gray-400 text-sm mb-4">or click to browse</p>
            <Button 
              type="button"
              variant="outline" 
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              Choose {type === 'video' ? 'Video File' : 'Files'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={type === 'video' ? 'video/*' : 'image/*'}
              multiple={type === 'image'}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {isLoading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Uploading...</span>
                <span className="text-gray-400 text-sm">{uploadProgress}%</span>
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
          
          {/* File Preview */}
          {filePreviews.length > 0 && (
            <div className="mt-6">
              <Label className="text-gray-300 font-medium mb-3 block">
                Selected {type === 'video' ? 'Video' : `Images (${filePreviews.length})`}
              </Label>
              <div className={type === 'video' ? '' : 'grid grid-cols-2 gap-4'}>
                {filePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className={`${type === 'video' ? 'aspect-video' : 'aspect-square'} bg-gray-700 rounded-lg overflow-hidden relative`}>
                      {type === 'video' ? (
                        <video
                          src={preview}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {coverIndex === index && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Cover
                            </div>
                          )}
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {type === 'image' && (
                      <div className="mt-2 flex justify-center">
                        <Button
                          type="button"
                          variant={coverIndex === index ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCoverIndex(index)}
                          className={coverIndex === index ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}
                        >
                          {coverIndex === index ? 'Cover Image' : 'Set as Cover'}
                        </Button>
                      </div>
                    )}
                    {selectedFiles[index] && (
                      <p className="text-gray-400 text-sm mt-2">
                        File: {selectedFiles[index].name} ({(selectedFiles[index].size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Text & Schedule Section */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Post Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Content */}
            <div className="space-y-2">
              <Label htmlFor="text" className="text-gray-300 font-medium">
                {type === 'video' ? 'Video Description' : 'Post Text'}
              </Label>
              <Textarea
                id="text"
                name="text"
                placeholder={`Write your ${type === 'video' ? 'video description' : 'post caption'} here...`}
                value={formData.text}
                onChange={handleInputChange}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 min-h-[120px]"
                required
              />
              <p className="text-gray-400 text-sm">
                {formData.text.length}/280 characters
              </p>
            </div>

            {/* Scheduling */}
            <div className="space-y-4">
              <Label className="text-gray-300 font-medium flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Schedule Post</span>
              </Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate" className="text-gray-400 text-sm">
                    Date
                  </Label>
                  <Input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime" className="text-gray-400 text-sm">
                    Time
                  </Label>
                  <Input
                    id="scheduledTime"
                    name="scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading || selectedFiles.length === 0 || !formData.text.trim()}
                className={`flex-1 bg-${type === 'video' ? 'purple' : 'blue'}-500 hover:bg-${type === 'video' ? 'purple' : 'blue'}-600 text-white font-semibold py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
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
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white px-6 py-3 rounded-2xl disabled:opacity-50"
              >
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default TikTokUploadForm
