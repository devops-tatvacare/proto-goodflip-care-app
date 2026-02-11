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
  onInstallerModeChange?: (active: boolean) => void
  launchInstallerDirect?: boolean
  launchInstallerProductId?: string
}

interface AddDeviceOverlayProps {
  isOpen: boolean
  onClose: () => void
  onDeviceAdd?: (deviceType: string) => void
  onDeviceConnected?: (device: Device) => void
  onInstallerModeChange?: (active: boolean) => void
  launchInstallerDirect?: boolean
  launchInstallerProductId?: string
}

type AddDeviceView =
  | "categories"
  | "products"
  | "installer"

type InstallStep =
  | "connect"
  | "details"
  | "permission"
  | "step-on"
  | "pairing"
  | "success"

type DeviceCategoryId = "scales" | "glucose" | "rings" | "bp" | "apple-health"

interface DeviceCategory {
  id: DeviceCategoryId
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
}

interface PairableProduct {
  id: string
  categoryId: DeviceCategoryId
  name: string
  brand: string
  subtitle: string
  image: string
}

interface SmartScaleProfile {
  heightFeet: string
  heightInches: string
  gender: "male" | "female"
  age: string
}

interface InstallationTemplate {
  connectTitle: string
  connectSteps: string[]
  detailTitle: string
  permissionTitle: string
  permissionBody: string
  stepOnTitle: string
  stepOnBody: string
  pairingTitle: string
  pairingBody: string
  successTitle: string
  successBody: string
}

const buildSmartScaleDevice = (): Device => ({
  id: `scale-${Date.now()}`,
  name: "Smart Scale Pro",
  type: "Body Composition",
  isConnected: true,
  batteryLevel: 100,
  lastSync: "just now",
  icon: (props: any) => <Icon name="scale" {...props} />,
  color: "text-green-600",
  bgColor: "bg-green-50",
})

const initialConnectedDevices: Device[] = [
  {
    id: "2",
    name: "Fitness Watch",
    type: "Activity & Heart Rate",
    isConnected: true,
    batteryLevel: 92,
    lastSync: "1 hour ago",
    icon: (props: any) => <Icon name="watch" {...props} />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "3",
    name: "Heart Rate Monitor",
    type: "Cardiac Monitor",
    isConnected: false,
    batteryLevel: 23,
    lastSync: "3 hours ago",
    icon: (props: any) => <Icon name="heart" {...props} />,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
]

const DEVICE_CATEGORIES: DeviceCategory[] = [
  {
    id: "scales",
    name: "Scales",
    description: "Weight and body composition",
    icon: (props: any) => <Icon name="scale" {...props} />,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "glucose",
    name: "Glucose Monitoring",
    description: "Track blood sugar readings",
    icon: (props: any) => <Icon name="heartMonitor" {...props} />,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: "rings",
    name: "Smart Rings",
    description: "Recovery, sleep and readiness",
    icon: (props: any) => <Icon name="circle" {...props} />,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    id: "bp",
    name: "BP Monitors",
    description: "Blood pressure tracking",
    icon: (props: any) => <Icon name="heart" {...props} />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "apple-health",
    name: "Apple Health Kit",
    description: "Sync health data from iPhone",
    icon: (props: any) => <Icon name="smartphone" {...props} />,
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
]

const PAIRABLE_PRODUCTS: PairableProduct[] = [
  {
    id: "goodflip-scale",
    categoryId: "scales",
    name: "Smart Scale",
    brand: "GoodFlip",
    subtitle: "Body composition + app sync",
    image: "/images/bca.png",
  },
  {
    id: "lifetron-scale",
    categoryId: "scales",
    name: "Smart Scale Pro",
    brand: "Lifetron",
    subtitle: "Weight, BMI and trends",
    image: "/images/bca.png",
  },
  {
    id: "gf-cgm",
    categoryId: "glucose",
    name: "CGM Reader",
    brand: "GoodFlip",
    subtitle: "Continuous glucose insights",
    image: "/images/CGM.png",
  },
  {
    id: "gf-ring",
    categoryId: "rings",
    name: "Health Ring",
    brand: "GoodFlip",
    subtitle: "Sleep and recovery metrics",
    image: "/images/bca.png",
  },
  {
    id: "gf-bp",
    categoryId: "bp",
    name: "BP Monitor",
    brand: "GoodFlip",
    subtitle: "Home blood pressure checks",
    image: "/images/bca.png",
  },
  {
    id: "apple-health-kit",
    categoryId: "apple-health",
    name: "Health Kit Integration",
    brand: "Apple Health",
    subtitle: "Read and sync wellness metrics",
    image: "/images/goodflip-care-app-icon.png",
  },
]

const INSTALL_TEMPLATE_BY_CATEGORY: Record<DeviceCategoryId, InstallationTemplate> = {
  scales: {
    connectTitle: "Let's Connect your Smart Scale",
    connectSteps: [
      "Insert batteries into the weighing scale",
      "Place the scale on a flat surface",
      "Ensure your phone bluetooth is turned on",
      "Remove footwear and/or socks",
    ],
    detailTitle: "Please confirm these details:",
    permissionTitle: '"GoodFlip Care" Would Like to Use Bluetooth',
    permissionBody: "Bluetooth is required to pair your Smart Scale.",
    stepOnTitle: "Step on to the Smart Scale...",
    stepOnBody: "The display should light up as soon as you do.",
    pairingTitle: "Pairing in progress",
    pairingBody: "Keep your phone near the Smart Scale.",
    successTitle: "Smart Scale Connected",
    successBody: "Your device is ready to sync health metrics.",
  },
  glucose: {
    connectTitle: "Let's Connect your Glucose Device",
    connectSteps: [
      "Charge your glucose device",
      "Keep your phone bluetooth turned on",
      "Keep your device close to your phone",
      "Follow the in-app pairing prompts",
    ],
    detailTitle: "Please confirm these details:",
    permissionTitle: '"GoodFlip Care" Would Like to Use Bluetooth',
    permissionBody: "Bluetooth is required to pair your glucose device.",
    stepOnTitle: "Keep your device nearby",
    stepOnBody: "We'll detect your device in a few seconds.",
    pairingTitle: "Pairing in progress",
    pairingBody: "Do not close the app while we complete setup.",
    successTitle: "Device Connected",
    successBody: "Your glucose device is now ready.",
  },
  rings: {
    connectTitle: "Let's Connect your Smart Ring",
    connectSteps: [
      "Place the ring in charging mode",
      "Keep your phone bluetooth turned on",
      "Keep the ring near your phone",
      "Stay on this screen while pairing",
    ],
    detailTitle: "Please confirm these details:",
    permissionTitle: '"GoodFlip Care" Would Like to Use Bluetooth',
    permissionBody: "Bluetooth is required to pair your smart ring.",
    stepOnTitle: "Keep your ring nearby",
    stepOnBody: "We'll detect your ring in a few seconds.",
    pairingTitle: "Pairing in progress",
    pairingBody: "Do not close the app while we complete setup.",
    successTitle: "Device Connected",
    successBody: "Your smart ring is now ready.",
  },
  bp: {
    connectTitle: "Let's Connect your BP Monitor",
    connectSteps: [
      "Power on the blood pressure monitor",
      "Keep your phone bluetooth turned on",
      "Place monitor close to your phone",
      "Stay on this screen while pairing",
    ],
    detailTitle: "Please confirm these details:",
    permissionTitle: '"GoodFlip Care" Would Like to Use Bluetooth',
    permissionBody: "Bluetooth is required to pair your BP monitor.",
    stepOnTitle: "Keep your monitor ready",
    stepOnBody: "We'll detect your device in a few seconds.",
    pairingTitle: "Pairing in progress",
    pairingBody: "Do not close the app while we complete setup.",
    successTitle: "Device Connected",
    successBody: "Your BP monitor is now ready.",
  },
  "apple-health": {
    connectTitle: "Connect Apple Health Kit",
    connectSteps: [
      "Keep your iPhone unlocked",
      "Open Health access when prompted",
      "Allow permissions for activity, heart and vitals",
      "Return to GoodFlip Care to finish setup",
    ],
    detailTitle: "Please confirm these details:",
    permissionTitle: '"GoodFlip Care" Would Like to Access Health Data',
    permissionBody: "Health access is required to sync your Apple Health metrics.",
    stepOnTitle: "Review access on iPhone",
    stepOnBody: "Confirm permissions in Health and come back here.",
    pairingTitle: "Syncing in progress",
    pairingBody: "We are connecting your Apple Health data.",
    successTitle: "Apple Health Connected",
    successBody: "Your Health Kit data is now syncing.",
  },
}

export function DevicesOverlay({ 
  isOpen, 
  onClose, 
  onAddDevice,
  onDeviceSelect,
  onInstallerModeChange,
  launchInstallerDirect,
  launchInstallerProductId,
}: DevicesOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showAddDeviceOverlay, setShowAddDeviceOverlay] = useState(false)
  const [connectedDevices, setConnectedDevices] = useState<Device[]>(initialConnectedDevices)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragConfig = getDragConfig()

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

  useEffect(() => {
    if (isOpen && launchInstallerDirect) {
      setShowAddDeviceOverlay(true)
    }
  }, [isOpen, launchInstallerDirect])

  useEffect(() => {
    if (!isOpen) {
      setShowAddDeviceOverlay(false)
    }
  }, [isOpen])


  return (
    <AnimatePresence>
      {isOpen && (
        !launchInstallerDirect && (
        <div 
          key="devices-overlay-panel"
          className="absolute inset-0 z-[175] flex items-end"
          ref={constraintsRef}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black"
            onClick={handleBackdropClick}
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
            dragConstraints={{ top: -120, bottom: 420 }}
            dragElastic={{ top: 0.14, bottom: 0.22 }}
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
        )
      )}
      
      {/* Add Device Secondary Overlay */}
      <AddDeviceOverlay 
        key="add-device-overlay"
        isOpen={isOpen && showAddDeviceOverlay}
        onClose={() => {
          if (launchInstallerDirect) {
            onClose()
            return
          }
          setShowAddDeviceOverlay(false)
        }}
        onDeviceAdd={(deviceType) => {
          console.log('Adding device:', deviceType)
          onAddDevice?.()
        }}
        onDeviceConnected={(device) => {
          setConnectedDevices((prev) => [device, ...prev])
        }}
        onInstallerModeChange={onInstallerModeChange}
        launchInstallerDirect={launchInstallerDirect}
        launchInstallerProductId={launchInstallerProductId}
      />
    </AnimatePresence>
  )
}

// Secondary Overlay for Adding Devices
function AddDeviceOverlay({ isOpen, onClose, onDeviceAdd, onDeviceConnected, onInstallerModeChange, launchInstallerDirect, launchInstallerProductId }: AddDeviceOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [view, setView] = useState<AddDeviceView>("categories")
  const [selectedCategoryId, setSelectedCategoryId] = useState<DeviceCategoryId>("scales")
  const [selectedProduct, setSelectedProduct] = useState<PairableProduct | null>(null)
  const [installStep, setInstallStep] = useState<InstallStep>("connect")
  const [showExitInstall, setShowExitInstall] = useState(false)
  const [profile, setProfile] = useState<SmartScaleProfile>({ heightFeet: "6", heightInches: "2", gender: "male", age: "32" })
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isPairing, setIsPairing] = useState(false)
  const [pairingError, setPairingError] = useState<string | null>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragConfig = getDragConfig()

  const currentCategory = DEVICE_CATEGORIES.find((c) => c.id === selectedCategoryId)
  const currentProducts = PAIRABLE_PRODUCTS.filter((p) => p.categoryId === selectedCategoryId)
  const installTemplate = selectedProduct ? INSTALL_TEMPLATE_BY_CATEGORY[selectedProduct.categoryId] : null
  const isInstaller = view === "installer"

  const exitInstaller = () => {
    if (launchInstallerDirect) {
      onClose()
      return
    }
    setInstallStep("connect")
    setView("products")
  }

  const resetFlow = () => {
    setView("categories")
    setSelectedCategoryId("scales")
    setSelectedProduct(null)
    setInstallStep("connect")
    setShowExitInstall(false)
    setPermissionDenied(false)
    setPairingError(null)
    setIsPairing(false)
  }

  const closeOverlay = () => {
    resetFlow()
    onClose()
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)

    if (isInstaller && info.offset.y > 120) {
      exitInstaller()
      return
    }

    if (info.offset.y > dragConfig.dismissThreshold || info.velocity.y > dragConfig.velocityThreshold) {
      closeOverlay()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeOverlay()
    }
  }

  const goBack = () => {
    if (view === "installer") {
      exitInstaller()
      return
    }

    if (view === "products") {
      setView("categories")
      return
    }

    closeOverlay()
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      resetFlow()
    }
  }, [isOpen])

  useEffect(() => {
    onInstallerModeChange?.(isOpen && isInstaller)
  }, [isInstaller, isOpen, onInstallerModeChange])

  useEffect(() => {
    if (!isOpen || !launchInstallerDirect) return

    const targetProduct = PAIRABLE_PRODUCTS.find((p) => p.id === (launchInstallerProductId || "goodflip-scale"))
    if (!targetProduct) return

    setSelectedCategoryId(targetProduct.categoryId)
    setSelectedProduct(targetProduct)
    setInstallStep("connect")
    setView("installer")
  }, [isOpen, launchInstallerDirect, launchInstallerProductId])

  useEffect(() => {
    if (!isOpen || !isInstaller || installStep !== "pairing") return

    const runPairing = async () => {
      setIsPairing(true)
      setPairingError(null)
      try {
        const response = await fetch("/api/devices/pair-smart-scale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        })

        if (!response.ok) {
          throw new Error("pairing_failed")
        }

        await new Promise((resolve) => setTimeout(resolve, 1200))
        setInstallStep("success")
      } catch {
        setPairingError("Could not pair right now. Please try again.")
      } finally {
        setIsPairing(false)
      }
    }

    runPairing()
  }, [installStep, isInstaller, isOpen, profile])

  const renderInstaller = () => {
    if (!selectedProduct) return null

    return (
      <>
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setShowExitInstall(true)}
            className="w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow-sm flex items-center justify-center"
            aria-label="Exit installation"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
          {installStep === "connect" && (
            <>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-28 h-28 mx-auto object-contain" />
              <h3 className="text-[1.75rem] font-semibold text-center mt-4 text-gray-900">{installTemplate?.connectTitle}</h3>
              <div className="mt-6 space-y-3">
                {installTemplate?.connectSteps.map((text, idx) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold flex items-center justify-center mt-0.5">{idx + 1}</div>
                    <p className="text-[0.98rem] leading-6 text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {installStep === "details" && (
            <>
              <h3 className="text-2xl font-semibold text-gray-900">{installTemplate?.detailTitle}</h3>
              <div className="mt-6 space-y-6">
                <div>
                  <label htmlFor="smart-scale-height-feet" className="text-sm font-medium text-gray-500">Height</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input id="smart-scale-height-feet" value={profile.heightFeet} onChange={(e) => setProfile((prev) => ({ ...prev, heightFeet: e.target.value.replace(/[^0-9]/g, "") }))} className="w-14 border-b border-gray-300 bg-transparent text-2xl py-1 focus:outline-none" />
                    <span className="text-2xl">&apos;</span>
                    <input id="smart-scale-height-inches" value={profile.heightInches} onChange={(e) => setProfile((prev) => ({ ...prev, heightInches: e.target.value.replace(/[^0-9]/g, "") }))} className="w-14 border-b border-gray-300 bg-transparent text-2xl py-1 focus:outline-none" />
                    <span className="text-2xl">&quot;</span>
                    <span className="ml-auto text-xs px-2.5 py-1 border border-gray-300 rounded-full">ft/in</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Gender</p>
                  <div className="flex items-center gap-6">
                    {([{"id":"male","label":"Male"},{"id":"female","label":"Female"}] as const).map((g) => (
                      <button key={g.id} onClick={() => setProfile((prev) => ({ ...prev, gender: g.id }))} className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full border-2 ${profile.gender === g.id ? "border-purple-700" : "border-gray-400"} flex items-center justify-center`}>{profile.gender === g.id && <span className="w-2.5 h-2.5 rounded-full bg-purple-700" />}</span>
                        <span className="text-base text-gray-700">{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="smart-scale-age" className="text-sm font-medium text-gray-500">Age (years)</label>
                  <input id="smart-scale-age" value={profile.age} onChange={(e) => setProfile((prev) => ({ ...prev, age: e.target.value.replace(/[^0-9]/g, "") }))} className="mt-2 block w-full border-b border-gray-300 bg-transparent text-2xl py-1 focus:outline-none" />
                </div>
              </div>
            </>
          )}

          {installStep === "permission" && (
            <div className="max-w-sm mx-auto mt-12 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="w-12 h-12 rounded-full bg-blue-50 mx-auto flex items-center justify-center">
                <Icon name="smartphone" className="text-blue-600" style={{ fontSize: 24 }} />
              </div>
              <h3 className="text-base font-semibold text-center mt-3 text-gray-900">{installTemplate?.permissionTitle}</h3>
              <p className="text-sm text-gray-600 text-center mt-2">{installTemplate?.permissionBody}</p>
              {permissionDenied && <p className="text-xs text-red-600 text-center mt-2">Allow bluetooth access to continue.</p>}
              <div className="mt-4 space-y-2">
                <button onClick={() => setPermissionDenied(true)} className="w-full py-2.5 rounded-xl border border-gray-300 text-sm font-medium">Don&apos;t Allow</button>
                <button onClick={() => { setPermissionDenied(false); setInstallStep("step-on") }} className="w-full py-2.5 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: "var(--app-primary)" }}>Allow</button>
              </div>
            </div>
          )}

          {installStep === "step-on" && (
            <>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-36 h-36 mx-auto object-contain mt-6" />
              <h3 className="text-[1.8rem] font-semibold text-center mt-8 text-gray-900">{installTemplate?.stepOnTitle}</h3>
              <p className="text-lg text-center mt-3 text-gray-600">{installTemplate?.stepOnBody}</p>
            </>
          )}

          {installStep === "pairing" && (
            <div className="h-full flex flex-col items-center justify-center pb-20">
              <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin" />
              <h3 className="text-2xl font-semibold text-gray-900 mt-5">{installTemplate?.pairingTitle}</h3>
              <p className="text-base text-gray-600 mt-2 text-center">{installTemplate?.pairingBody}</p>
              {pairingError && <p className="text-sm text-red-600 mt-3">{pairingError}</p>}
            </div>
          )}

          {installStep === "success" && (
            <div className="h-full flex flex-col items-center justify-center pb-20">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <Icon name="check" className="text-green-700" style={{ fontSize: 28 }} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mt-5">{installTemplate?.successTitle}</h3>
              <p className="text-base text-gray-600 mt-2 text-center">{installTemplate?.successBody}</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 p-4 bg-white">
          {installStep === "connect" && <button onClick={() => setInstallStep("details")} className="h-12 w-full text-white font-semibold rounded-xl" style={{ backgroundColor: "var(--app-primary)" }}>NEXT</button>}
          {installStep === "details" && <button onClick={() => setInstallStep("permission")} className="h-12 w-full text-white font-semibold rounded-xl" style={{ backgroundColor: "var(--app-primary)" }}>CONFIRM</button>}
          {installStep === "step-on" && <button onClick={() => setInstallStep("pairing")} className="h-12 w-full text-white font-semibold rounded-xl" style={{ backgroundColor: "var(--app-primary)" }}>START PAIRING</button>}
          {installStep === "success" && <button onClick={() => { onDeviceConnected?.(buildSmartScaleDevice()); closeOverlay() }} className="h-12 w-full text-white font-semibold rounded-xl" style={{ backgroundColor: "var(--app-primary)" }}>DONE</button>}
          {(installStep === "permission" || (installStep === "pairing" && isPairing)) && <div className="h-12" />}
        </div>
      </>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[200] flex items-end" ref={constraintsRef}>
          <motion.div
            className="absolute inset-0 bg-black"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className={`relative w-full bg-[var(--ds-surface-primary)] shadow-2xl flex flex-col ${isInstaller ? "rounded-none" : "rounded-t-3xl"}`}
            style={isInstaller ? { ...getOverlayStyles("secondary"), height: "100%", minHeight: "100%" } : getOverlayStyles("secondary")}
            initial={{ y: "100%" }}
            animate={{ y: isDragging ? undefined : 0 }}
            exit={{ y: "100%" }}
            transition={getOverlayAnimation()}
            drag="y"
            dragConstraints={{ top: -120, bottom: 420 }}
            dragElastic={{ top: 0.14, bottom: 0.2 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            {!isInstaller && (
              <>
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                <div className="px-6 pb-2">
                  <div className="flex items-center justify-between min-h-8">
                    {view === "products" ? (
                      <button onClick={goBack} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center" aria-label="Back">
                        <Icon name="arrowLeft" className="w-5 h-5" />
                      </button>
                    ) : <span className="w-8 h-8" />}
                    <div className="text-center">
                      <h2 className="text-lg font-semibold text-gray-900">{view === "categories" ? "Pair a Device" : currentCategory?.name}</h2>
                      <p className="text-sm text-gray-500">{view === "categories" ? "Choose a product group" : "Choose a device"}</p>
                    </div>
                    <button onClick={closeOverlay} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center" aria-label="Close">
                      <Icon name="close" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {view === "categories" && (
              <div className="px-6 pb-6 overflow-y-auto space-y-3" style={{ maxHeight: "calc(100% - 120px)", WebkitOverflowScrolling: "touch" }}>
                {DEVICE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategoryId(category.id)
                      setView("products")
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-secondary)]"
                  >
                    <div className={`w-11 h-11 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                    <Icon name="chevronRight" className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {view === "products" && (
              <div className="px-6 pb-6 overflow-y-auto space-y-3" style={{ maxHeight: "calc(100% - 120px)", WebkitOverflowScrolling: "touch" }}>
                {currentProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product)
                      setInstallStep("connect")
                      setView("installer")
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]"
                  >
                    <img src={product.image} alt={product.name} className="w-14 h-14 object-contain rounded-lg bg-white border border-gray-100" />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{product.brand} {product.name}</p>
                      <p className="text-sm text-gray-500">{product.subtitle}</p>
                    </div>
                    <Icon name="chevronRight" className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {isInstaller && renderInstaller()}

            {showExitInstall && (
              <div className="absolute inset-0 z-20 bg-black/45 flex items-end">
                <div className="w-full rounded-t-3xl bg-white border-t border-gray-100 shadow-2xl p-5">
                  <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Exit Installation?</h3>
                  <p className="text-sm text-gray-600 mt-1">If you exit now, pairing will stop and you&apos;ll return to the product list.</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setShowExitInstall(false)} className="flex-1 h-11 rounded-xl border border-gray-300 text-sm font-medium">Stay</button>
                    <button onClick={() => { setShowExitInstall(false); exitInstaller() }} className="flex-1 h-11 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: "var(--app-primary)" }}>Exit</button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
