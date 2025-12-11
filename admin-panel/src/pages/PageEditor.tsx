import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePages, usePage } from '../hooks/usePages'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { LANGUAGES } from '../types'
import toast from 'react-hot-toast'

export function PageEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const { data: pageData, isLoading } = usePage(id || '')
  const { createPage, updatePage } = usePages()

  const [slug, setSlug] = useState('')
  const [template, setTemplate] = useState('default')
  const [metaTitle, setMetaTitle] = useState<Record<string, string>>({})
  const [metaDescription, setMetaDescription] = useState<Record<string, string>>({})

  useEffect(() => {
    if (pageData?.page) {
      setSlug(pageData.page.slug)
      setTemplate(pageData.page.template)
      setMetaTitle(pageData.page.meta_title || {})
      setMetaDescription(pageData.page.meta_description || {})
    }
  }, [pageData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const pagePayload = {
      slug,
      template,
      meta_title: metaTitle,
      meta_description: metaDescription,
      status: 'draft' as const,
    }

    try {
      if (isNew) {
        await createPage(pagePayload)
        toast.success('Page created!')
        navigate('/admin/pages')
      } else if (id) {
        await updatePage({ id, updates: pagePayload })
        toast.success('Page updated!')
      }
    } catch (error) {
      toast.error('Failed to save page')
    }
  }

  if (isLoading && !isNew) {
    return <div className="flex items-center justify-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNew ? 'New Page' : 'Edit Page'}
        </h1>
        <Button variant="secondary" onClick={() => navigate('/admin/pages')}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="homepage"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template
              </label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="default">Default</option>
                <option value="landing">Landing</option>
                <option value="blog">Blog</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">SEO & Meta Information</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {LANGUAGES.map((lang) => (
              <div key={lang.code} className="space-y-4 pb-6 border-b border-gray-200 last:border-0">
                <h3 className="font-medium text-gray-900">
                  {lang.flag} {lang.name}
                </h3>
                <Input
                  label="Meta Title"
                  value={metaTitle[lang.code] || ''}
                  onChange={(e) =>
                    setMetaTitle({ ...metaTitle, [lang.code]: e.target.value })
                  }
                  placeholder={`Page title in ${lang.name}`}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription[lang.code] || ''}
                    onChange={(e) =>
                      setMetaDescription({ ...metaDescription, [lang.code]: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`Description in ${lang.name}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/pages')}>
            Cancel
          </Button>
          <Button type="submit">
            {isNew ? 'Create Page' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
