import { initializeTelemetry } from './telemetry-client'

// Initialize telemetry when the module is imported
if (typeof window !== 'undefined') {
  // Client-side initialization
  const telemetryConfig = {
    endpoint: process.env.NEXT_PUBLIC_MONITORING_ENDPOINT || 'http://localhost:6006/v1/traces',
    enabled: process.env.NEXT_PUBLIC_TELEMETRY_ENABLED !== 'false',
    debug: process.env.NODE_ENV === 'development',
    bufferSize: 25,
    flushInterval: 3000 // 3 seconds
  }
  
  console.log('🔬 Initializing ML monitoring telemetry...', telemetryConfig)
  
  try {
    const client = initializeTelemetry(telemetryConfig)
    console.log('✅ Telemetry initialized successfully')
    
    // Add to window for debugging
    if (process.env.NODE_ENV === 'development') {
      ;(window as any).__telemetryClient = client
    }
  } catch (error) {
    console.error('❌ Failed to initialize telemetry:', error)
  }
} else {
  // Server-side - telemetry will be initialized when first used
  console.log('Server-side telemetry will initialize on first use')
}

// Export for manual initialization if needed
export { initializeTelemetry }