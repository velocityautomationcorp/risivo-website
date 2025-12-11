import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Configure your CMS settings</p>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            title="Settings Coming Soon"
            description="Site settings, SEO defaults, user management, and more"
            icon={<Cog6ToothIcon className="h-12 w-12" />}
          />
        </CardContent>
      </Card>
    </div>
  )
}
