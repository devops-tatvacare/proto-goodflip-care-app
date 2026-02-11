"use client"

import { Icon } from '@/components/ui/icon'
import { useState } from "react"

interface AISummaryDisplayProps {
  isGenerating: boolean
  summary: string | null
  onClose: () => void
  title: string
}

export function AISummaryDisplay({ isGenerating, summary, onClose, title }: AISummaryDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!summary && !isGenerating) return null

  return (
    <div className="bg-[var(--ds-surface-primary)] border-b border-[var(--ds-border-subtle)]">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 m-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Icon name="sparkles" className="w-4 h-4 text-[var(--ds-text-inverse)]" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800">AI Summary</h3>
              <p className="text-xs text-purple-600">{title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-purple-100 rounded-full transition-colors">
            <Icon name="close" className="w-4 h-4 text-purple-600" />
          </button>
        </div>

        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Icon name="loader" className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-purple-700 font-medium">Analyzing your data...</p>
              <p className="text-xs text-purple-600 mt-1">Generating insights and recommendations</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Always show metrics for treatment progress */}
            {title.toLowerCase().includes("treatment") && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                  <div className="text-lg font-bold text-green-700">85%</div>
                  <div className="text-xs text-green-600">Adherence</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                  <div className="text-lg font-bold text-blue-700">12</div>
                  <div className="text-xs text-blue-600">Days Active</div>
                </div>
              </div>
            )}

            {/* Expandable summary text */}
            {(isExpanded || !title.toLowerCase().includes("treatment")) && (
              <div className="max-h-64 overflow-y-auto">
                <div
                  className="text-sm text-gray-700 leading-relaxed whitespace-pre-line prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: summary?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") || "",
                  }}
                />
              </div>
            )}

            {/* Show More/Less button only for treatment progress */}
            {title.toLowerCase().includes("treatment") && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-1 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors border-t border-purple-200 mt-3 pt-3"
              >
                {isExpanded ? (
                  <>
                    <Icon name="chevronUp" className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <Icon name="chevronDown" className="w-4 h-4" />
                    Show More
                  </>
                )}
              </button>
            )}

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-[var(--ds-interactive-primary)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[var(--ds-text-inverse)] text-xs font-bold">i</span>
                </div>
                <p className="text-xs text-blue-700">
                  This AI-generated summary is for informational purposes only. Always consult with your healthcare
                  provider for medical advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
