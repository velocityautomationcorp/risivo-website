import { useState } from 'react'
import { Card, CardHeader, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import type { CMSContentBlock } from '../types'

interface StyleEditorProps {
  block: CMSContentBlock
  onUpdate: (settings: any) => void
}

export function StyleEditor({ block, onUpdate }: StyleEditorProps) {
  const settings = block.settings || {}

  const updateSetting = (key: string, value: any) => {
    onUpdate({ ...settings, [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Colors */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Colors</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings.backgroundColor || '#ffffff'}
                onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.backgroundColor || '#ffffff'}
                onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={settings.textColor || '#000000'}
                onChange={(e) => updateSetting('textColor', e.target.value)}
                className="h-10 w-20 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.textColor || '#000000'}
                onChange={(e) => updateSetting('textColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="#000000"
              />
            </div>
          </div>

          {(block.block_type === 'hero' || block.block_type === 'cta' || block.block_type === 'features' || block.block_type === 'pricing' || block.block_type === 'testimonials' || block.block_type === 'faq') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.titleColor || settings.textColor || '#000000'}
                    onChange={(e) => updateSetting('titleColor', e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.titleColor || settings.textColor || '#000000'}
                    onChange={(e) => updateSetting('titleColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {(block.block_type === 'hero' || block.block_type === 'cta') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.subtitleColor || '#666666'}
                        onChange={(e) => updateSetting('subtitleColor', e.target.value)}
                        className="h-10 w-20 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.subtitleColor || '#666666'}
                        onChange={(e) => updateSetting('subtitleColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.buttonColor || '#3B82F6'}
                        onChange={(e) => updateSetting('buttonColor', e.target.value)}
                        className="h-10 w-20 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.buttonColor || '#3B82F6'}
                        onChange={(e) => updateSetting('buttonColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.buttonTextColor || '#FFFFFF'}
                        onChange={(e) => updateSetting('buttonTextColor', e.target.value)}
                        className="h-10 w-20 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.buttonTextColor || '#FFFFFF'}
                        onChange={(e) => updateSetting('buttonTextColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Typography</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {(block.block_type === 'hero' || block.block_type === 'cta' || block.block_type === 'text' || block.block_type === 'features' || block.block_type === 'pricing' || block.block_type === 'testimonials' || block.block_type === 'faq') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title Size
              </label>
              <input
                type="text"
                value={settings.titleSize || (block.block_type === 'hero' ? '3rem' : '2.5rem')}
                onChange={(e) => updateSetting('titleSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="2.5rem"
              />
            </div>
          )}

          {(block.block_type === 'hero' || block.block_type === 'cta') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle Size
                </label>
                <input
                  type="text"
                  value={settings.subtitleSize || '1.25rem'}
                  onChange={(e) => updateSetting('subtitleSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="1.25rem"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Size
                </label>
                <input
                  type="text"
                  value={settings.buttonSize || '1rem'}
                  onChange={(e) => updateSetting('buttonSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="1rem"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Spacing</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padding (e.g., "3rem 1rem")
            </label>
            <input
              type="text"
              value={settings.padding || '3rem 1rem'}
              onChange={(e) => updateSetting('padding', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="3rem 1rem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Align
            </label>
            <select
              value={settings.textAlign || 'center'}
              onChange={(e) => updateSetting('textAlign', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Background Image */}
      {(block.block_type === 'hero' || block.block_type === 'cta') && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Background Image</h3>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={settings.backgroundImage || ''}
                onChange={(e) => updateSetting('backgroundImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Tip: Upload an image in Media Library and copy its URL
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout Options */}
      {(block.block_type === 'features' || block.block_type === 'pricing' || block.block_type === 'testimonials') && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Layout</h3>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Columns
              </label>
              <select
                value={settings.columns || 3}
                onChange={(e) => updateSetting('columns', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
