import { useEffect } from 'react'
import { useAuthStore } from '../lib/auth-store'

export function useAuth() {
  const { user, profile, loading, initialized, initialize } = useAuthStore()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isEditor: profile?.role === 'editor' || profile?.role === 'admin',
  }
}
