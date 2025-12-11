import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePages } from '../hooks/usePages'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export function PagesManager() {
  const navigate = useNavigate()
  const { pages, isLoading, deletePage, publishPage } = usePages()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    setDeletingId(id)
    try {
      await deletePage(id)
    } finally {
      setDeletingId(null)
    }
  }

  const handlePublish = async (id: string) => {
    await publishPage(id)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="mt-2 text-gray-600">Manage your website pages</p>
        </div>
        <Button onClick={() => navigate('/admin/pages/new')}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Page
        </Button>
      </div>

      {!pages || pages.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              title="No pages"
              description="Get started by creating your first page"
              action={{
                label: 'Create Page',
                onClick: () => navigate('/admin/pages/new'),
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {page.slug}
                        </div>
                        <div className="text-sm text-gray-500">
                          {page.template}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          page.status === 'published'
                            ? 'success'
                            : page.status === 'draft'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {page.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {page.status !== 'published' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handlePublish(page.id)}
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/pages/${page.id}`)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(page.id)}
                          isLoading={deletingId === page.id}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
