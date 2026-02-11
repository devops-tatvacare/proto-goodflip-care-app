"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { getOverlayStyles, getOverlayAnimation, getDragConfig } from "./overlay-config"
import { Icon } from '@/components/ui/icon'

interface Device {
  id: string
  name: string
  type: string
  isConnected: boolean
  batteryLevel?: number
  lastSync: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
}

interface DevicesOverlayProps {
  isOpen: boolean
  onClose: () => void
  onAddDevice?: () => void
  onDeviceSelect?: (device: Device) => void
}

interface AddDeviceOverlayProps {
  isOpen: boolean
  onClose: () => void
  onDeviceAdd?: (deviceType: string) => void
}

export function DevicesOverlay({ 
  isOpen, 
  onClose, 
  onAddDevice,
  onDeviceSelect 
}: DevicesOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showAddDeviceOverlay, setShowAddDeviceOverlay] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragConfig = getDragConfig()

  // Mock connected devices for clean display
  const connectedDevices = [
    {
      id: '2', 
      name: 'Smart Scale Pro',
      type: 'Body Composition',
      isConnected: true,
      batteryLevel: 92,
      lastSync: '1 hour ago', 
      icon: (props: any) => <Icon name="scale" {...props} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: '3',
      name: 'Heart Rate Monitor',
      type: 'Cardiac Monitor', 
      isConnected: false,
      batteryLevel: 23,
      lastSync: '3 hours ago',
      icon: (props: any) => <Icon name="heart" {...props} />,
      color: 'text-red-600', 
      bgColor: 'bg-red-50'
    }
  ]

  // Handle drag end for pull-to-dismiss
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    
    // Close if dragged down more than threshold or with sufficient velocity
    if (info.offset.y > dragConfig.dismissThreshold || info.velocity.y > dragConfig.velocityThreshold) {
      onClose()
    }
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Prevent scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])


  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="absolute inset-0 z-[175] flex items-end"
          onClick={handleBackdropClick}
          ref={constraintsRef}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Overlay Panel */}
          <motion.div
            className="relative w-full bg-[var(--ds-surface-primary)] rounded-t-3xl shadow-2xl flex flex-col"
            style={getOverlayStyles('primary')}
            initial={{ y: "100%" }}
            animate={{ y: isDragging ? undefined : 0 }}
            exit={{ y: "100%" }}
            transition={getOverlayAnimation()}
            drag="y"
            dragConstraints={dragConfig.dragConstraints}
            dragElastic={dragConfig.dragElastic}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            whileDrag={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "var(--icon-bg-primary)" }}
                  >
                    <Icon name="watch" className="w-5 h-5"
                      style={{ color: "var(--app-primary)" }}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>My Devices</h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {connectedDevices.filter(d => d.isConnected).length} connected
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAddDeviceOverlay(true)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: "var(--app-primary)", 
                    color: "var(--ds-text-inverse)" 
                  }}
                >
                  <Icon name="plus" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Container - Scrollable */}
            <div className="flex-1 px-6 pb-8 overflow-y-auto" style={{ maxHeight: "calc(100% - 100px)", WebkitOverflowScrolling: "touch" }}>
              <div className="space-y-3">
                {connectedDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                  >
                    <div className={`w-10 h-10 rounded-lg ${device.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <device.icon className={`w-5 h-5 ${device.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                            {device.name}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {device.type}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {device.isConnected ? (
                            <Icon name="wifi" className="w-4 h-4 text-[var(--status-success)]" />
                          ) : (
                            <Icon name="wifiOff" className="w-4 h-4 text-[var(--text-muted)]" />
                          )}
                          
                          {device.batteryLevel && (
                            <div className="flex items-center gap-1">
                              <Icon 
                                name="battery"
                                className={`w-4 h-4 ${
                                  device.batteryLevel > 50 ? 'text-[var(--ds-status-success)]' : 
                                  device.batteryLevel > 20 ? 'text-yellow-500' : 'text-[var(--ds-status-error)]'
                                }`} 
                              />
                              <span className="text-xs font-medium text-[var(--text-secondary)]">
                                {device.batteryLevel}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-[var(--text-muted)]">  
                          Last sync: {device.lastSync}
                        </span>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          device.isConnected 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-[var(--ds-text-secondary)]'
                        }`}>
                          {device.isConnected ? 'Connected' : 'Offline'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Recommended For You - BCA Card */}
              <div className="mt-4">
                <button
                  onClick={() => console.log('Navigate to health assistant chat with BCA recommendations')}
                  className="w-full relative overflow-hidden rounded-xl hover:shadow-sm transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.15)'
                  }}
                >
                  <div className="p-3">
                    <div className="flex">
                      {/* BCA image */}
                      <div className="w-24 h-24 flex-shrink-0 mr-4">
                        <img src="/images/bca.png" alt="Recommended For You" className="w-full h-full object-contain rounded" />
                      </div>
                      
                      {/* Right side content - text and button */}
                      <div className="flex-1 h-24 relative">
                        {/* Title and subtext - positioned at top left */}
                        <div className="text-left">
                          <div className="font-medium text-gray-900 text-sm">Recommended For You</div>
                          <div className="text-xs text-[var(--ds-text-secondary)] mt-1">Enhance your health monitoring</div>
                        </div>
                        {/* Ask Kaira button - positioned at bottom right */}
                        <div className="absolute bottom-0 right-0">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary-hover)] text-[var(--ds-text-inverse)] px-3 py-1.5 rounded-md text-xs font-medium shadow-sm">
                            <Icon name="sparkles" className="w-3 h-3" />
                            <span className="whitespace-nowrap">Ask Kaira</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Add Device Secondary Overlay */}
      <AddDeviceOverlay 
        isOpen={showAddDeviceOverlay}
        onClose={() => setShowAddDeviceOverlay(false)}
        onDeviceAdd={(deviceType) => {
          console.log('Adding device:', deviceType)
          setShowAddDeviceOverlay(false)
        }}
      />
    </AnimatePresence>
  )
}

// Secondary Overlay for Adding Devices
function AddDeviceOverlay({ isOpen, onClose, onDeviceAdd }: AddDeviceOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragConfig = getDragConfig()
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    if (info.offset.y > dragConfig.dismissThreshold || info.velocity.y > dragConfig.velocityThreshold) {
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  const availableDevices = [
    { id: 'watch', name: 'Fitness Tracker', description: 'Track activity, heart rate & sleep', icon: (props: any) => <Icon name="watch" {...props} />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'scale', name: 'Smart Scale', description: 'Monitor weight & body composition', icon: (props: any) => <Icon name="scale" {...props} />, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'heart', name: 'Heart Monitor', description: 'Continuous heart rate monitoring', icon: (props: any) => <Icon name="heart" {...props} />, color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 'activity', name: 'Activity Sensor', description: 'Movement & posture tracking', icon: (props: any) => <Icon name="heartMonitor" {...props} />, color: 'text-purple-600', bgColor: 'bg-purple-50' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="absolute inset-0 z-[200] flex items-end"
          onClick={handleBackdropClick}
          ref={constraintsRef}
        >
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.div
            className="relative w-full bg-[var(--ds-surface-primary)] rounded-t-3xl shadow-2xl flex flex-col"
            style={getOverlayStyles('secondary')}
            initial={{ y: "100%" }}
            animate={{ y: isDragging ? undefined : 0 }}
            exit={{ y: "100%" }}
            transition={getOverlayAnimation()}
            drag="y"
            dragConstraints={dragConfig.dragConstraints}
            dragElastic={dragConfig.dragElastic}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <div className="px-6 py-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Add New Device</h2>
                <p className="text-sm text-[var(--text-secondary)]">Choose a device type to connect</p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(100% - 120px)", WebkitOverflowScrolling: "touch" }}>
                {availableDevices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => onDeviceAdd?.(device.id)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl transition-colors"
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${device.bgColor} flex items-center justify-center`}>
                      <device.icon className={`w-6 h-6 ${device.color}`} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-medium" style={{ color: "var(--text-primary)" }}>{device.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{device.description}</p>
                    </div>
                    
                    <Icon name="plus" className="w-5 h-5" style={{ color: "var(--app-primary)" }} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
