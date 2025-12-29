import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pagesAPI } from '../lib/api'
import toast from 'react-hot-toast'

export function usePages() {
  const queryClient = useQueryClient()

  const pagesQuery = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const response = await pagesAPI.getAll()
      if (!response.success) throw new Error(response.error || 'Failed to fetch pages')
      return response.data || []
    },
  })

  const createPageMutation = useMutation({
    mutationFn: pagesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
      toast.success('Page created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create page')
    },
  })

  const updatePageMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      pagesAPI.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
      toast.success('Page updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update page')
    },
  })

  const deletePageMutation = useMutation({
    mutationFn: pagesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
      toast.success('Page deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete page')
    },
  })

  const publishPageMutation = useMutation({
    mutationFn: pagesAPI.publish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
      toast.success('Page published successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to publish page')
    },
  })

  return {
    pages: pagesQuery.data,
    isLoading: pagesQuery.isLoading,
    error: pagesQuery.error,
    createPage: createPageMutation.mutate,
    updatePage: updatePageMutation.mutate,
    deletePage: deletePageMutation.mutate,
    publishPage: publishPageMutation.mutate,
  }
}

export function usePage(id: string) {
  return useQuery({
    queryKey: ['pages', id],
    queryFn: async () => {
      const response = await pagesAPI.getById(id)
      if (!response.success) throw new Error(response.error || 'Failed to fetch page')
      return response.data
    },
    enabled: !!id && id !== 'new', // Don't fetch if id is 'new'
  })
}
