import { v4 as uuidv4 } from 'uuid'

interface TelemetryConfig {
  endpoint?: string
  enabled?: boolean
  bufferSize?: number
  flushInterval?: number
  debug?: boolean
}

interface TraceContext {
  traceId: string
  spanId: string
  parentSpanId?: string
}

interface ModelTrace {
  trace_id: string
  span_id: string
  parent_span_id?: string
  model_type: string
  model_name?: string
  operation: string
  start_time: number
  end_time?: number
  status?: 'success' | 'error' | 'pending'
  error?: Error
  metadata?: Record<string, any>
  input?: {
    text?: string
    data?: any
  }
  output?: {
    text?: string
    data?: any
    confidence?: number
    alternatives?: any[]
  }
}

class TelemetryClient {
  private config: TelemetryConfig
  private buffer: ModelTrace[] = []
  private flushTimer?: NodeJS.Timeout
  private currentContext?: TraceContext
  private endpoint: string

  constructor(config: TelemetryConfig = {}) {
    this.config = {
      endpoint: config.endpoint || 'http://localhost:6006/v1/traces',
      enabled: config.enabled !== false,
      bufferSize: config.bufferSize || 50,
      flushInterval: config.flushInterval || 5000,
      debug: config.debug || false
    }
    
    this.endpoint = this.config.endpoint!
    
    if (this.config.enabled && this.config.flushInterval! > 0) {
      this.startAutoFlush()
    }
  }

  private log(level: 'debug' | 'info' | 'error', message: string, data?: any) {
    if (!this.config.debug && level === 'debug') return
    
    const prefix = `[Telemetry ${level.toUpperCase()}]`
    if (data) {
      console.log(`${prefix} ${message}`, data)
    } else {
      console.log(`${prefix} ${message}`)
    }
  }

  // Create a new trace context
  startTrace(parentContext?: TraceContext): TraceContext {
    const context: TraceContext = {
      traceId: parentContext?.traceId || uuidv4(),
      spanId: uuidv4(),
      parentSpanId: parentContext?.spanId
    }
    
    this.currentContext = context
    this.log('debug', 'Started trace', context)
    
    return context
  }

  // Get current trace context
  getCurrentContext(): TraceContext | undefined {
    return this.currentContext
  }

  // Record a model operation
  async recordModelOperation<T>(
    modelType: string,
    operation: string,
    fn: () => Promise<T>,
    options: {
      modelName?: string
      input?: { text?: string; data?: any }
      metadata?: Record<string, any>
      context?: TraceContext
    } = {}
  ): Promise<T> {
    if (!this.config.enabled) {
      return fn()
    }

    const context = options.context || this.currentContext || this.startTrace()
    const startTime = Date.now()
    
    const trace: ModelTrace = {
      trace_id: context.traceId,
      span_id: context.spanId,
      parent_span_id: context.parentSpanId,
      model_type: modelType,
      model_name: options.modelName,
      operation,
      start_time: startTime,
      status: 'pending',
      metadata: options.metadata,
      input: options.input
    }

    try {
      const result = await fn()
      
      // Update trace with success
      trace.end_time = Date.now()
      trace.status = 'success'
      
      // Extract output based on result type
      if (result && typeof result === 'object') {
        const output: any = {}
        
        if ('text' in (result as any)) output.text = (result as any).text
        if ('confidence' in (result as any)) output.confidence = (result as any).confidence
        if ('alternatives' in (result as any)) output.alternatives = (result as any).alternatives
        if ('prediction' in (result as any)) output.text = (result as any).prediction
        if ('intent_id' in (result as any)) output.text = (result as any).intent_id
        
        // For transcription results
        if (typeof result === 'string') {
          output.text = result
        }
        
        trace.output = Object.keys(output).length > 0 ? output : { data: result }
      } else if (typeof result === 'string') {
        trace.output = { text: result }
      }

      this.addToBuffer(trace)
      this.log('debug', `Model operation completed: ${modelType}.${operation}`, {
        duration: trace.end_time - startTime,
        status: 'success'
      })
      
      return result
    } catch (error) {
      // Update trace with error
      trace.end_time = Date.now()
      trace.status = 'error'
      trace.error = error as Error
      
      this.addToBuffer(trace)
      this.log('error', `Model operation failed: ${modelType}.${operation}`, error)
      
      throw error
    }
  }

  // Record a metric
  async recordMetric(
    metricName: string,
    value: number,
    tags: Record<string, any> = {}
  ): Promise<void> {
    if (!this.config.enabled) return

    try {
      const response = await fetch(`${this.endpoint.replace('/traces', '/metrics/record')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric_name: metricName,
          metric_value: value,
          model_type: tags.model_type,
          model_name: tags.model_name,
          tags,
          timestamp: Date.now()
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to record metric: ${response.statusText}`)
      }
    } catch (error) {
      this.log('error', 'Failed to record metric', error)
    }
  }

  // Record user feedback
  async recordFeedback(
    traceId: string,
    spanId: string,
    feedbackType: 'positive' | 'negative' | 'correction',
    feedbackText?: string,
    correctedOutput?: string
  ): Promise<void> {
    if (!this.config.enabled) return

    try {
      const response = await fetch(`${this.endpoint.replace('/traces', '/feedback')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trace_id: traceId,
          span_id: spanId,
          feedback_type: feedbackType,
          feedback_text: feedbackText,
          corrected_output: correctedOutput,
          timestamp: Date.now()
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to record feedback: ${response.statusText}`)
      }
    } catch (error) {
      this.log('error', 'Failed to record feedback', error)
    }
  }

  // Add trace to buffer
  private addToBuffer(trace: ModelTrace) {
    this.buffer.push(trace)
    
    if (this.buffer.length >= this.config.bufferSize!) {
      this.flush()
    }
  }

  // Flush buffer to server
  async flush(): Promise<void> {
    if (!this.config.enabled || this.buffer.length === 0) return

    const traces = [...this.buffer]
    this.buffer = []

    try {
      for (const trace of traces) {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trace)
        })
      }
      
      this.log('debug', `Flushed ${traces.length} traces to server`)
    } catch (error) {
      this.log('error', 'Failed to flush traces', error)
      // Re-add to buffer for retry
      this.buffer.unshift(...traces)
    }
  }

  // Start auto-flush timer
  private startAutoFlush() {
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval!)
  }

  // Stop auto-flush timer
  stopAutoFlush() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = undefined
    }
  }

  // Create child span
  createChildSpan(parentContext?: TraceContext): TraceContext {
    const parent = parentContext || this.currentContext
    if (!parent) {
      return this.startTrace()
    }

    return {
      traceId: parent.traceId,
      spanId: uuidv4(),
      parentSpanId: parent.spanId
    }
  }

  // Decorator for automatic tracing
  trace(modelType: string, operation: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value

      descriptor.value = async function (...args: any[]) {
        const telemetry = (globalThis as any).telemetryClient as TelemetryClient
        if (!telemetry) {
          return originalMethod.apply(this, args)
        }

        return telemetry.recordModelOperation(
          modelType,
          operation || propertyKey,
          () => originalMethod.apply(this, args),
          {
            metadata: { method: propertyKey, args: args.length }
          }
        )
      }

      return descriptor
    }
  }
}

// Create singleton instance
let telemetryClient: TelemetryClient | null = null

export function initializeTelemetry(config?: TelemetryConfig): TelemetryClient {
  if (!telemetryClient) {
    telemetryClient = new TelemetryClient(config)
    ;(globalThis as any).telemetryClient = telemetryClient
  }
  return telemetryClient
}

export function getTelemetryClient(): TelemetryClient {
  if (!telemetryClient) {
    telemetryClient = initializeTelemetry()
  }
  return telemetryClient
}

// Convenience functions for direct usage
export async function traceModelOperation<T>(
  modelType: string,
  operation: string,
  fn: () => Promise<T>,
  options?: any
): Promise<T> {
  const client = getTelemetryClient()
  return client.recordModelOperation(modelType, operation, fn, options)
}

export async function recordMetric(
  metricName: string,
  value: number,
  tags?: Record<string, any>
): Promise<void> {
  const client = getTelemetryClient()
  return client.recordMetric(metricName, value, tags)
}

export async function recordFeedback(
  traceId: string,
  spanId: string,
  feedbackType: 'positive' | 'negative' | 'correction',
  feedbackText?: string,
  correctedOutput?: string
): Promise<void> {
  const client = getTelemetryClient()
  return client.recordFeedback(traceId, spanId, feedbackType, feedbackText, correctedOutput)
}

export { TelemetryClient, TraceContext, ModelTrace }