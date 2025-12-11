import { useState } from 'react'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import type { CMSContentBlock, BlockType } from '../types'
import {
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'

interface ContentBlockEditorProps {
  block: CMSContentBlock
  onUpdate: (id: string, updates: Partial<CMSContentBlock>) => void
  onDelete: (id: string) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

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

export function ContentBlockEditor({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ContentBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(JSON.stringify(block.content, null, 2))

  const handleSave = () => {
    try {
      const parsedContent = JSON.parse(content)
      onUpdate(block.id, { content: parsedContent })
      setIsEditing(false)
    } catch (error) {
      alert('Invalid JSON format')
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="font-medium text-gray-900">
              {BLOCK_TYPES.find((t) => t.value === block.block_type)?.label || block.block_type}
            </span>
            <span className="text-sm text-gray-500">Position: {block.position}</span>
          </div>
          <div className="flex items-center space-x-2">
            {canMoveUp && (
              <button
                onClick={onMoveUp}
                className="p-1 text-gray-600 hover:text-gray-900"
                title="Move up"
              >
                <ChevronUpIcon className="h-5 w-5" />
              </button>
            )}
            {canMoveDown && (
              <button
                onClick={onMoveDown}
                className="p-1 text-gray-600 hover:text-gray-900"
                title="Move down"
              >
                <ChevronDownIcon className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this block?')) {
                  onDelete(block.id)
                }
              }}
              className="p-1 text-red-600 hover:text-red-800"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Block Type
              </label>
              <select
                value={block.block_type}
                onChange={(e) => onUpdate(block.id, { block_type: e.target.value as BlockType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {BLOCK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content (JSON)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                placeholder='{"title": "Block Title", "description": "Block description"}'
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded p-3">
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(block.content, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
