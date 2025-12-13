import { useMutation, useQueryClient } from '@tanstack/react-query'
import { blocksAPI } from '../lib/api'
import type { CMSContentBlock } from '../types'
import toast from 'react-hot-toast'

export function useContentBlocks() {
  const queryClient = useQueryClient()

  const createBlock = useMutation({
    mutationFn: (block: Partial<CMSContentBlock>) => blocksAPI.create(block),
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate the page query to refresh blocks
        queryClient.invalidateQueries({ queryKey: ['page'] })
        toast.success('Content block created successfully')
      } else {
        toast.error(response.error || 'Failed to create content block')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create content block')
    },
  })

  const updateBlock = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CMSContentBlock> }) =>
      blocksAPI.update(id, updates),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['page'] })
        toast.success('Content block updated successfully')
      } else {
        toast.error(response.error || 'Failed to update content block')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update content block')
    },
  })

  const deleteBlock = useMutation({
    mutationFn: (id: string) => blocksAPI.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['page'] })
        toast.success('Content block deleted successfully')
      } else {
        toast.error(response.error || 'Failed to delete content block')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete content block')
    },
  })

  const reorderBlocks = useMutation({
    mutationFn: (blocks: { id: string; position: number }[]) =>
      blocksAPI.reorder(blocks),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['page'] })
        toast.success('Blocks reordered successfully')
      } else {
        toast.error(response.error || 'Failed to reorder blocks')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reorder blocks')
    },
  })

  return {
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
  }
}
