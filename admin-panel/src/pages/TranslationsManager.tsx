import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { LanguageIcon } from '@heroicons/react/24/outline'

export function TranslationsManager() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Translations</h1>
        <p className="mt-2 text-gray-600">Manage translations for 6 languages</p>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            title="Translations Manager Coming Soon"
            description="Edit navigation, CTA buttons, and content in 6 languages (EN, ES, FR, DE, IT, PT)"
            icon={<LanguageIcon className="h-12 w-12" />}
          />
        </CardContent>
      </Card>
    </div>
  )
}
