import { useState, useRef } from 'react'
import { useMedia } from '../hooks/useMedia'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Loading } from '../components/ui/Loading'
import {
  PhotoIcon,
  CloudArrowUpIcon,
  TrashIcon,
  DocumentIcon,
  VideoCameraIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export function MediaLibrary() {
  const [selectedFolder, setSelectedFolder] = useState<string>('general')
  const [uploadProgress, setUploadProgress] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { media, isLoading, uploadMedia, deleteMedia } = useMedia(selectedFolder)

  const folders = [
    { value: 'general', label: 'General' },
    { value: 'images', label: 'Images' },
    { value: 'videos', label: 'Videos' },
    { value: 'documents', label: 'Documents' },
  ]

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadProgress(true)

    try {
      for (const file of Array.from(files)) {
        await uploadMedia.mutateAsync({ file, folder: selectedFolder })
      }
      toast.success(`${files.length} file(s) uploaded successfully`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload files')
    } finally {
      setUploadProgress(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Delete "${filename}"?`)) return
    await deleteMedia.mutateAsync(id)
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard!')
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <PhotoIcon className="h-12 w-12 text-blue-500" />
      case 'video':
        return <VideoCameraIcon className="h-12 w-12 text-purple-500" />
      case 'document':
        return <DocumentIcon className="h-12 w-12 text-gray-500" />
      default:
        return <DocumentIcon className="h-12 w-12 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="mt-2 text-gray-600">Upload and manage your media files</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploadProgress}>
          <CloudArrowUpIcon className="h-5 w-5 mr-2" />
          {uploadProgress ? 'Uploading...' : 'Upload Files'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Folder Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {folders.map((folder) => (
            <button
              key={folder.value}
              onClick={() => setSelectedFolder(folder.value)}
              className={`${
                selectedFolder === folder.value
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {folder.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <Loading />
      ) : media.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              title="No media files yet"
              description={`Upload images, videos, and documents to the ${selectedFolder} folder`}
              icon={<PhotoIcon className="h-12 w-12" />}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                  {file.file_type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.original_filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getFileIcon(file.file_type)
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-900 truncate" title={file.original_filename}>
                    {file.original_filename}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(file.size_bytes)}</span>
                    {file.width && file.height && (
                      <span>{file.width} × {file.height}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      title="Copy URL"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4 inline mr-1" />
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(file.id, file.original_filename)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
