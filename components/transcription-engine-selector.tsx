'use client'

import { useEffect, useState } from 'react'
import { 
  getCurrentTranscriptionEngine, 
  getTranscriptionEngineStatus,
  switchTranscriptionEngine,
  type TranscriptionEngine 
} from '@/lib/instrumented/unified-transcription'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mic, Globe, Cpu, Zap } from 'lucide-react'

export function TranscriptionEngineSelector() {
  const [currentEngine, setCurrentEngine] = useState<TranscriptionEngine>('whisper')
  const [engineStatus, setEngineStatus] = useState<ReturnType<typeof getTranscriptionEngineStatus>>()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const engine = getCurrentTranscriptionEngine()
    setCurrentEngine(engine)
    setEngineStatus(getTranscriptionEngineStatus())
  }, [])

  const handleEngineChange = (value: string) => {
    const engine = value as TranscriptionEngine
    setCurrentEngine(engine)
    switchTranscriptionEngine(engine)
    
    // Update localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredTranscriptionEngine', engine)
    }
    
    console.log(`🔄 Transcription engine switched to: ${engine}`)
  }

  if (!isClient) {
    return null
  }

  const engineInfo = {
    whisper: {
      name: 'Whisper AI',
      description: 'Local AI model for accurate transcription',
      icon: <Cpu className="w-4 h-4" />,
      pros: ['Works offline', 'High accuracy', 'Privacy-focused'],
      cons: ['Slower processing', 'Uses more resources']
    },
    webspeech: {
      name: 'Web Speech API',
      description: 'Browser\'s built-in speech recognition',
      icon: <Globe className="w-4 h-4" />,
      pros: ['Fast processing', 'Low resource usage'],
      cons: ['Requires internet', 'Browser dependent', 'Less accurate']
    },
    auto: {
      name: 'Auto Select',
      description: 'Automatically choose the best available option',
      icon: <Zap className="w-4 h-4" />,
      pros: ['Best of both worlds', 'Automatic fallback'],
      cons: ['May switch unexpectedly']
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Transcription Engine
        </h3>
        {engineStatus?.recommendedEngine && (
          <Badge variant="secondary" className="text-xs">
            Recommended: {engineInfo[engineStatus.recommendedEngine].name}
          </Badge>
        )}
      </div>

      <RadioGroup value={currentEngine} onValueChange={handleEngineChange}>
        <div className="space-y-3">
          {Object.entries(engineInfo).map(([key, info]) => {
            const isAvailable = key === 'whisper' || 
                              key === 'auto' || 
                              (key === 'webspeech' && engineStatus?.webSpeechAvailable)
            
            return (
              <div 
                key={key} 
                className={`relative rounded-lg border p-4 transition-colors ${
                  !isAvailable ? 'opacity-50' : 'hover:bg-accent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={key} 
                    id={key}
                    disabled={!isAvailable}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label 
                      htmlFor={key} 
                      className="flex items-center gap-2 font-medium cursor-pointer"
                    >
                      {info.icon}
                      {info.name}
                      {currentEngine === key && (
                        <Badge variant="default" className="ml-2 text-xs">
                          Active
                        </Badge>
                      )}
                      {!isAvailable && key === 'webspeech' && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Not Available
                        </Badge>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                    
                    {isAvailable && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <div className="flex flex-wrap gap-1">
                          {info.pros.map((pro, i) => (
                            <span 
                              key={i} 
                              className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                            >
                              ✓ {pro}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {info.cons.map((con, i) => (
                            <span 
                              key={i} 
                              className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded"
                            >
                              • {con}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </RadioGroup>

      {!engineStatus?.webSpeechAvailable && (
        <Alert>
          <AlertDescription className="text-sm">
            Web Speech API is not available in your browser. 
            Using Whisper AI for all transcriptions.
          </AlertDescription>
        </Alert>
      )}

      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          Current configuration: <code className="font-mono bg-muted px-1 py-0.5 rounded">
            NEXT_PUBLIC_TRANSCRIPTION_ENGINE={currentEngine}
          </code>
        </p>
      </div>
    </Card>
  )
}
