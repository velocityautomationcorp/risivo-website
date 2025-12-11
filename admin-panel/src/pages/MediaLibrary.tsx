import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { PhotoIcon } from '@heroicons/react/24/outline'

export function MediaLibrary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="mt-2 text-gray-600">Upload and manage your media files</p>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            title="Media Library Coming Soon"
            description="Upload images, videos, and documents directly to Supabase Storage"
            icon={<PhotoIcon className="h-12 w-12" />}
          />
        </CardContent>
      </Card>
    </div>
  )
}
