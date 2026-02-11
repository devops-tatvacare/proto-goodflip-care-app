"use client"

interface MobileHomeScreenProps {
  onAppIconClick: () => void
}

export function MobileHomeScreen({ onAppIconClick }: MobileHomeScreenProps) {
  const apps = [
    { name: "Mail", icon: "📧", color: "bg-[var(--ds-interactive-primary)]" },
    { name: "Camera", icon: "📷", color: "bg-gray-600" },
    { name: "Music", icon: "🎵", color: "bg-[var(--ds-status-error)]" },
    { name: "Settings", icon: "⚙️", color: "bg-gray-500" },
    { name: "Phone", icon: "📞", color: "bg-[var(--ds-status-success)]" },
    { name: "Safari", icon: "🌐", color: "bg-blue-400" },
    { name: "Notes", icon: "📝", color: "bg-yellow-500" },
    { name: "Games", icon: "🎮", color: "bg-purple-500" },
    { name: "Stocks", icon: "📊", color: "bg-black" },
    { name: "Store", icon: "🛒", color: "bg-blue-600" },
    { name: "Messages", icon: "💬", color: "bg-green-400" },
  ]

  const dockApps = [
    { name: "Phone", icon: "📞", color: "bg-[var(--ds-status-success)]" },
    { name: "Safari", icon: "🌐", color: "bg-blue-400" },
    { name: "Messages", icon: "💬", color: "bg-green-400" },
    { name: "Music", icon: "🎵", color: "bg-[var(--ds-status-error)]" },
  ]

  return (
    <div className="h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--ds-surface-primary)]/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-purple-300/15 rounded-full blur-xl"></div>
      </div>

      {/* Status bar space */}
      <div className="h-11"></div>

      {/* App grid */}
      <div className="px-6 pt-8">
        {/* First row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {apps.slice(0, 4).map((app, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-14 h-14 ${app.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                {app.icon}
              </div>
              <span className="text-gray-800 text-xs mt-1 text-center">{app.name}</span>
            </div>
          ))}
        </div>

        {/* Second row with GoodFlip Care app */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col items-center">
            <div className={`w-14 h-14 ${apps[4].color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
              {apps[4].icon}
            </div>
            <span className="text-gray-800 text-xs mt-1 text-center">{apps[4].name}</span>
          </div>
          
          {/* GoodFlip Care App Icon */}
          <button 
            onClick={onAppIconClick}
            className="flex flex-col items-center focus:outline-none transform transition-transform active:scale-95"
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/images/goodflip-care-app-icon.png" 
                alt="GoodFlip Care" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-gray-800 text-xs mt-1 text-center">GoodFlip Care</span>
          </button>

          {apps.slice(5, 7).map((app, index) => (
            <div key={index + 5} className="flex flex-col items-center">
              <div className={`w-14 h-14 ${app.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                {app.icon}
              </div>
              <span className="text-gray-800 text-xs mt-1 text-center">{app.name}</span>
            </div>
          ))}
        </div>

        {/* Third row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {apps.slice(7, 11).map((app, index) => (
            <div key={index + 7} className="flex flex-col items-center">
              <div className={`w-14 h-14 ${app.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                {app.icon}
              </div>
              <span className="text-gray-800 text-xs mt-1 text-center">{app.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <div className="bg-[var(--ds-surface-primary)]/20 backdrop-blur-md rounded-2xl p-3">
          <div className="grid grid-cols-4 gap-4">
            {dockApps.map((app, index) => (
              <div key={index} className="flex justify-center">
                <div className={`w-14 h-14 ${app.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {app.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
