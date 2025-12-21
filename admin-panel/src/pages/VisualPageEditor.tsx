import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePages, usePage } from '../hooks/usePages'
import { useContentBlocks } from '../hooks/useContentBlocks'
import { BlockRenderer } from '../components/BlockRenderer'
import { ContentEditor } from '../components/ContentEditor'
import { StyleEditor } from '../components/StyleEditor'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import type { BlockType, CMSContentBlock } from '../types'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline'

const BLOCK_TYPES: { value: BlockType; label: string; description: string }[] = [
  { value: 'hero', label: 'Hero Section', description: 'Large banner with title, subtitle, and CTA' },
  { value: 'features', label: 'Features Grid', description: 'Showcase product features in a grid' },
  { value: 'cta', label: 'Call to Action', description: 'Prominent call-to-action section' },
  { value: 'pricing', label: 'Pricing Table', description: 'Display pricing plans' },
  { value: 'testimonials', label: 'Testimonials', description: 'Customer reviews and feedback' },
  { value: 'faq', label: 'FAQ', description: 'Frequently asked questions' },
  { value: 'text', label: 'Text Block', description: 'Rich text content' },
  { value: 'image', label: 'Image', description: 'Single image with caption' },
  { value: 'divider', label: 'Divider', description: 'Horizontal line separator' },
]

export function VisualPageEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: pageData, isLoading } = usePage(id || '')
  const { updatePage } = usePages()
  const { createBlock, updateBlock, deleteBlock, reorderBlocks } = useContentBlocks()

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showBlockLibrary, setShowBlockLibrary] = useState(false)
  const [editMode, setEditMode] = useState<'content' | 'style'>('content')
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const blocks = pageData?.blocks || []
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  useEffect(() => {
    if (blocks.length > 0 && !selectedBlockId) {
      setSelectedBlockId(blocks[0].id)
    }
  }, [blocks, selectedBlockId])

  const handleAddBlock = async (blockType: BlockType) => {
    if (!id) return

    const defaultContent: Record<BlockType, any> = {
      hero: {
        title: 'Welcome to Our Platform',
        subtitle: 'Build amazing products with our tools',
        buttonText: 'Get Started',
        buttonUrl: '/signup',
      },
      features: {
        title: 'Amazing Features',
        features: [
          { icon: '⚡', title: 'Fast', description: 'Lightning fast performance' },
          { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
          { icon: '📱', title: 'Mobile', description: 'Works on any device' },
        ],
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle: 'Join thousands of happy customers',
        buttonText: 'Start Free Trial',
        buttonUrl: '/signup',
      },
      pricing: {
        title: 'Simple, Transparent Pricing',
        plans: [
          {
            name: 'Starter',
            price: '$29',
            period: '/month',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            buttonText: 'Get Started',
          },
        ],
      },
      testimonials: {
        title: 'What Our Customers Say',
        testimonials: [
          {
            quote: 'This product is amazing!',
            name: 'John Doe',
            role: 'CEO at Company',
            avatar: '',
          },
        ],
      },
      faq: {
        title: 'Frequently Asked Questions',
        faqs: [
          {
            question: 'How does it work?',
            answer: 'It works great!',
          },
        ],
      },
      text: {
        title: 'About Us',
        text: '<p>Welcome to our platform. We help businesses grow.</p>',
      },
      image: {
        imageUrl: '',
        alt: 'Image',
        caption: '',
      },
      image_gallery: { images: [] },
      video: { videoUrl: '', title: '' },
      form: { fields: [] },
      code: { code: '' },
      divider: {},
    }

    const newBlock = {
      page_id: id,
      block_type: blockType,
      position: blocks.length,
      content: defaultContent[blockType] || {},
      settings: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        padding: '3rem 1rem',
        textAlign: 'center',
      },
    }

    const result = await createBlock.mutateAsync(newBlock)
    if (result.success && result.data) {
      setSelectedBlockId(result.data.id)
      setShowBlockLibrary(false)
      toast.success('Block added!')
    }
  }

  const handleUpdateBlockContent = async (content: any) => {
    if (!selectedBlockId) return
    await updateBlock.mutateAsync({ id: selectedBlockId, updates: { content } })
  }

  const handleUpdateBlockSettings = async (settings: any) => {
    if (!selectedBlockId) return
    await updateBlock.mutateAsync({ id: selectedBlockId, updates: { settings } })
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Delete this block?')) return
    await deleteBlock.mutateAsync(blockId)
    setSelectedBlockId(null)
  }

  const handleMoveBlock = async (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = blocks.findIndex((b) => b.id === blockId)
    if (blockIndex === -1) return

    const newBlocks = [...blocks]
    const targetIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return

    ;[newBlocks[blockIndex], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[blockIndex],
    ]

    const reorderedBlocks = newBlocks.map((block, index) => ({
      id: block.id,
      position: index,
    }))

    await reorderBlocks.mutateAsync(reorderedBlocks)
  }

  const getViewportWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return '375px'
      case 'tablet':
        return '768px'
      default:
        return '100%'
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Loading...</div>
  }

  if (!pageData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Page not found</p>
        <Button onClick={() => navigate('/admin/pages')} className="mt-4">
          Back to Pages
        </Button>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="secondary" onClick={() => navigate('/admin/pages')}>
              ← Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{pageData.page.slug}</h1>
              <p className="text-sm text-gray-500">Visual Editor</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Viewport Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded ${
                  viewMode === 'desktop' ? 'bg-white shadow' : 'text-gray-600'
                }`}
                title="Desktop"
              >
                <ComputerDesktopIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded ${
                  viewMode === 'tablet' ? 'bg-white shadow' : 'text-gray-600'
                }`}
                title="Tablet"
              >
                <DeviceTabletIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded ${
                  viewMode === 'mobile' ? 'bg-white shadow' : 'text-gray-600'
                }`}
                title="Mobile"
              >
                <DevicePhoneMobileIcon className="h-5 w-5" />
              </button>
            </div>

            <Button onClick={() => setShowBlockLibrary(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Block
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Block List & Editor */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Block List */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Blocks</h3>
            <div className="space-y-2">
              {blocks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No blocks yet. Click "Add Block" to start building your page.
                </p>
              ) : (
                blocks.map((block, index) => (
                  <button
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedBlockId === block.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {BLOCK_TYPES.find((t) => t.value === block.block_type)?.label || block.block_type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMoveBlock(block.id, 'up')
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Move up"
                        >
                          <ChevronUpIcon className="h-4 w-4" />
                        </button>
                      )}
                      {index < blocks.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMoveBlock(block.id, 'down')
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Move down"
                        >
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteBlock(block.id)
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Block Editor */}
          {selectedBlock && (
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setEditMode('content')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    editMode === 'content'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setEditMode('style')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    editMode === 'style'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Style
                </button>
              </div>

              {editMode === 'content' ? (
                <ContentEditor block={selectedBlock} onUpdate={handleUpdateBlockContent} />
              ) : (
                <StyleEditor block={selectedBlock} onUpdate={handleUpdateBlockSettings} />
              )}
            </div>
          )}
        </div>

        {/* Right Side - Live Preview */}
        <div className="flex-1 bg-gray-100 overflow-y-auto">
          <div className="p-6">
            <div
              className="mx-auto bg-white shadow-lg transition-all duration-300"
              style={{ width: getViewportWidth(), minHeight: '100vh' }}
            >
              {blocks.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <EyeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Your page preview will appear here</p>
                    <Button onClick={() => setShowBlockLibrary(true)}>
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Your First Block
                    </Button>
                  </div>
                </div>
              ) : (
                blocks.map((block) => (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`cursor-pointer transition-all ${
                      selectedBlockId === block.id
                        ? 'ring-4 ring-blue-500 ring-inset'
                        : 'hover:ring-2 hover:ring-gray-300 hover:ring-inset'
                    }`}
                  >
                    <BlockRenderer block={block} isPreview={true} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Block Library Modal */}
      {showBlockLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Block</h2>
                <button
                  onClick={() => setShowBlockLibrary(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BLOCK_TYPES.map((blockType) => (
                  <button
                    key={blockType.value}
                    onClick={() => handleAddBlock(blockType.value)}
                    className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{blockType.label}</h3>
                    <p className="text-sm text-gray-600">{blockType.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
