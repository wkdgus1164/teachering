"use client"

import { useState, useEffect, useCallback } from "react"
import { useSupabase } from "./provider"

// A general hook for client-side data fetching
export function useSupabaseFetch<T>(fetchFn: (supabase: any) => Promise<T>, dependencies: any[] = []) {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchFn(supabase)
      setData(result)
      setError(null)
    } catch (e) {
      console.error("Error fetching data:", e)
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setLoading(false)
    }
  }, [supabase, fetchFn])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies])

  const mutate = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, mutate }
}
