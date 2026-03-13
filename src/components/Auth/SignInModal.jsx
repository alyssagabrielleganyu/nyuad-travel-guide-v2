import { useState } from 'react'
import { supabase } from '../../lib/supabase'

function SignInModal({ onSuccess, onCancel }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      // Check if email has any guides
      const { data: guides, error: queryError } = await supabase
        .from('guides')
        .select('*')
        .eq('email', email)

      if (queryError) throw queryError

      if (guides.length === 0) {
        setError('No guides found for this email address')
        setLoading(false)
        return
      }

      // Success - pass email and guides back
      if (onSuccess) onSuccess({ email, guides })
    } catch (err) {
      console.error('Error signing in:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white bg-opacity-95 rounded-2xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-[#3D3D3D]">Sign In</h2>
        <button
          onClick={onCancel}
          className="text-2xl text-[#8B7355] hover:text-[#3D3D3D] transition"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
            Your Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
            placeholder="your@email.com"
          />
          <p className="text-xs text-[#8B7355] mt-2">
            Enter the email you used to submit your travel guides
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#8B4513] text-[#F5E6D3] rounded-full hover:bg-[#6D3410] transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-[#3D3D3D] text-[#F5E6D3] rounded-full hover:bg-[#5D5D5D] transition text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignInModal
