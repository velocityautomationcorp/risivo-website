import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaAPI } from '../lib/api'
import toast from 'react-hot-toast'

export function useMedia(folder?: string) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['media', folder],
    queryFn: () => mediaAPI.getAll(folder),
  })

  const uploadMedia = useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      mediaAPI.upload(file, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
      toast.success('Media uploaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload media')
    },
  })

  const deleteMedia = useMutation({
    mutationFn: (id: string) => mediaAPI.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['media'] })
        toast.success('Media deleted successfully')
      } else {
        toast.error(response.error || 'Failed to delete media')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete media')
    },
  })

  return {
    media: data?.data || [],
    isLoading,
    error: error?.message || data?.error,
    uploadMedia,
    deleteMedia,
  }
}
