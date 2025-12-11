import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { supabase, getCurrentUser, getUserProfile } from './supabase'
import type { CMSUserProfile } from '../types'

interface AuthState {
  user: User | null
  profile: CMSUserProfile | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: CMSUserProfile | null) => void
  initialize: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  
  initialize: async () => {
    try {
      const { user } = await getCurrentUser()
      
      if (user) {
        const { data: profile } = await getUserProfile(user.id)
        set({ user, profile, loading: false, initialized: true })
      } else {
        set({ user: null, profile: null, loading: false, initialized: true })
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      set({ user: null, profile: null, loading: false, initialized: true })
    }
  },
  
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
}))
