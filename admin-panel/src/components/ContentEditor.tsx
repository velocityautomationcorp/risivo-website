import { Card, CardHeader, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import type { CMSContentBlock } from '../types'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ContentEditorProps {
  block: CMSContentBlock
  onUpdate: (content: any) => void
}

export function ContentEditor({ block, onUpdate }: ContentEditorProps) {
  const content = block.content || {}

  const updateField = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value })
  }

  const updateArrayItem = (arrayName: string, index: number, updates: any) => {
    const array = content[arrayName] || []
    const newArray = [...array]
    newArray[index] = { ...newArray[index], ...updates }
    onUpdate({ ...content, [arrayName]: newArray })
  }

  const addArrayItem = (arrayName: string, defaultItem: any) => {
    const array = content[arrayName] || []
    onUpdate({ ...content, [arrayName]: [...array, defaultItem] })
  }

  const removeArrayItem = (arrayName: string, index: number) => {
    const array = content[arrayName] || []
    onUpdate({ ...content, [arrayName]: array.filter((_: any, i: number) => i !== index) })
  }

  // Render based on block type
  switch (block.block_type) {
    case 'hero':
    case 'cta':
      return (
        <div className="space-y-4">
          <Input
            label="Title"
            value={content.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Enter your title"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <textarea
              value={content.subtitle || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your subtitle"
            />
          </div>
          <Input
            label="Button Text"
            value={content.buttonText || ''}
            onChange={(e) => updateField('buttonText', e.target.value)}
            placeholder="Get Started"
          />
          <Input
            label="Button URL"
            value={content.buttonUrl || ''}
            onChange={(e) => updateField('buttonUrl', e.target.value)}
            placeholder="/signup"
          />
        </div>
      )

    case 'text':
      return (
        <div className="space-y-4">
          <Input
            label="Title (Optional)"
            value={content.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Section Title"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Content (HTML supported)
            </label>
            <textarea
              value={content.text || ''}
              onChange={(e) => updateField('text', e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              placeholder="<p>Your content here...</p>"
            />
          </div>
        </div>
      )

    case 'features':
      return (
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={content.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Our Features"
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Features</h4>
              <Button
                size="sm"
                onClick={() => addArrayItem('features', { icon: '⭐', title: 'New Feature', description: '' })}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Feature
              </Button>
            </div>

            {(content.features || []).map((feature: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Feature {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('features', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    label="Icon (emoji)"
                    value={feature.icon || ''}
                    onChange={(e) => updateArrayItem('features', index, { icon: e.target.value })}
                    placeholder="⭐"
                  />
                  <Input
                    label="Title"
                    value={feature.title || ''}
                    onChange={(e) => updateArrayItem('features', index, { title: e.target.value })}
                    placeholder="Feature Title"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={feature.description || ''}
                      onChange={(e) => updateArrayItem('features', index, { description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Feature description"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )

    case 'pricing':
      return (
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={content.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Pricing Plans"
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Plans</h4>
              <Button
                size="sm"
                onClick={() => addArrayItem('plans', { 
                  name: 'New Plan', 
                  price: '$0', 
                  period: '/month',
                  features: [],
                  buttonText: 'Get Started'
                })}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Plan
              </Button>
            </div>

            {(content.plans || []).map((plan: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Plan {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('plans', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    label="Plan Name"
                    value={plan.name || ''}
                    onChange={(e) => updateArrayItem('plans', index, { name: e.target.value })}
                    placeholder="Starter"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Price"
                      value={plan.price || ''}
                      onChange={(e) => updateArrayItem('plans', index, { price: e.target.value })}
                      placeholder="$29"
                    />
                    <Input
                      label="Period"
                      value={plan.period || ''}
                      onChange={(e) => updateArrayItem('plans', index, { period: e.target.value })}
                      placeholder="/month"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features (one per line)
                    </label>
                    <textarea
                      value={(plan.features || []).join('\n')}
                      onChange={(e) => updateArrayItem('plans', index, { 
                        features: e.target.value.split('\n').filter(f => f.trim()) 
                      })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    />
                  </div>
                  <Input
                    label="Button Text"
                    value={plan.buttonText || ''}
                    onChange={(e) => updateArrayItem('plans', index, { buttonText: e.target.value })}
                    placeholder="Get Started"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )

    case 'testimonials':
      return (
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={content.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="What Our Customers Say"
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Testimonials</h4>
              <Button
                size="sm"
                onClick={() => addArrayItem('testimonials', { 
                  quote: '', 
                  name: '', 
                  role: '',
                  avatar: ''
                })}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Testimonial
              </Button>
            </div>

            {(content.testimonials || []).map((testimonial: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Testimonial {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('testimonials', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quote
                    </label>
                    <textarea
                      value={testimonial.quote || ''}
                      onChange={(e) => updateArrayItem('testimonials', index, { quote: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="This product changed my life!"
                    />
                  </div>
                  <Input
                    label="Name"
                    value={testimonial.name || ''}
                    onChange={(e) => updateArrayItem('testimonials', index, { name: e.target.value })}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Role/Company"
                    value={testimonial.role || ''}
                    onChange={(e) => updateArrayItem('testimonials', index, { role: e.target.value })}
                    placeholder="CEO at Company"
                  />
                  <Input
                    label="Avatar URL"
                    value={testimonial.avatar || ''}
                    onChange={(e) => updateArrayItem('testimonials', index, { avatar: e.target.value })}
                    placeholder="https://..."
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )

    case 'faq':
      return (
        <div className="space-y-4">
          <Input
            label="Section Title"
            value={content.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Frequently Asked Questions"
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Questions</h4>
              <Button
                size="sm"
                onClick={() => addArrayItem('faqs', { question: '', answer: '' })}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Question
              </Button>
            </div>

            {(content.faqs || []).map((faq: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">FAQ {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('faqs', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    label="Question"
                    value={faq.question || ''}
                    onChange={(e) => updateArrayItem('faqs', index, { question: e.target.value })}
                    placeholder="What is your refund policy?"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer || ''}
                      onChange={(e) => updateArrayItem('faqs', index, { answer: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="We offer a 30-day money-back guarantee..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )

    case 'image':
      return (
        <div className="space-y-4">
          <Input
            label="Image URL"
            value={content.imageUrl || ''}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            placeholder="https://..."
          />
          <Input
            label="Alt Text"
            value={content.alt || ''}
            onChange={(e) => updateField('alt', e.target.value)}
            placeholder="Image description"
          />
          <Input
            label="Caption (Optional)"
            value={content.caption || ''}
            onChange={(e) => updateField('caption', e.target.value)}
            placeholder="Image caption"
          />
        </div>
      )

    default:
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Content editor for "{block.block_type}" coming soon</p>
          <p className="text-sm mt-2">Use JSON editor for now</p>
        </div>
      )
  }
}
