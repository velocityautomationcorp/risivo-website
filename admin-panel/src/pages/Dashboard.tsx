import { usePages } from '../hooks/usePages'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { DocumentTextIcon, PhotoIcon, LanguageIcon } from '@heroicons/react/24/outline'

export function Dashboard() {
  const { pages, isLoading } = usePages()

  const stats = [
    {
      name: 'Total Pages',
      value: pages?.length || 0,
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Published',
      value: pages?.filter((p) => p.status === 'published').length || 0,
      icon: DocumentTextIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Drafts',
      value: pages?.filter((p) => p.status === 'draft').length || 0,
      icon: DocumentTextIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your CMS admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Recent Pages</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : pages && pages.length > 0 ? (
            <div className="space-y-3">
              {pages.slice(0, 5).map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{page.slug}</p>
                    <p className="text-sm text-gray-500">
                      Updated {new Date(page.updated_at).toLocaleDateString()}
                    </p>
                  </div>
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pages yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
