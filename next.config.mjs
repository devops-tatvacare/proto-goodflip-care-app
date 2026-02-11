/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // Suppress ONNX runtime warnings
    ONNXRUNTIME_LOG_SEVERITY_LEVEL: '3',
    OMP_NUM_THREADS: '1',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      }
    }
    
    // Ensure CSS files are not processed by Sucrase
    const rules = config.module.rules
    const cssRule = rules.find(rule => rule.test && rule.test.toString().includes('.css'))
    if (cssRule) {
      cssRule.use = cssRule.use || []
      // Remove any sucrase transformations from CSS processing
      cssRule.use = cssRule.use.filter(loader => {
        if (typeof loader === 'string') {
          return !loader.includes('sucrase')
        }
        if (loader && loader.loader) {
          return !loader.loader.includes('sucrase')
        }
        return true
      })
    }
    
    return config
  },
}

export default nextConfig
