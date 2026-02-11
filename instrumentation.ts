export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('🔧 Initializing Next.js instrumentation...')
    console.log('✨ Model preloading disabled (ML models removed)')
  }
}