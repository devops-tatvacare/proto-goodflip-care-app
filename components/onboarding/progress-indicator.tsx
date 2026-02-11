"use client"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[var(--text-secondary)]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-[var(--text-secondary)]">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
        <div
          className="bg-[var(--app-primary)] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
