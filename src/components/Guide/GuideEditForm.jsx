import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { geocodeLocation } from '../../lib/geocoding'

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
  'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
].sort()

function GuideEditForm({ guide, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    author_name: guide.author_name || '',
    email: guide.email || '',
    country_name: guide.country_name || '',
    city: guide.city || '',
    street_cred: guide.street_cred || '',
    street_cred_years: guide.street_cred_years || '',
    dish: guide.dish || '',
    sunset: guide.sunset || '',
    family: guide.family || '',
    friend: guide.friend || '',
    date: guide.date || '',
    overrated: guide.overrated || '',
    instead: guide.instead || '',
    walk: guide.walk || '',
    tips: guide.tips || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate required fields
    if (!formData.author_name || !formData.email || !formData.country_name || !formData.city || !formData.street_cred) {
      setError('Please fill in all required fields (name, email, country, city, street cred)')
      setLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    // Validate street_cred_years if "lived here" is selected
    if (formData.street_cred === 'lived_here' && (!formData.street_cred_years || formData.street_cred_years <= 0)) {
      setError('Please specify how many years you lived here')
      setLoading(false)
      return
    }

    // Validate at least TWO content fields
    const contentFields = ['dish', 'sunset', 'family', 'friend', 'date', 'overrated', 'instead', 'walk', 'tips']
    const filledContentFields = contentFields.filter(field => formData[field].trim() !== '').length
    if (filledContentFields < 2) {
      setError('Please fill in at least 2 guide sections to share your recommendations')
      setLoading(false)
      return
    }

    try {
      // Check if location changed - if so, re-geocode
      let latitude = guide.latitude
      let longitude = guide.longitude

      if (formData.city !== guide.city || formData.country_name !== guide.country_name) {
        const geocodeResult = await geocodeLocation(formData.city, formData.country_name)

        if (!geocodeResult.success) {
          setError(geocodeResult.error || 'Could not find location. Please check the city and country names.')
          setLoading(false)
          return
        }

        latitude = geocodeResult.latitude
        longitude = geocodeResult.longitude
      }

      const { data, error: updateError } = await supabase
        .from('guides')
        .update({
          author_name: formData.author_name,
          email: formData.email,
          country_name: formData.country_name,
          city: formData.city,
          latitude: latitude,
          longitude: longitude,
          street_cred: formData.street_cred,
          street_cred_years: formData.street_cred === 'lived_here' ? parseInt(formData.street_cred_years) : null,
          dish: formData.dish || null,
          sunset: formData.sunset || null,
          family: formData.family || null,
          friend: formData.friend || null,
          date: formData.date || null,
          overrated: formData.overrated || null,
          instead: formData.instead || null,
          walk: formData.walk || null,
          tips: formData.tips || null
        })
        .eq('id', guide.id)
        .select()

      if (updateError) throw updateError

      // Success!
      if (onSuccess) onSuccess(data[0])
    } catch (err) {
      console.error('Error updating guide:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white bg-opacity-95 rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#8B4513 transparent'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-[#3D3D3D]">Edit Your Travel Guide</h2>
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
        {/* Basic Info */}
        <div className="space-y-4 pb-4 border-b border-[#3D3D3D]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                Your Name *
              </label>
              <input
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                Your Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                Country *
              </label>
              <select
                name="country_name"
                value={formData.country_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              >
                <option value="">Select a country...</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              />
            </div>
          </div>

          {/* Street Cred */}
          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              Street Cred *
            </label>
            <div className="space-y-1">
              <label className="flex items-center gap-2 p-2 bg-white bg-opacity-40 rounded-lg cursor-pointer hover:bg-opacity-60 transition">
                <input
                  type="radio"
                  name="street_cred"
                  value="from_here"
                  checked={formData.street_cred === 'from_here'}
                  onChange={handleChange}
                  required
                  className="w-4 h-4"
                />
                <span className="text-sm text-[#3D3D3D]">I'm from here</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white bg-opacity-40 rounded-lg cursor-pointer hover:bg-opacity-60 transition">
                <input
                  type="radio"
                  name="street_cred"
                  value="lived_here"
                  checked={formData.street_cred === 'lived_here'}
                  onChange={handleChange}
                  required
                  className="w-4 h-4"
                />
                <span className="text-sm text-[#3D3D3D]">Lived here for</span>
                {formData.street_cred === 'lived_here' && (
                  <>
                    <input
                      type="number"
                      name="street_cred_years"
                      value={formData.street_cred_years}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-16 px-2 py-1 bg-white bg-opacity-60 rounded text-[#3D3D3D] text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                    />
                    <span className="text-sm text-[#3D3D3D]">years</span>
                  </>
                )}
              </label>

              <label className="flex items-center gap-2 p-2 bg-white bg-opacity-40 rounded-lg cursor-pointer hover:bg-opacity-60 transition">
                <input
                  type="radio"
                  name="street_cred"
                  value="tourist"
                  checked={formData.street_cred === 'tourist'}
                  onChange={handleChange}
                  required
                  className="w-4 h-4"
                />
                <span className="text-sm text-[#3D3D3D]">Tourist</span>
              </label>
            </div>
          </div>
        </div>

        {/* Guide Content */}
        <div className="space-y-4">
          <p className="text-xs text-[#8B7355] uppercase tracking-widest font-mono">
            Share Your Recommendations
          </p>

          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              🍽️ Local Cuisine
            </label>
            <textarea
              name="dish"
              value={formData.dish}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              placeholder="What dish should I eat and where?"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              🌅 Best Views
            </label>
            <textarea
              name="sunset"
              value={formData.sunset}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              placeholder="Where to catch the best sunset or views?"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              👨‍👩‍👧 Family Spots
            </label>
            <textarea
              name="family"
              value={formData.family}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              placeholder="Great places to visit with family"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              👥 With Friends
            </label>
            <textarea
              name="friend"
              value={formData.friend}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              placeholder="Fun activities for groups"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              💑 Date Ideas
            </label>
            <textarea
              name="date"
              value={formData.date}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              placeholder="Romantic spots and experiences"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              ⚠️ Overrated
            </label>
            <textarea
              name="overrated"
              value={formData.overrated}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              placeholder="Tourist traps to avoid"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              ✨ Try Instead
            </label>
            <textarea
              name="instead"
              value={formData.instead}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              placeholder="Better alternatives to popular spots"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              🚶 Walking Routes
            </label>
            <textarea
              name="walk"
              value={formData.walk}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              placeholder="Recommended walks and neighborhoods"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
              💡 Local Tips
            </label>
            <textarea
              name="tips"
              value={formData.tips}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-white bg-opacity-40 rounded-lg text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              placeholder="Insider advice for travelers"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#8B4513] text-[#F5E6D3] rounded-full hover:bg-[#6D3410] transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
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

export default GuideEditForm
