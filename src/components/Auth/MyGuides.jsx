import { useState } from 'react'

function MyGuides({ userEmail, guides, onEdit, onSignOut, onClose }) {
  return (
    <div className="bg-white bg-opacity-95 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#8B4513 transparent'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif text-[#3D3D3D]">My Guides</h2>
              <p className="text-xs text-[#8B7355] mt-1">{userEmail}</p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-[#8B7355] hover:text-[#3D3D3D] transition"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={onSignOut}
          className="px-4 py-2 bg-[#3D3D3D] text-[#F5E6D3] rounded-full hover:bg-[#5D5D5D] transition text-xs font-medium"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-3">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="p-4 bg-white bg-opacity-40 rounded-lg border border-[#8B7355] hover:bg-opacity-60 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-serif text-[#3D3D3D] mb-1">
                  {guide.city}, {guide.country_name}
                </h3>
                <p className="text-xs text-[#8B7355]">
                  {guide.street_cred === 'from_here' && 'Local'}
                  {guide.street_cred === 'lived_here' && `Lived here for ${guide.street_cred_years} years`}
                  {guide.street_cred === 'tourist' && 'Tourist'}
                  {guide.created_at && (() => {
                    const date = new Date(guide.created_at)
                    return ` • ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                  })()}
                </p>
              </div>
              <button
                onClick={() => onEdit(guide)}
                className="ml-4 px-4 py-2 bg-[#8B4513] text-[#F5E6D3] rounded-full hover:bg-[#6D3410] transition text-xs font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyGuides
