"use client"

interface HeroBannerProps {
  onAvatarClick: () => void
  onNotificationClick: () => void
  onDeviceClick: () => void
  onCalendarClick: () => void
  onCareProgramClick: () => void
  unreadCount: number
}

export function HeroBanner({
  onAvatarClick,
  onNotificationClick,
  onDeviceClick,
  onCalendarClick,
  onCareProgramClick,
  unreadCount,
}: HeroBannerProps) {
  return (
    <div
      className="mx-0 mt-0 rounded-b-2xl relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B4D3C 0%, #0E6B4A 50%, #119E73 100%)",
      }}
    >
      {/* Static Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large bubbles */}
        <div
          className="absolute top-4 left-8 w-16 h-16 rounded-full opacity-20"
          style={{
            background: `linear-gradient(135deg, var(--app-primary), var(--app-primary-light))`,
          }}
        />
        <div
          className="absolute top-12 right-12 w-12 h-12 rounded-full opacity-25"
          style={{
            background: `linear-gradient(45deg, var(--icon-bg-primary), var(--app-primary))`,
          }}
        />

        {/* Medium bubbles */}
        <div
          className="absolute bottom-8 left-16 w-10 h-10 rounded-full opacity-30"
          style={{
            background: `linear-gradient(90deg, var(--app-primary-light), var(--icon-bg-secondary))`,
          }}
        />
        <div
          className="absolute top-20 left-1/3 w-8 h-8 rounded-full opacity-25"
          style={{
            background: `linear-gradient(180deg, var(--app-primary), var(--banner-bg-start))`,
          }}
        />
        <div
          className="absolute bottom-12 right-8 w-10 h-10 rounded-full opacity-20"
          style={{
            background: `linear-gradient(225deg, var(--icon-bg-primary), var(--app-primary-light))`,
          }}
        />

        {/* Small bubbles */}
        <div
          className="absolute top-16 right-20 w-6 h-6 rounded-full opacity-35"
          style={{
            background: `linear-gradient(315deg, var(--app-primary-light), var(--icon-bg-secondary))`,
          }}
        />
        <div
          className="absolute bottom-16 left-1/4 w-4 h-4 rounded-full opacity-30"
          style={{
            background: `linear-gradient(60deg, var(--app-primary), var(--banner-bg-end))`,
          }}
        />
        <div
          className="absolute top-24 right-1/3 w-6 h-6 rounded-full opacity-25"
          style={{
            background: `linear-gradient(120deg, var(--icon-bg-primary), var(--app-primary))`,
          }}
        />
      </div>

      <div className="pt-12 px-4 pb-2">
        {/* Greeting Text - Centered */}
        <div className="text-center mb-3 mt-2">
          <h1 className="text-base font-bold mb-2 drop-shadow-sm" style={{ color: "#ffffff" }}>
            Namaste, Kumar!
          </h1>
          
          {/* Styled Welcome Text Box */}
          <div className="relative mx-auto max-w-xs">
            {/* Decorative background shapes positioned outside the main box */}
            <div className="absolute -inset-4">
              <div 
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full opacity-30 blur-sm"
                style={{
                  background: "linear-gradient(135deg, var(--hero-teal) 0%, var(--hero-purple) 100%)"
                }}
              />
              <div 
                className="absolute -bottom-2 -left-3 w-8 h-8 rounded-full opacity-25 blur-sm"
                style={{
                  background: "linear-gradient(45deg, var(--hero-purple) 0%, var(--hero-indigo) 100%)"
                }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-12 rounded-full opacity-20 blur-sm"
                style={{
                  background: "linear-gradient(90deg, var(--hero-teal) 0%, var(--hero-purple) 100%)"
                }}
              />
            </div>
            
            {/* Main content box with beautiful Kaira-inspired gradient */}
            <div 
              className="relative rounded-2xl shadow-lg border backdrop-blur-sm"
              style={{
                background: "linear-gradient(135deg, var(--gradient-indigo-alpha) 0%, var(--gradient-purple-alpha) 25%, var(--gradient-pink-alpha) 50%, var(--gradient-blue-alpha) 75%, var(--gradient-teal-alpha) 100%), white",
                borderColor: "var(--primary-alpha-30)",
                boxShadow: "0 6px 24px var(--shadow-indigo-alpha), 0 2px 8px var(--shadow-purple-alpha)"
              }}
            >
              {/* Subtle inner highlight for depth */}
              <div 
                className="absolute inset-[1px] rounded-2xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, var(--white-alpha-40) 0%, var(--white-alpha-10) 100%)"
                }}
              />
              
              {/* Text content with Zydus logo - two lines */}
              <div className="relative px-5 py-3 text-center">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Welcome to your Semaglutide Journey
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-medium text-[var(--ds-text-secondary)] italic">Powered by</span>
                    <img 
                      src="/images/goodflip-logo.svg" 
                      alt="GoodFlip" 
                      className="h-4 w-auto object-contain" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
