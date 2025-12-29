import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePages, usePage } from '../hooks/usePages'
import { useContentBlocks } from '../hooks/useContentBlocks'
import { ContentBlockEditor } from '../components/ContentBlockEditor'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { LANGUAGES } from '../types'
import type { BlockType } from '../types'
import toast from 'react-hot-toast'
import { PlusIcon } from '@heroicons/react/24/outline'

const BLOCK_TYPES: { value: BlockType; label: string }[] = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'text', label: 'Text Block' },
  { value: 'image', label: 'Single Image' },
  { value: 'image_gallery', label: 'Image Gallery' },
  { value: 'video', label: 'Video' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'features', label: 'Features Grid' },
  { value: 'pricing', label: 'Pricing Table' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'faq', label: 'FAQ Section' },
  { value: 'form', label: 'Form' },
  { value: 'code', label: 'Code Block' },
  { value: 'divider', label: 'Divider' },
]

export function PageEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const { data: pageData, isLoading } = usePage(id || '')
  const { createPage, updatePage } = usePages()
  const { createBlock, updateBlock, deleteBlock, reorderBlocks } = useContentBlocks()

  const [slug, setSlug] = useState('')
  const [template, setTemplate] = useState('default')
  const [metaTitle, setMetaTitle] = useState<Record<string, string>>({})
  const [metaDescription, setMetaDescription] = useState<Record<string, string>>({})
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [newBlockType, setNewBlockType] = useState<BlockType>('text')

  const blocks = pageData?.blocks || []

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
        const result = await createPage.mutateAsync(pagePayload)
        if (result.success && result.data) {
          toast.success('Page created!')
          navigate(`/admin/pages/${result.data.id}`)
        }
      } else if (id) {
        await updatePage.mutateAsync({ id, updates: pagePayload })
        toast.success('Page updated!')
      }
    } catch (error) {
      toast.error('Failed to save page')
    }
  }

  const handleAddBlock = async () => {
    if (!id || isNew) {
      toast.error('Please save the page first before adding blocks')
      return
    }

    const newBlock = {
      page_id: id,
      block_type: newBlockType,
      position: blocks.length,
      content: { title: 'New Block', description: 'Add your content here' },
      settings: {},
    }

    await createBlock.mutateAsync(newBlock)
    setShowAddBlock(false)
  }

  const handleUpdateBlock = async (blockId: string, updates: any) => {
    await updateBlock.mutateAsync({ id: blockId, updates })
  }

  const handleDeleteBlock = async (blockId: string) => {
    await deleteBlock.mutateAsync(blockId)
  }

  const handleMoveBlock = async (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = blocks.findIndex((b) => b.id === blockId)
    if (blockIndex === -1) return

    const newBlocks = [...blocks]
    const targetIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return

    // Swap positions
    ;[newBlocks[blockIndex], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[blockIndex],
    ]

    // Update positions
    const reorderedBlocks = newBlocks.map((block, index) => ({
      id: block.id,
      position: index,
    }))

    await reorderBlocks.mutateAsync(reorderedBlocks)
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
          Back to Pages
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

      {/* Content Blocks Section */}
      {!isNew && id && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Content Blocks</h2>
            <Button onClick={() => setShowAddBlock(!showAddBlock)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Block
            </Button>
          </div>

          {showAddBlock && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Block Type
                    </label>
                    <select
                      value={newBlockType}
                      onChange={(e) => setNewBlockType(e.target.value as BlockType)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {BLOCK_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleAddBlock}>Add Block</Button>
                  <Button variant="secondary" onClick={() => setShowAddBlock(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {blocks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                No content blocks yet. Click "Add Block" to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <ContentBlockEditor
                  key={block.id}
                  block={block}
                  onUpdate={handleUpdateBlock}
                  onDelete={handleDeleteBlock}
                  onMoveUp={() => handleMoveBlock(block.id, 'up')}
                  onMoveDown={() => handleMoveBlock(block.id, 'down')}
                  canMoveUp={index > 0}
                  canMoveDown={index < blocks.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
