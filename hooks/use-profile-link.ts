'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export const profileCache = new Map<string, string>()

export function useProfileLink() {
  const { user, isLoaded } = useUser()
  const [profileUrl, setProfileUrl] = useState<string>('/register')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !user) {
      setIsLoading(false)
      return
    }

    async function checkProfile() {
      if (profileCache.has(user!.id)) {
        setProfileUrl(profileCache.get(user!.id)!)
        setIsLoading(false)
        return
      }

      const supabase = createClient()
      const result = await supabase
        .from('profiles')
        .select('username')
        .eq('clerk_user_id', user!.id)
        .maybeSingle()
      const row = result.data as { username: string } | null

      if (row?.username) {
        profileCache.set(user!.id, `/devs/${row.username}`)
        setProfileUrl(`/devs/${row.username}`)
      } else {
        setProfileUrl('/register')
      }
      setIsLoading(false)
    }

    checkProfile()
  }, [user, isLoaded])

  return { profileUrl, isLoading }
}
