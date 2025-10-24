# TikTok Posting API Integration

This document outlines the comprehensive TikTok posting API integration implemented in the TikTok UI application.

## Overview

The application now includes full TikTok posting functionality with support for both direct posting and draft posting for videos and images. The integration handles file uploads, status checking, and provides a user-friendly interface for content creators.

## API Endpoints

### Video Upload Endpoints

#### 1. Direct Video Upload
- **Endpoint**: `POST /tiktok/post/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  - `file`: Video file (multipart)
  - `title`: Video title/description

#### 2. Draft Video Upload
- **Endpoint**: `POST /tiktok/draft-post/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  - `file`: Video file (multipart)
  - `title`: Video title/description

#### 3. Video Upload from URL (Direct)
- **Endpoint**: `POST /tiktok/post/upload-url`
- **Method**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  - `title`: Video title
  - `video_url`: Video URL

#### 4. Video Upload from URL (Draft)
- **Endpoint**: `POST /tiktok/draft-post/upload-url`
- **Method**: `POST`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  - `title`: Video title
  - `video_url`: Video URL

### Photo Upload Endpoints

#### 1. Direct Photo Upload
- **Endpoint**: `POST /tiktok/photo/direct/post`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "photo_urls": ["url1", "url2"],
  "cover_index": 0,
  "title": "Post title",
  "description": "Post description",
  "privacy_level": "PUBLIC_TO_EVERYONE",
  "disable_comment": false,
  "auto_add_music": false,
  "brand_content_toggle": false,
  "brand_organic_toggle": false
}
```

#### 2. Draft Photo Upload
- **Endpoint**: `POST /tiktok/photo/draft/upload`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "photo_urls": ["url1", "url2"],
  "cover_index": 0,
  "title": "Post title",
  "description": "Post description"
}
```

### Status Checking Endpoints

#### 1. Check Post Status
- **Endpoint**: `POST /tiktok/post-status/fetch`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "publish_id": "7560829660117126412"
}
```

## Implementation Details

### Hooks

#### `useTikTokPost`
A comprehensive hook that provides all TikTok posting functionality:

```typescript
const {
  isLoading,
  error,
  uploadProgress,
  publishId,
  uploadStatus,
  lastResponse,
  uploadVideoDirect,
  uploadVideoDraft,
  uploadVideoFromUrl,
  uploadVideoDraftFromUrl,
  uploadPhotoDirect,
  uploadPhotoDraft,
  checkPostStatus,
  clearError,
  resetState
} = useTikTokPost()
```

### Components

#### `TikTokUploadForm`
A reusable component for both video and image uploads:

```typescript
<TikTokUploadForm 
  type="video" // or "image"
  onSuccess={(response) => console.log('Upload successful', response)}
  onError={(error) => console.error('Upload failed', error)}
/>
```

#### `PostStatusChecker`
A component for checking post status:

```typescript
<PostStatusChecker 
  publishId="7560829660117126412"
  onStatusUpdate={(status) => console.log('Status updated', status)}
/>
```

### Pages

#### Video Upload Page (`/dashboard/upload/video-text`)
- File drag & drop support
- Video preview
- Post type selection (Direct/Draft)
- Progress tracking
- Error handling
- Success notifications

#### Image Upload Page (`/dashboard/upload/image-text`)
- Multiple image selection
- Cover image selection
- Image preview grid
- Post type selection (Direct/Draft)
- Progress tracking
- Error handling
- Success notifications

## Response Formats

### Successful Upload Response
```json
{
  "success": true,
  "message": "Video uploaded to TikTok inbox successfully! Check your TikTok app to complete the post.",
  "data": {
    "publish_id": "v_inbox_file~v2.7564788826103777291",
    "upload_url": "https://open-upload-va.tiktokapis.com/upload?upload_id=7564788826103793675&upload_token=ef432423-4798-a728-ad24-acafa73c2af6",
    "upload_status": "completed",
    "file_info": {
      "filename": "video.mp4",
      "file_size": 4812873,
      "content_type": "video/mp4",
      "chunk_size": 4812873,
      "total_chunks": 1,
      "upload_completed": true
    },
    "instructions": "A notification has been sent to your TikTok inbox. Click on it to edit and post your video."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Failed to initialize video post: Failed to initialize TikTok post: {\"error\":{\"code\":\"unaudited_client_can_only_post_to_private_accounts\",\"message\":\"Please review our integration guidelines at https://developers.tiktok.com/doc/content-sharing-guidelines/\",\"log_id\":\"20251024215627D0E044B1343B5527BC19\"}}",
  "data": {
    "error": "Failed to initialize TikTok post: {\"error\":{\"code\":\"unaudited_client_can_only_post_to_private_accounts\",\"message\":\"Please review our integration guidelines at https://developers.tiktok.com/doc/content-sharing-guidelines/\",\"log_id\":\"20251024215627D0E044B1343B5527BC19\"}}"
  }
}
```

## Error Handling

The application handles various error scenarios:

1. **Authentication Errors**: Missing or invalid tokens
2. **File Upload Errors**: Invalid file types, size limits
3. **API Errors**: TikTok API specific errors
4. **Network Errors**: Connection issues
5. **Validation Errors**: Missing required fields

## Features

### Upload Features
- ✅ Drag & drop file upload
- ✅ File type validation
- ✅ Progress tracking
- ✅ Multiple file support (images)
- ✅ Cover image selection
- ✅ Post type selection (Direct/Draft)
- ✅ Real-time preview
- ✅ Error handling
- ✅ Success notifications

### Status Features
- ✅ Post status checking
- ✅ Auto-refresh capability
- ✅ Status badges
- ✅ Error display
- ✅ Real-time updates

### UI Features
- ✅ Responsive design
- ✅ Dark theme
- ✅ Loading states
- ✅ Progress indicators
- ✅ Toast notifications
- ✅ Form validation

## Usage Examples

### Upload a Video Draft
```typescript
const { uploadVideoDraft } = useTikTokPost()

const handleUpload = async (file: File, title: string) => {
  try {
    const response = await uploadVideoDraft(file, title)
    if (response.success) {
      console.log('Draft created:', response.data.publish_id)
    }
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

### Check Post Status
```typescript
const { checkPostStatus } = useTikTokPost()

const handleCheckStatus = async (publishId: string) => {
  try {
    const response = await checkPostStatus(publishId)
    console.log('Status:', response.data.status)
  } catch (error) {
    console.error('Status check failed:', error)
  }
}
```

## Notes

1. **Draft Posts**: Draft posts are sent to the TikTok inbox and require manual completion in the TikTok app.
2. **Direct Posts**: Direct posts are published immediately but require app review for public posting.
3. **URL Uploads**: URL uploads require URL ownership verification from TikTok.
4. **File Limits**: Check TikTok's file size and format requirements.
5. **Rate Limits**: Be aware of TikTok's API rate limits.

## Future Enhancements

- [ ] Batch upload support
- [ ] Scheduled posting
- [ ] Analytics integration
- [ ] Content templates
- [ ] Auto-caption generation
- [ ] Hashtag suggestions
- [ ] Cross-platform posting
