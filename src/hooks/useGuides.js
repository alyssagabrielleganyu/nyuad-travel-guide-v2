import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useGuides() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGuides()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('guides-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'guides'
      }, (payload) => {
        console.log('Real-time update:', payload)
        fetchGuides() // Re-fetch when data changes
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchGuides = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setGuides(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching guides:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { guides, loading, error, refetch: fetchGuides }
}
